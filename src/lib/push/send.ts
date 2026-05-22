import type { PushSubscription } from "./subscribe";

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: { title: string; body?: string; icon?: string; url?: string }
): Promise<boolean> {
  try {
    if (typeof fetch === "undefined") return false;

    await fetch("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, payload }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function sendPushToAll(
  subscriptions: PushSubscription[],
  payload: { title: string; body?: string; icon?: string; url?: string }
): Promise<number> {
  let sent = 0;
  for (const sub of subscriptions) {
    if (await sendPushNotification(sub, payload)) sent++;
  }
  return sent;
}
