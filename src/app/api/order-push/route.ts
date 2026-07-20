import { NextResponse } from "next/server";
import { getFirebaseAdminMessaging, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";

type PushPayload = {
  orderId?: string;
  customerName?: string;
  total?: number;
  itemsCount?: number;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return jsonError("Firebase Admin n'est pas configure.", 500);
  }

  let payload: PushPayload;
  try {
    payload = (await request.json()) as PushPayload;
  } catch {
    return jsonError("Payload notification invalide.");
  }

  const orderId = payload.orderId?.trim();
  const customerName = payload.customerName?.trim() || "Client";
  const total = Number(payload.total ?? 0);
  const itemsCount = Number(payload.itemsCount ?? 0);

  if (!orderId) {
    return jsonError("orderId manquant.");
  }

  const orderLabel = orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId;
  const body = `${customerName} - ${itemsCount} article(s) - ${total.toFixed(0)} DH`;

  try {
    const messageId = await getFirebaseAdminMessaging().send({
      topic: "admin_orders",
      notification: {
        title: `Nouvelle commande #${orderLabel}`,
        body,
      },
      data: {
        type: "order",
        orderId,
      },
      android: {
        priority: "high",
        notification: {
          channelId: "orders_sound_channel",
          sound: "slot_machine",
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "slot_machine.caf",
          },
        },
      },
    });

    return NextResponse.json({ ok: true, messageId });
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? `Echec envoi FCM: ${error.message}`
        : "Echec envoi FCM.",
      500,
    );
  }
}
