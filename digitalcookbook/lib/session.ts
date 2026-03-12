// app/lib/session.ts
/*WARNING: this file is more AI generated because IDK cyber security. */
//get secret encoding token from .env
const SECRET_KEY = process.env.SESSION_SECRET!;
const encoder = new TextEncoder();

//Derive a crypto key from the secret
async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(data: any) {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM IV

  const encoded = encoder.encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  // Combine IV + encrypted data
  const buffer = new Uint8Array(iv.byteLength + encrypted.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(encrypted), iv.byteLength);

  return Buffer.from(buffer).toString("base64");
}

export async function decrypt(cookieValue: string) {
  const key = await getKey();
  const buffer = Buffer.from(cookieValue, "base64");

  const iv = buffer.subarray(0, 12);
  const encrypted = buffer.subarray(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );

  const decoded = new TextDecoder().decode(decrypted);
  return JSON.parse(decoded);
}