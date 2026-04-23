import prisma from '@/lib/prisma';

/**
 * Links all guest orders (and invoices) to a registered customer account.
 * Uses a single bulk UPDATE query per table — no loops.
 *
 * Called after registration AND login to catch any unlinked orders.
 * Safe to call multiple times (idempotent — only updates where customerId IS NULL).
 */
export async function linkGuestOrders(
  email: string,
  customerId: string
): Promise<number> {
  const normalizedEmail = email.toLowerCase().trim();

  // Bulk link orders: billingEmail matches AND not yet linked
  const result = await prisma.order.updateMany({
    where: {
      billingEmail: normalizedEmail,
      customerId: null,
      deletedAt: null,
    },
    data: { customerId },
  });

  // Also bulk link invoices with matching billingEmail
  if (result.count > 0) {
    await prisma.invoice.updateMany({
      where: {
        billingEmail: normalizedEmail,
        customerId: null,
      },
      data: { customerId },
    });
  }

  return result.count;
}
