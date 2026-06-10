import { resend } from "./resend";
import type { Order, OrderItem, Product } from "@prisma/client";

type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

export async function sendOrderConfirmation(order: OrderWithItems) {
  const addr = order.shippingAddr as {
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  };

  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">${i.product.nameEs}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${(i.unitPrice * i.qty).toFixed(2)} €</td>
        </tr>`
    )
    .join("");

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: order.customerEmail,
    subject: `Pedido confirmado #${order.id.slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px">
        <h1 style="font-size:24px;margin-bottom:8px">¡Pedido confirmado! 🐾</h1>
        <p style="color:#555">Hola ${order.customerName}, hemos recibido tu pedido.</p>

        <table style="width:100%;margin:24px 0;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:2px solid #000">
              <th style="text-align:left;padding-bottom:8px">Producto</th>
              <th style="text-align:center;padding-bottom:8px">Qty</th>
              <th style="text-align:right;padding-bottom:8px">Precio</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <p style="font-size:18px;font-weight:bold;text-align:right">Total: ${order.total.toFixed(2)} €</p>

        <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-top:24px">
          <p style="margin:0;font-weight:bold">Dirección de envío</p>
          <p style="margin:4px 0;color:#555">${addr.line1}, ${addr.postal_code} ${addr.city}, ${addr.country}</p>
        </div>

        <p style="margin-top:24px;color:#555">Recibirás otro email con el número de seguimiento cuando tu pedido sea enviado. El plazo estimado es de 3–7 días hábiles.</p>

        <p style="margin-top:32px;font-size:12px;color:#aaa">PetShop · pedido #${order.id.slice(-8).toUpperCase()}</p>
      </div>
    `,
  });
}

export async function sendOrderShipped(order: Order) {
  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: order.customerEmail,
    subject: `Tu pedido está en camino 🚚`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px">
        <h1 style="font-size:24px;margin-bottom:8px">Tu pedido está en camino 🚚</h1>
        <p style="color:#555">Hola ${order.customerName}, tu pedido ha sido enviado.</p>
        ${
          order.trackingCode
            ? `<div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-top:24px">
                <p style="margin:0;font-weight:bold">Número de seguimiento</p>
                <p style="margin:4px 0;font-family:monospace;font-size:16px">${order.trackingCode}</p>
               </div>`
            : ""
        }
        <p style="margin-top:24px;color:#555">El plazo estimado de entrega es de 3–7 días hábiles.</p>
        <p style="margin-top:32px;font-size:12px;color:#aaa">PetShop · pedido #${order.id.slice(-8).toUpperCase()}</p>
      </div>
    `,
  });
}
