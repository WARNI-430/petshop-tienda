import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/emails";
import { createCJOrder } from "@/lib/cj-order";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.payment_intent || session.payment_status !== "paid") return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent.id;

  // Idempotencia: no duplicar si ya existe
  const existing = await db.order.findUnique({ where: { stripeId: paymentIntentId } });
  if (existing) return;

  const items: { productId: string; qty: number }[] = JSON.parse(
    session.metadata?.items ?? "[]"
  );

  const products = await db.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  const addr = (session as unknown as { shipping_details?: { address?: { line1?: string; city?: string; postal_code?: string; country?: string } } }).shipping_details?.address;
  const shippingAddr = {
    line1: addr?.line1 ?? "",
    city: addr?.city ?? "",
    postal_code: addr?.postal_code ?? "",
    country: addr?.country ?? "",
  };

  const total = (session.amount_total ?? 0) / 100;
  const customerEmail = session.customer_details?.email ?? "";
  const customerName = session.customer_details?.name ?? "";

  const order = await db.order.create({
    data: {
      stripeId: paymentIntentId,
      status: "PAID",
      total,
      currency: session.currency ?? "eur",
      customerEmail,
      customerName,
      shippingAddr,
      items: {
        create: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            productId: item.productId,
            qty: item.qty,
            unitPrice: product.price,
          };
        }),
      },
    },
    include: { items: { include: { product: true } } },
  });

  // Enviar email de confirmación al cliente
  await sendOrderConfirmation(order);

  // Crear pedido en CJ (no bloqueante — si falla, el admin puede reintentarlo)
  createCJOrder(order).catch((err) =>
    console.error(`CJ order failed for ${order.id}:`, err)
  );
}
