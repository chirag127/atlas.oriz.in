const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

async function getKey(): Promise<CryptoKey | null> {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) return null;
  const keyBytes = Uint8Array.from(
    keyHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );
  return crypto.subtle.importKey("raw", keyBytes, ALGORITHM, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encrypt(plaintext: string): Promise<string | null> {
  const key = await getKey();
  if (!key) return null;
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH * 8 },
    key,
    encoded
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return Buffer.from(combined).toString("base64");
}

export async function decrypt(encrypted: string): Promise<string | null> {
  const key = await getKey();
  if (!key) return null;
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH * 8 },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}
