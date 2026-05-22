import type { PushSubscription } from "./subscribe";

export function getVapidKeys() {
  return {
    publicKey: process.env.VAPID_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
    privateKey: process.env.VAPID_PRIVATE_KEY ?? "",
  };
}

export function validateVapidConfig(): boolean {
  const keys = getVapidKeys();
  return !!(keys.publicKey && keys.privateKey);
}
