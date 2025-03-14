import * as crypto from "crypto";

interface OTPOptions {
  length?: number;
  type?: "numeric" | "alphabet" | "alphanumeric";
  secret?: string;
  counter?: number;
  timeStep?: number;
}

/**
 * Generate an OTP based on the selected options.
 * @param options Options for character inclusion (type: numeric, alphabet, alphanumeric)
 * @returns OTP string
 */
export function generate(options: OTPOptions = {}): string {
  const length = options.length || 6;
  let chars = "";
  const type = options.type || "numeric";

  switch (type) {
    case "numeric":
      chars = "0123456789";
      break;
    case "alphabet":
      chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      break;
    case "alphanumeric":
      chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      break;
    default:
      throw new Error("Invalid OTP type specified.");
  }

  if (options.counter !== undefined && options.secret) {
    const key = Buffer.from(options.secret, "ascii");
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeUInt32BE(options.counter, 4);

    const hmac = crypto.createHmac("sha1", key).update(counterBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary =
      ((hmac[offset] & 0x7f) << 24) |
      (hmac[offset + 1] << 16) |
      (hmac[offset + 2] << 8) |
      hmac[offset + 3];

    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += chars[binary % chars.length];
    }
    return otp;
  }

  if (options.timeStep !== undefined && options.secret) {
    const timeCounter = Math.floor(Date.now() / 1000 / options.timeStep);
    const key = Buffer.from(options.secret, "ascii");
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeUInt32BE(timeCounter, 4);

    const hmac = crypto.createHmac("sha1", key).update(counterBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary =
      ((hmac[offset] & 0x7f) << 24) |
      (hmac[offset + 1] << 16) |
      (hmac[offset + 2] << 8) |
      hmac[offset + 3];

    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += chars[binary % chars.length];
    }
    return otp;
  }

  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(chars.length);
    otp += chars[randomIndex];
  }

  return otp;
}
