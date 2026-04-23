/**
 * SMTP Test API
 * ==============
 * GET /api/test-smtp — Tests SMTP connectivity and sends a test email.
 * Protected by CRON_SECRET query param.
 *
 * Usage: curl "https://domain.com/api/test-smtp?secret=YOUR_CRON_SECRET&to=test@example.com"
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET || '';

  if (!cronSecret || secret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const to = request.nextUrl.searchParams.get('to') || process.env.ADMIN_EMAIL || '';
  if (!to) {
    return NextResponse.json({ error: 'No recipient specified' }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST || 'smtp.titan.email';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS_B64
    ? Buffer.from(process.env.SMTP_PASS_B64, 'base64').toString('utf-8')
    : process.env.SMTP_PASS || '';
  const fromEmail = process.env.EMAIL_FROM || smtpUser;
  const fromName = process.env.EMAIL_FROM_NAME || 'Online Auto Abmelden';

  const diagnostics: Record<string, unknown> = {
    smtpHost,
    smtpPort,
    smtpUser,
    passSource: process.env.SMTP_PASS_B64 ? 'SMTP_PASS_B64' : 'SMTP_PASS',
    passLength: smtpPass.length,
    fromEmail,
    to,
  };

  if (!smtpPass) {
    return NextResponse.json({ error: 'SMTP password not configured', diagnostics }, { status: 500 });
  }

  try {
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.default.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
      logger: true,
      debug: true,
    });

    // Step 1: Verify connection
    diagnostics.step = 'verify';
    await transporter.verify();
    diagnostics.verifyResult = 'SUCCESS';

    // Step 2: Send test email
    diagnostics.step = 'sendMail';
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: `[SMTP Test] ${new Date().toISOString()}`,
      text: `This is a test email sent at ${new Date().toISOString()} from the SMTP test endpoint.\n\nIf you received this, SMTP is working correctly.`,
      html: `<h2>SMTP Test Successful</h2><p>Sent at: ${new Date().toISOString()}</p><p>Host: ${smtpHost}:${smtpPort}</p>`,
    });

    diagnostics.sendResult = 'SUCCESS';
    diagnostics.messageId = info.messageId;
    diagnostics.response = info.response;

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${to}`,
      diagnostics,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    diagnostics.error = errorMsg;
    diagnostics.errorType = err instanceof Error ? err.constructor.name : typeof err;

    return NextResponse.json({
      success: false,
      error: errorMsg,
      diagnostics,
    }, { status: 500 });
  }
}
