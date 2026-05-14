#!/usr/bin/env tsx
/**
 * Production Environment Validation Script
 * 
 * Validates that all required environment variables are set before deployment.
 * Run this as part of the deployment process to catch configuration errors early.
 * 
 * Usage:
 *   npx tsx scripts/validate-production-env.ts
 *   
 * Exit codes:
 *   0 = All required variables are set
 *   1 = Missing required variables
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  validate?: (value: string) => boolean;
}

const REQUIRED_ENV_VARS: EnvVar[] = [
  // Database
  {
    name: 'TURSO_DATABASE_URL',
    required: true,
    description: 'Turso database connection URL',
    validate: (v) => v.startsWith('libsql://'),
  },
  {
    name: 'TURSO_AUTH_TOKEN',
    required: true,
    description: 'Turso authentication token',
    validate: (v) => v.length > 20,
  },

  // Email
  {
    name: 'SMTP_HOST',
    required: true,
    description: 'SMTP server hostname',
  },
  {
    name: 'SMTP_PORT',
    required: true,
    description: 'SMTP server port',
    validate: (v) => !isNaN(Number(v)) && Number(v) > 0,
  },
  {
    name: 'SMTP_USER',
    required: true,
    description: 'SMTP username/email',
  },
  {
    name: 'SMTP_PASS_B64',
    required: true,
    description: 'SMTP password (base64 encoded)',
    validate: (v) => v.length > 10,
  },

  // Security
  {
    name: 'CRON_SECRET',
    required: true,
    description: 'Secret for cron endpoint authentication',
    validate: (v) => v.length >= 32,
  },
  {
    name: 'NEXTAUTH_SECRET',
    required: true,
    description: 'NextAuth.js secret for JWT signing',
    validate: (v) => v.length >= 32,
  },
  {
    name: 'NEXTAUTH_URL',
    required: true,
    description: 'NextAuth.js canonical URL',
    validate: (v) => v.startsWith('http'),
  },

  // Payment - Mollie
  {
    name: 'MOLLIE_API_KEY',
    required: true,
    description: 'Mollie API key (live_...)',
    validate: (v) => v.startsWith('live_') || v.startsWith('test_'),
  },

  // Payment - PayPal
  {
    name: 'PAYPAL_CLIENT_ID',
    required: true,
    description: 'PayPal client ID',
  },
  {
    name: 'PAYPAL_CLIENT_SECRET',
    required: true,
    description: 'PayPal client secret',
  },
  {
    name: 'PAYPAL_WEBHOOK_ID',
    required: false,
    description: 'PayPal webhook ID (optional but recommended)',
  },

  // Analytics
  {
    name: 'NEXT_PUBLIC_GTM_ID',
    required: false,
    description: 'Google Tag Manager container ID',
    validate: (v) => !v || v.startsWith('GTM-'),
  },
  {
    name: 'NEXT_PUBLIC_GA_ID',
    required: false,
    description: 'Google Analytics 4 measurement ID',
    validate: (v) => !v || v.startsWith('G-'),
  },

  // Site
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    required: true,
    description: 'Canonical site URL',
    validate: (v) => v.startsWith('https://'),
  },
  {
    name: 'NODE_ENV',
    required: true,
    description: 'Node environment',
    validate: (v) => v === 'production' || v === 'development',
  },

  // Optional
  {
    name: 'CDN_BASE_URL',
    required: false,
    description: 'CDN base URL for media assets',
    validate: (v) => !v || v.startsWith('http'),
  },
];

interface ValidationResult {
  name: string;
  status: 'ok' | 'missing' | 'invalid';
  value?: string;
  error?: string;
}

function validateEnv(): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar.name];

    if (!value) {
      if (envVar.required) {
        results.push({
          name: envVar.name,
          status: 'missing',
          error: `Required variable not set: ${envVar.description}`,
        });
      } else {
        results.push({
          name: envVar.name,
          status: 'ok',
          value: '(optional, not set)',
        });
      }
      continue;
    }

    if (envVar.validate && !envVar.validate(value)) {
      results.push({
        name: envVar.name,
        status: 'invalid',
        value: value.substring(0, 20) + '...',
        error: `Invalid format: ${envVar.description}`,
      });
      continue;
    }

    const maskedValue = envVar.name.includes('SECRET') || envVar.name.includes('TOKEN') || envVar.name.includes('PASS')
      ? '***' + value.substring(value.length - 4)
      : value.substring(0, 30) + (value.length > 30 ? '...' : '');

    results.push({
      name: envVar.name,
      status: 'ok',
      value: maskedValue,
    });
  }

  return results;
}

function printResults(results: ValidationResult[]): void {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  PRODUCTION ENVIRONMENT VALIDATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const ok = results.filter((r) => r.status === 'ok');
  const missing = results.filter((r) => r.status === 'missing');
  const invalid = results.filter((r) => r.status === 'invalid');

  if (ok.length > 0) {
    console.log('✅ Valid Environment Variables:\n');
    for (const result of ok) {
      console.log(`  ${result.name.padEnd(30)} = ${result.value}`);
    }
    console.log('');
  }

  if (invalid.length > 0) {
    console.log('⚠️  Invalid Environment Variables:\n');
    for (const result of invalid) {
      console.log(`  ${result.name.padEnd(30)} = ${result.value}`);
      console.log(`     Error: ${result.error}`);
    }
    console.log('');
  }

  if (missing.length > 0) {
    console.log('❌ Missing Required Environment Variables:\n');
    for (const result of missing) {
      console.log(`  ${result.name.padEnd(30)} - ${result.error}`);
    }
    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Total: ${results.length} | ✅ ${ok.length} | ⚠️  ${invalid.length} | ❌ ${missing.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

function main(): void {
  const results = validateEnv();
  printResults(results);

  const hasErrors = results.some((r) => r.status === 'missing' || r.status === 'invalid');

  if (hasErrors) {
    console.error('❌ Environment validation FAILED. Fix the errors above before deploying.\n');
    process.exit(1);
  }

  console.log('✅ Environment validation PASSED. All required variables are set.\n');
  process.exit(0);
}

main();
