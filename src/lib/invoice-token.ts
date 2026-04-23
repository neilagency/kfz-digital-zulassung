import { createHmac } from 'crypto';

const SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback-secret';

/**
 * Generate a short HMAC-based access token for an invoice.
 * This allows sharing invoice URLs securely without requiring authentication.
 */
export function generateInvoiceToken(invoiceNumber: string): string {
  return createHmac('sha256', SECRET)
    .update(invoiceNumber)
    .digest('hex')
    .slice(0, 16); // 16 hex chars = 64 bits, sufficient for URL token
}

/**
 * Verify an invoice access token matches the expected invoice number.
 */
export function verifyInvoiceToken(invoiceNumber: string, token: string): boolean {
  const expected = generateInvoiceToken(invoiceNumber);
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== token.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return result === 0;
}
