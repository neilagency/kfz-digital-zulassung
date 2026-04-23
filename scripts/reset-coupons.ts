import prisma from '../src/lib/prisma';

async function main() {
  // Delete all coupon usage first (FK constraint)
  const deletedUsage = await prisma.couponUsage.deleteMany({});
  console.log('Deleted coupon usages:', deletedUsage.count);

  // Delete all coupons
  const deleted = await prisma.coupon.deleteMany({});
  console.log('Deleted coupons:', deleted.count);

  // Create coupon 1: 10 EUR discount
  const c1 = await prisma.coupon.create({
    data: {
      code: 'SPARE10',
      description: '10 EUR Rabatt auf Fahrzeugabmeldung',
      discountType: 'fixed',
      discountValue: 10,
      minOrderValue: 0,
      maxUsageTotal: 0,
      maxUsagePerUser: 1,
      isActive: true,
      productSlugs: 'fahrzeugabmeldung',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      bannerText: '10 EUR Rabatt auf Fahrzeugabmeldung - Code: SPARE10',
      showBanner: true,
    },
  });
  console.log('Created:', c1.code, c1.discountValue, 'EUR');

  // Create coupon 2: 19.70 EUR discount (free)
  const c2 = await prisma.coupon.create({
    data: {
      code: 'GRATIS',
      description: 'Kostenlose Fahrzeugabmeldung (19,70 EUR Rabatt)',
      discountType: 'fixed',
      discountValue: 19.70,
      minOrderValue: 0,
      maxUsageTotal: 0,
      maxUsagePerUser: 1,
      isActive: true,
      productSlugs: 'fahrzeugabmeldung',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      bannerText: '',
      showBanner: false,
    },
  });
  console.log('Created:', c2.code, c2.discountValue, 'EUR');

  // Verify
  const all = await prisma.coupon.findMany({
    select: { code: true, discountValue: true, discountType: true, isActive: true },
  });
  console.log('All coupons:', JSON.stringify(all, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
