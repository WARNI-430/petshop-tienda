import { NextRequest, NextResponse } from "next/server";
import { cjFetch } from "@/lib/cj";
import { db } from "@/lib/db";
import { z } from "zod";

const bodySchema = z.object({
  cjProductId: z.string(),
  price: z.number().positive(),          // precio de venta que tú decides
  nameEs: z.string().optional(),
  nameEn: z.string().optional(),
  descEs: z.string().optional(),
  descEn: z.string().optional(),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  // Proteger con ADMIN_SECRET
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { cjProductId, price, nameEs, nameEn, descEs, descEn } = parsed.data;

  // Obtener detalles del producto en CJ
  const data = await cjFetch(`/product/query?pid=${cjProductId}`);
  if (!data.result || !data.data) {
    return NextResponse.json({ error: "Product not found in CJ" }, { status: 404 });
  }

  const cj = data.data;
  const productNameEn = nameEn ?? cj.productNameEn ?? cj.productName ?? "Product";
  const productNameEs = nameEs ?? productNameEn;
  const productDescEn = descEn ?? cj.productUnit ?? "";
  const productDescEs = descEs ?? productDescEn;

  const images: string[] = (cj.productImageSet ?? "").split(",").filter(Boolean).slice(0, 5);
  const costPrice: number = parseFloat(cj.sellPrice ?? cj.productPrice ?? "0");

  const slug = slugify(productNameEn) + "-" + cjProductId.slice(-6);

  const product = await db.product.upsert({
    where: { cjProductId },
    create: {
      cjProductId,
      slug,
      nameEs: productNameEs,
      nameEn: productNameEn,
      descEs: productDescEs,
      descEn: productDescEn,
      images,
      price,
      costPrice,
      stock: parseInt(cj.productStock ?? "99"),
      active: true,
    },
    update: {
      costPrice,
      stock: parseInt(cj.productStock ?? "99"),
      images,
    },
  });

  return NextResponse.json({ product });
}
