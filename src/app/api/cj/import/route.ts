import { NextRequest, NextResponse } from "next/server";
import { cjFetch } from "@/lib/cj";
import { db } from "@/lib/db";
import { z } from "zod";

const bodySchema = z.object({
  cjProductId: z.string(),
  price: z.number().positive(),
  nameEs: z.string().optional(),
  nameEn: z.string().optional(),
  descEs: z.string().optional(),
  descEn: z.string().optional(),
  costPrice: z.number().optional(),
  imageUrl: z.string().optional(),
  stock: z.number().optional(),
  skipCjFetch: z.boolean().optional(),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  // Proteger: acepta header x-admin-secret O cookie admin_auth
  const headerSecret = req.headers.get("x-admin-secret");
  const cookieSecret = req.cookies.get("admin_auth")?.value;
  if (headerSecret !== process.env.ADMIN_SECRET && cookieSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { cjProductId, price, nameEs, nameEn, descEs, descEn, costPrice: manualCost, imageUrl, stock: manualStock, skipCjFetch } = parsed.data;

  let productNameEn = nameEn ?? "Product";
  let productNameEs = nameEs ?? productNameEn;
  let productDescEn = descEn ?? "";
  let productDescEs = descEs ?? "";
  let images: string[] = imageUrl ? [imageUrl] : [];
  let costPrice: number = manualCost ?? 0;
  let stock = manualStock ?? 99;

  // Try CJ API fetch unless skipped
  if (!skipCjFetch) {
    try {
      const data = await cjFetch(`/product/query?pid=${cjProductId}`);
      if (data.result && data.data) {
        const cj = data.data;
        productNameEn = nameEn ?? cj.productNameEn ?? cj.productName ?? "Product";
        productNameEs = nameEs ?? productNameEn;
        productDescEn = descEn ?? cj.productUnit ?? "";
        productDescEs = descEs ?? productDescEn;
        images = (cj.productImageSet ?? "").split(",").filter(Boolean).slice(0, 5);
        costPrice = parseFloat(cj.sellPrice ?? cj.productPrice ?? "0");
        stock = parseInt(cj.productStock ?? "99");
      }
    } catch {
      // CJ API unavailable — use manual data provided
    }
  }

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
      stock,
      active: true,
    },
    update: {
      costPrice,
      stock,
      images,
    },
  });

  return NextResponse.json({ product });
}
