'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Users,
  BookOpen,
  FileStack,
  Package,
  CreditCard,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Image as ImageIcon,
  Activity,
  MoreHorizontal,
  Mail,
  Tag,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Bestellungen', href: '/admin/orders', icon: ClipboardList },
  { label: 'Rechnungen', href: '/admin/invoices', icon: FileText },
  { label: 'Kunden', href: '/admin/customers', icon: Users },
  { label: 'Kampagnen', href: '/admin/campaigns', icon: Mail },
  { label: 'Gutscheine', href: '/admin/coupons', icon: Tag },
  { label: 'Blog', href: '/admin/blog', icon: BookOpen },
  { label: 'Seiten', href: '/admin/pages', icon: FileStack },
  { label: 'Produkte', href: '/admin/products', icon: Package },
  { label: 'Medien', href: '/admin/media', icon: ImageIcon },
  { label: 'Zahlungen', href: '/admin/payments', icon: CreditCard },
  { label: 'Performance', href: '/admin/performance', icon: Activity },
  { label: 'Einstellungen', href: '/admin/settings', icon: Settings },
];

// Bottom nav shows first 4 + "More" drawer
const BOTTOM_NAV_ITEMS = navItems.slice(0, 4);
const MORE_NAV_ITEMS = navItems.slice(4);

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeMore = useCallback(() => setMoreOpen(false), []);

  if (status === 'loading') {
    return (
      <div className="hidden md:block w-[272px] bg-dark min-h-screen" />
    );
  }

  if (status === 'unauthenticated') {
    redirect('/admin/login');
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const moreHasActive = MORE_NAV_ITEMS.some((item) => isActive(item.href));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`px-5 py-5 ${collapsed ? 'px-3' : ''}`}>
        <Link href="/admin" className="flex items-center gap-3" onClick={closeMobile}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <span className="text-white font-black text-sm tracking-tight">iK</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold text-[15px] leading-tight tracking-tight">iKFZ Admin</p>
              <p className="text-gray-500 text-[11px] mt-0.5">Verwaltung</p>
            </div>
          )}
        </Link>
      </div>

      <div className="mx-4 h-px bg-white/[0.06]" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto admin-hide-scrollbar">
        <p className={`px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 ${collapsed ? 'sr-only' : ''}`}>
          Menü
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                active
                  ? 'bg-primary/15 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                active
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-white/[0.04] text-gray-500 group-hover:text-gray-300 group-hover:bg-white/[0.06]'
              }`}>
                <Icon className="w-[16px] h-[16px]" />
              </div>
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-sm shadow-accent/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 space-y-0.5">
        <div className="mx-1 mb-2 h-px bg-white/[0.06]" />
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-4 h-4" />
          </div>
          {!collapsed && <span>Website öffnen</span>}
        </a>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          {!collapsed && <span>Abmelden</span>}
        </button>

        {!collapsed && session?.user && (
          <div className="mt-2 mx-1 px-3 py-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/20">
                <span className="text-primary-200 text-xs font-bold">
                  {(session.user.email?.[0] || 'A').toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] text-gray-300 font-medium truncate">Admin</p>
                <p className="text-[10px] text-gray-600 truncate">{session.user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ═══ MOBILE: Top bar ═══ */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-dark/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition"
          aria-label="Menü öffnen"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 ml-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center">
            <span className="text-white font-black text-[10px]">iK</span>
          </div>
          <span className="text-white font-bold text-sm">iKFZ Admin</span>
        </div>
      </div>

      {/* ═══ MOBILE: Full drawer ═══ */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-dark shadow-2xl shadow-black/40">
            <button
              onClick={closeMobile}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ═══ MOBILE: Bottom Navigation Bar ═══ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 admin-bottom-nav bg-dark/95 backdrop-blur-xl border-t border-white/[0.08]">
        <div className="flex items-center justify-around h-16 px-1">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${
                  active ? 'text-white' : 'text-gray-500'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  active ? 'bg-primary shadow-lg shadow-primary/30' : ''
                }`}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <span className={`text-[9px] font-semibold mt-0.5 ${active ? 'text-white' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${
              moreHasActive ? 'text-white' : 'text-gray-500'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              moreHasActive ? 'bg-primary shadow-lg shadow-primary/30' : ''
            }`}>
              <MoreHorizontal className="w-[18px] h-[18px]" />
            </div>
            <span className={`text-[9px] font-semibold mt-0.5 ${moreHasActive ? 'text-white' : 'text-gray-600'}`}>
              Mehr
            </span>
          </button>
        </div>
      </nav>

      {/* ═══ MOBILE: "More" bottom sheet ═══ */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMore} />
          <div className="absolute bottom-0 left-0 right-0 bg-dark rounded-t-3xl shadow-2xl shadow-black/50 admin-bottom-nav">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-700" />
            </div>
            <div className="px-4 pt-2 pb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 px-2 mb-2">Weitere Seiten</p>
              <div className="grid grid-cols-4 gap-1">
                {MORE_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMore}
                      className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all"
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        active
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'bg-white/[0.06] text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-gray-500'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="px-4 pb-4 space-y-1">
              <div className="h-px bg-white/[0.06] mb-2" />
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/[0.04] transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Website öffnen</span>
              </a>
              <button
                onClick={() => { closeMore(); signOut({ callbackUrl: '/admin/login' }); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/[0.06] transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Desktop sidebar ═══ */}
      <aside
        className={`hidden md:flex flex-col ${
          collapsed ? 'w-[72px]' : 'w-[272px]'
        } bg-dark min-h-screen transition-all duration-200 flex-shrink-0 relative`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 w-6 h-6 bg-dark-50 border border-white/10 rounded-full text-gray-500 hover:text-white hover:bg-dark flex items-center justify-center z-10 transition-all hover:scale-110"
        >
          <ChevronLeft
            className={`w-3 h-3 transition-transform duration-200 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
