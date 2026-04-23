/**
 * Trigger Invoice Email
 * =========================================
 * Directly calls generateAndSendInvoice() and returns a Promise.
 * Includes deduplication to prevent double-sends from webhook + callback racing.
 *
 * Usage:
 *   await triggerInvoiceEmail(orderId);           // Awaited (preferred)
 *   triggerInvoiceEmail(orderId).catch(console.error); // Background with safety
 */

import { generateAndSendInvoice } from '@/lib/invoice';

// Track which orders have already been triggered (prevent duplicate emails)
const triggeredOrders = new Set<string>();

/**
 * Triggers invoice generation + email sending.
 * Returns a Promise so callers can await it.
 * Includes deduplication to prevent double-sends from webhook + callback racing.
 */
export async function triggerInvoiceEmail(orderId: string): Promise<{ success: boolean; error?: string }> {
  // Deduplication: if this orderId was already triggered recently, skip
  if (triggeredOrders.has(orderId)) {
    console.log(`[triggerInvoice] Already triggered for order ${orderId} — skipping duplicate`);
    return { success: true };
  }

  // Mark as triggered (clear after 5 minutes to allow manual retries)
  triggeredOrders.add(orderId);
  setTimeout(() => triggeredOrders.delete(orderId), 5 * 60 * 1000);

  console.log(`[triggerInvoice] EMAIL_TRIGGERED for order ${orderId}`);

  try {
    const result = await generateAndSendInvoice(orderId);

    if (result.success && result.emailSent) {
      console.log(`[triggerInvoice] EMAIL_SENT_SUCCESS for order ${orderId}: invoice=${result.invoiceNumber}`);
      return { success: true };
    } else if (result.success && !result.emailSent) {
      console.error(`[triggerInvoice] PDF generated but EMAIL_FAILED for order ${orderId}: ${result.error}`);
      return { success: false, error: result.error };
    } else {
      console.error(`[triggerInvoice] EMAIL_ERROR for order ${orderId}: ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[triggerInvoice] FATAL_ERROR for order ${orderId}:`, err);
    return { success: false, error: errorMsg };
  }
}
