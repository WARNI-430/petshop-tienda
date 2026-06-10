import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cjFetch } from "@/lib/cj";

// Actualiza stock y precio de coste de todos los productos activos
export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({ where: { active: true } });
  let updated = 0;

  for (const product of products) {
    try {
      // Respetar rate limit de CJ (60 req/min)
      await new Promise((r) => setTimeout(r, 1100));

      const data = await cjFetch(`/product/query?pid=${product.cjProductId}`);
      if (!data.result || !data.data) continue;

      const cj = data.data;
      const newStock = parseInt(cj.productStock ?? "0");
      const newCostPrice = parseFloat(cj.sellPrice ?? cj.productPrice ?? "0");

      await db.product.update({
        where: { id: product.id },
        data: { stock: newStock, costPrice: newCostPrice },
      });
      updated++;
    } catch {
      // continuar con el siguiente
    }
  }

  return NextResponse.json({ updated, total: products.length });
}
