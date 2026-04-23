'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCustomerAuth } from '@/components/CustomerAuthProvider';
import PageHero from '@/components/PageHero';
import { Package, User, LogOut, FileText, Settings } from 'lucide-react';

const kontoNav = [
  { label: 'Übersicht', href: '/konto', icon: User },
  { label: 'Bestellungen', href: '/konto/bestellungen', icon: Package },
];

export default function KontoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { customer, logout } = useCustomerAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark Hero Header */}
      <PageHero
        variant="dark"
        title="Mein Konto"
        subtitle={
          customer
            ? `Willkommen, ${customer.firstName || customer.email}`
            : undefined
        }
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Mein Konto' },
        ]}
        compact
        actions={
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 transition bg-white/[0.06] hover:bg-white/[0.1] px-4 py-2 rounded-xl border border-white/[0.08]"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Abmelden</span>
          </button>
        }
      />

      {/* Mobile horizontal tabs (visible on small screens) */}
      <div className="md:hidden border-b border-gray-200 bg-white sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide">
          {kontoNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/konto' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar Nav (desktop only) */}
          <nav className="hidden md:flex flex-col gap-1.5">
            {kontoNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href ||
                (item.href !== '/konto' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Content */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
