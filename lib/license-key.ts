import { randomBytes } from "node:crypto"

export function generateLicenseKey() {
  const raw = randomBytes(8).toString("hex").toUpperCase()
  return raw.match(/.{4}/g)!.join("-")
}
