/**
 * Payment Logger — Structured Debug Logging
 * ===========================================
 * Provides consistent, traceable logging for the entire payment flow.
 * Every log entry includes orderId + paymentId for easy correlation.
 *
 * Debug mode: Set PAYMENT_DEBUG=true to enable verbose payload logging.
 * In production without debug mode, only key events are logged.
 */

const IS_DEBUG = process.env.PAYMENT_DEBUG === 'true';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface PaymentLogContext {
  orderId?: string;
  orderNumber?: number | string;
  paymentId?: string;
  method?: string | null;
  amount?: string;
  status?: string;
  [key: string]: unknown;
}

function formatLog(tag: string, level: LogLevel, message: string, ctx?: PaymentLogContext): string {
  const ts = new Date().toISOString();
  const base = `[${tag}] ${message}`;
  if (!ctx || Object.keys(ctx).length === 0) return `${ts} ${base}`;

  // Build a compact key=value string for easy grep
  const parts = Object.entries(ctx)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => {
      if (typeof v === 'object') return `${k}=${JSON.stringify(v)}`;
      return `${k}=${v}`;
    });
  return `${ts} ${base} | ${parts.join(' | ')}`;
}

function log(tag: string, level: LogLevel, message: string, ctx?: PaymentLogContext) {
  const formatted = formatLog(tag, level, message, ctx);
  switch (level) {
    case 'error':
      console.error(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'debug':
      if (IS_DEBUG) console.log(formatted);
      break;
    default:
      console.log(formatted);
  }
}

/* ── Specialized loggers for each payment stage ─────────── */

export const paymentLog = {
  /** Log when checkout starts */
  checkoutStart(ctx: { orderId?: string; orderNumber: number; method: string; amount: string; email: string; ip: string }) {
    log('CHECKOUT_START', 'info', 'New checkout initiated', {
      orderNumber: ctx.orderNumber,
      method: ctx.method,
      amount: ctx.amount,
    });
    log('CHECKOUT_START', 'debug', 'Full checkout context', ctx as any);
  },

  /** Log order created in DB */
  orderCreated(ctx: { orderId: string; orderNumber: number; total: string; method: string; invoiceNumber: string }) {
    log('ORDER_CREATED', 'info', `Order #${ctx.orderNumber} created`, ctx);
  },

  /** Log when Mollie payment creation is attempted */
  mollieCreateAttempt(ctx: { orderId: string; orderNumber: number; method: string; amount: string; isTestMode: boolean }) {
    log('MOLLIE_CREATE', 'info', `Creating Mollie payment for Order #${ctx.orderNumber}`, ctx);
  },

  /** Log full Mollie request payload (debug only) */
  mollieRequestPayload(payload: Record<string, any>) {
    log('MOLLIE_CREATE', 'debug', 'Mollie API request payload', { payload } as any);
  },

  /** Log Mollie payment created successfully */
  mollieCreated(ctx: { orderId: string; orderNumber: number; paymentId: string; status: string; checkoutUrl: string }) {
    log('MOLLIE_CREATED', 'info', `Payment ${ctx.paymentId} created → ${ctx.status}`, ctx);
  },

  /** Log Mollie payment creation failure */
  mollieCreateFailed(ctx: { orderId: string; orderNumber: number; method: string; error: string; statusCode?: string | number }) {
    log('MOLLIE_CREATE_FAIL', 'error', `Mollie payment creation failed`, ctx);
  },

  /** Log method fallback (retry without specific method) */
  mollieFallback(ctx: { orderId: string; orderNumber: number; originalMethod: string }) {
    log('MOLLIE_FALLBACK', 'warn', `Method ${ctx.originalMethod} unavailable, retrying without method`, ctx);
  },

  /** Log webhook received */
  webhookReceived(ctx: { paymentId: string }) {
    log('WEBHOOK_RECEIVED', 'info', `Webhook received for payment ${ctx.paymentId}`, ctx);
  },

  /** Log webhook payment status */
  webhookStatus(ctx: { paymentId: string; orderId: string; orderNumber?: string; status: string; method?: string | null; amount?: any; failureReason?: any; details?: any }) {
    const level: LogLevel = (ctx.status === 'failed' || ctx.status === 'canceled' || ctx.status === 'expired') ? 'error' : 'info';
    log('WEBHOOK_STATUS', level, `Payment ${ctx.paymentId} → ${ctx.status}`, ctx);
  },

  /** Log webhook DB update */
  webhookUpdated(ctx: { orderId: string; paymentId: string; orderStatus: string; paymentStatus: string }) {
    log('WEBHOOK_UPDATED', 'info', `Order updated: ${ctx.orderStatus}, payment: ${ctx.paymentStatus}`, ctx);
  },

  /** Log callback received (user redirect from Mollie) */
  callbackReceived(ctx: { orderId: string; orderNumber?: number }) {
    log('CALLBACK_RECEIVED', 'info', `User returned from payment`, ctx);
  },

  /** Log callback payment status check */
  callbackStatus(ctx: { orderId: string; paymentId: string; status: string; method?: string | null; failureReason?: any; details?: any }) {
    const level: LogLevel = (ctx.status === 'failed' || ctx.status === 'canceled' || ctx.status === 'expired') ? 'error' : 'info';
    log('CALLBACK_STATUS', level, `Payment ${ctx.paymentId} → ${ctx.status}`, ctx);
  },

  /** Log PayPal payment events */
  paypalCreate(ctx: { orderId: string; orderNumber: number; amount: string; paypalOrderId?: string }) {
    log('PAYPAL_CREATE', 'info', `PayPal order created for Order #${ctx.orderNumber}`, ctx);
  },

  paypalFailed(ctx: { orderId: string; orderNumber: number; error: string }) {
    log('PAYPAL_CREATE_FAIL', 'error', `PayPal creation failed for Order #${ctx.orderNumber}`, ctx);
  },

  /** Log email triggers */
  emailTriggered(ctx: { orderId: string; success: boolean; error?: string }) {
    if (ctx.success) {
      log('EMAIL', 'info', `Invoice email sent for order ${ctx.orderId}`, ctx);
    } else {
      log('EMAIL', 'error', `Invoice email FAILED for order ${ctx.orderId}`, ctx);
    }
  },

  /** Generic debug log */
  debug(tag: string, message: string, ctx?: PaymentLogContext) {
    log(tag, 'debug', message, ctx);
  },

  /** Check if debug mode is enabled */
  isDebug: IS_DEBUG,
};
