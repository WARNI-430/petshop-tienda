import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cjFetch } from "@/lib/cj";
import { sendOrderShipped } from "@/lib/emails";

// Llamar periódicamente (Vercel Cron o manualmente)
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await db.order.findMany({
    where: { status: "PROCESSING", cjOrderId: { not: null } },
  });

  let updated = 0;
  for (const order of orders) {
    try {
      const data = await cjFetch(`/shopping/order/getOrderDetail?orderId=${order.cjOrderId}`);
      if (!data.result) continue;

      const trackingNumber = data.data?.trackNumber;
      if (!trackingNumber) continue;

      await db.order.update({
        where: { id: order.id },
        data: { status: "SHIPPED", trackingCode: trackingNumber },
      });

      await sendOrderShipped({ ...order, trackingCode: trackingNumber });
      updated++;
    } catch {
      // continuar con el siguiente pedido si uno falla
    }
  }

  return NextResponse.json({ updated });
}
