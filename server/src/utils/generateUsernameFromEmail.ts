export function generateUsernameFromEmail(email: string): string {
  const localPart = email.split("@")[0];
  const base = localPart.replace(/[^a-zA-Z0-9]/g, "_");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}_${randomSuffix}`;
}
