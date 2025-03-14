import * as crypto from "crypto";

interface OTPOptions {
  length?: number; // Length of the OTP
  type?: "numeric" | "alphabet" | "alphanumeric"; // Type of OTP: numeric, alphabet, or alphanumeric
  secret?: string; // Secret key for HOTP and TOTP (required for both)
  counter?: number; // Counter for HOTP (required for HOTP)
  timeStep?: number; // Time step for TOTP (required for TOTP)
}

/**
 * Generate an OTP based on the selected options.
 * @param options Options for character inclusion (type: numeric, alphabet, alphanumeric)
 * @returns OTP string
 */
export const generate = (options: OTPOptions = {}): string => {
  const length = options.length || 6; // Default to 6 if not provided
  let chars = "";
  const type = options.type || "numeric"; // Default to numeric if not provided

  // Define the character sets based on the type
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

  // HOTP (HMAC-based OTP) generation
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

    // Truncate to the desired OTP length and map the binary value to the chars set
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += chars[binary % chars.length]; // Map binary value to chars
    }
    return otp;
  }

  // TOTP (Time-based OTP) generation
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

    // Truncate to the desired OTP length and map the binary value to the chars set
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += chars[binary % chars.length]; // Map binary value to chars
    }
    return otp;
  }

  // Generate a random OTP if neither counter nor timeStep is provided
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }

  return otp;
};

// Example usage
console.log("Numeric OTP:", generate({ length: 6, type: "numeric" }));
console.log("Alphabet OTP:", generate({ length: 6, type: "alphabet" }));
console.log("Alphanumeric OTP:", generate({ length: 8, type: "alphanumeric" }));
console.log(
  "HOTP (Numeric):",
  generate({
    length: 6,
    type: "numeric",
    counter: 1,
    secret: "your-secret-key",
  })
);
console.log(
  "TOTP (Alphanumeric):",
  generate({
    length: 8,
    type: "alphanumeric",
    timeStep: 30,
    secret: "your-secret-key",
  })
);
