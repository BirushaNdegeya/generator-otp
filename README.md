# Generator OTP

A simple and secure OTP (One-Time Password) generator built with TypeScript. Supports time-based (TOTP) and counter-based (HOTP) OTPs for authentication and security purposes.

## Installation

To install the package, use npm:

```sh
npm install generator-otp
```

Or using yarn:

```sh
yarn add generator-otp
```

## Usage

Import the module and generate OTPs easily:

```ts
import { generate } from "generator-otp";

// Generate Numeric OTP
console.log("Numeric OTP:", generate({ length: 6, type: "numeric" }));

// Generate Alphabet OTP
console.log("Alphabet OTP:", generate({ length: 6, type: "alphabet" }));

// Generate Alphanumeric OTP
console.log("Alphanumeric OTP:", generate({ length: 8, type: "alphanumeric" }));

// Generate HOTP (Numeric)
const hotp = generate({
  length: 6,
  type: "numeric",
  counter: 1,
  secret: "your-secret-key",
});
console.log("HOTP (Numeric):", hotp);

// Generate TOTP (Alphanumeric)
const totp = generate({
  length: 8,
  type: "alphanumeric",
  timeStep: 30,
  secret: "your-secret-key",
});
console.log("TOTP (Alphanumeric):", totp);
```

## API

```javascript
generate(options?: OTPOptions): string
```

### Generates a One-Time Password (OTP) based on the provided options.

#### Parameters

    length (number, optional, default: 6): The length of the OTP.
    type (string, optional, default: "numeric"): The type of OTP. Can be:
        "numeric": Digits only.
        "alphabet": Uppercase and lowercase letters.
        "alphanumeric": Digits and letters (both uppercase and lowercase).
    secret (string, optional): The secret key for generating HOTP or TOTP.
    counter (number, optional): The counter value for generating HOTP.
    timeStep (number, optional): The time step (in seconds) for generating TOTP.

## License

This project is licensed under the Apache License.
