import { PrismaClient } from '../src/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin user ──
  const hashedPassword = await bcrypt.hash('admin2026!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@onlineautoabmelden.com' },
    update: {},
    create: {
      email: 'admin@onlineautoabmelden.com',
      password: hashedPassword,
      name: 'IKFZ Admin',
      role: 'admin',
    },
  });
  console.log(`  ✅ Admin user: ${admin.email}`);

  // ── Products ──
  const abmeldung = await prisma.product.upsert({
    where: { slug: 'fahrzeugabmeldung' },
    update: {},
    create: {
      name: 'Fahrzeug jetzt online abmelden',
      slug: 'fahrzeugabmeldung',
      price: 19.70,
      serviceType: 'abmeldung',
      wpProductId: 988859,
      description: 'KFZ online abmelden in 2 Minuten – offiziell über GKS-Schnittstelle',
      options: JSON.stringify([
        { name: 'Kennzeichen reservieren (1 Jahr)', price: 4.70, key: 'reservierung' },
      ]),
    },
  });

  const anmeldung = await prisma.product.upsert({
    where: { slug: 'auto-online-anmelden' },
    update: {},
    create: {
      name: 'Fahrzeug jetzt online anmelden',
      slug: 'auto-online-anmelden',
      price: 0,
      serviceType: 'anmeldung',
      wpProductId: 995959,
      description: 'Fahrzeug online anmelden – Zulassung in 5 Minuten',
      options: JSON.stringify([
        { name: 'Anmelden (Neuzulassung)', price: 124.70, key: 'neuzulassung' },
        { name: 'Ummelden', price: 119.70, key: 'ummeldung' },
        { name: 'Wiederzulassung', price: 99.70, key: 'wiederzulassung' },
        { name: 'Neuwagen Zulassung', price: 99.70, key: 'neuwagen' },
        { name: 'Reserviertes Kennzeichen', price: 24.70, key: 'kennzeichen_reserviert' },
        { name: 'Kennzeichen mitbestellen', price: 29.70, key: 'kennzeichen_bestellen' },
      ]),
    },
  });
  console.log(`  ✅ Products: ${abmeldung.name}, ${anmeldung.name}`);

  // ── Payment gateways ──
  const gateways = [
    {
      gatewayId: 'mollie_creditcard',
      name: 'Kredit- / Debitkarte',
      description: 'Visa, Mastercard, American Express via Mollie',
      isEnabled: true,
      fee: 0.50,
      icon: '/images/payment/card.svg',
      sortOrder: 1,
    },
    {
      gatewayId: 'paypal',
      name: 'PayPal',
      description: 'Schnell & sicher mit PayPal bezahlen',
      isEnabled: true,
      fee: 0.00,
      icon: '/images/payment/paypal.svg',
      sortOrder: 2,
    },
    {
      gatewayId: 'mollie_applepay',
      name: 'Apple Pay',
      description: 'Bezahlen mit Apple Pay via Mollie',
      isEnabled: true,
      fee: 0.00,
      icon: '/images/payment/applepay.svg',
      sortOrder: 3,
    },
    {
      gatewayId: 'sepa',
      name: 'SEPA-Überweisung',
      description: 'Direkte Banküberweisung – keine Gebühren',
      isEnabled: true,
      fee: 0.00,
      icon: '/images/payment/sepa.svg',
      sortOrder: 4,
    },
    {
      gatewayId: 'mollie_klarna',
      name: 'Klarna',
      description: 'Sofort bezahlen, später zahlen oder in Raten via Klarna',
      isEnabled: true,
      fee: 0.00,
      icon: '/images/payment/klarna.svg',
      sortOrder: 5,
    },
  ];

  for (const gw of gateways) {
    await prisma.paymentGateway.upsert({
      where: { gatewayId: gw.gatewayId },
      update: {},
      create: gw,
    });
  }
  console.log(`  ✅ Payment gateways: ${gateways.length} gateways`);

  // ── Default settings ──
  const settings = [
    { key: 'site_name', value: 'Online Auto Abmelden', group: 'general' },
    { key: 'site_url', value: 'https://onlineautoabmelden.com', group: 'general' },
    { key: 'site_description', value: 'Auto online abmelden in 2 Minuten – KFZ online abmelden', group: 'general' },
    { key: 'phone', value: '01522 4999190', group: 'contact' },
    { key: 'email', value: 'info@onlineautoabmelden.com', group: 'contact' },
    { key: 'whatsapp', value: 'https://wa.me/4915224999190', group: 'contact' },
    { key: 'facebook', value: 'https://www.facebook.com/ikfzdigitalzulassung', group: 'social' },
    { key: 'instagram', value: 'https://www.instagram.com/ikfz_digital_zulassung/', group: 'social' },
    { key: 'youtube', value: 'https://www.youtube.com/@ikfzdigitalzulassung', group: 'social' },
    { key: 'tiktok', value: 'https://www.tiktok.com/@meldino_kfz', group: 'social' },
    { key: 'company_name', value: 'iKFZ Digital Zulassung UG (haftungsbeschränkt)', group: 'general' },
    { key: 'mollie_mode', value: 'live', group: 'payment' },
    { key: 'paypal_mode', value: 'live', group: 'payment' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`  ✅ Settings: ${settings.length} entries`);

  console.log('\n✅ Seeding complete!');
  console.log('   Login: admin@onlineautoabmelden.com / admin2026!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
