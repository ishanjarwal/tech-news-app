export function generateOTP(length: number): string {
  if (length <= 0) {
    throw new Error("OTP length must be a positive integer.");
  }

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp.toString();
}
