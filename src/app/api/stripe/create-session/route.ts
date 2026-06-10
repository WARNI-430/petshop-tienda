import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { z } from "zod";

const bodySchema = z.object({
  items: z.array(
    z.object({ productId: z.string(), qty: z.number().int().positive() })
  ),
  locale: z.enum(["es", "en"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { items, locale } = parsed.data;
  const productIds = items.map((i) => i.productId);

  const products = await db.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "Some products are unavailable" }, { status: 400 });
  }

  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const name = locale === "es" ? product.nameEs : product.nameEn;
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name,
          images: product.images.slice(0, 1),
          metadata: { productId: product.id },
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.qty,
    };
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: ["ES", "FR", "DE", "IT", "PT", "NL", "BE", "AT", "PL"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 395, currency: "eur" },
          display_name: locale === "es" ? "Envío estándar (3–7 días)" : "Standard shipping (3–7 days)",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "eur" },
          display_name: locale === "es" ? "Envío gratis (pedidos +50 €)" : "Free shipping (orders +€50)",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 10 },
          },
        },
      },
    ],
    success_url: `${appUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/${locale}/cart`,
    metadata: {
      items: JSON.stringify(items),
      locale,
    },
  });

  return NextResponse.json({ url: session.url });
}
