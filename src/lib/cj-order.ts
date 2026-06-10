import { cjFetch } from "./cj";
import { db } from "./db";
import type { Order, OrderItem, Product } from "@prisma/client";

type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

export async function createCJOrder(order: OrderWithItems) {
  // Idempotencia: no crear si ya tiene cjOrderId
  if (order.cjOrderId) return;

  const addr = order.shippingAddr as {
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  };

  const products = order.items.map((item) => ({
    vid: item.product.cjProductId,
    quantity: item.qty,
  }));

  const payload = {
    orderNumber: order.id,
    shippingCountry: addr.country,
    shippingZip: addr.postal_code,
    shippingCity: addr.city,
    shippingAddress: addr.line1,
    shippingCustomerName: order.customerName,
    shippingPhone: "000000000", // Stripe no recoge teléfono; CJ lo requiere
    products,
    logisticName: "CJPacket",   // método de envío por defecto para UE
  };

  const data = await cjFetch("/shopping/order/createOrder", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!data.result) {
    throw new Error(`CJ order failed: ${data.message}`);
  }

  const cjOrderId: string = data.data?.orderId ?? data.data?.orderNum;

  await db.order.update({
    where: { id: order.id },
    data: { cjOrderId, status: "PROCESSING" },
  });

  return cjOrderId;
}
