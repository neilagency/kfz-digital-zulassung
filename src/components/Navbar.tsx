'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  UserCircle,
  LogIn,
  ChevronDown,
} from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { useCustomerAuth } from '@/components/CustomerAuthProvider';
import type { NavProps } from '@/components/ConditionalLayout';

// First 5 items shown directly at xl; items 5+ go into "Mehr" dropdown at xl, shown directly at 2xl
const PRIMARY_SPLIT = 5;

export default function Navbar({ navProps }: { navProps?: NavProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { customer, loading: authLoading } = useCustomerAuth();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const isAnmeldenLink = (link: { href: string; label: string }) =>
    link.href === '/product/auto-online-anmelden' ||
    link.href === '/kfz-zulassung' ||
    link.label.toLowerCase().includes('anmelden');

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname.startsWith(href.split('#')[0]);
  };

  const primaryLinks = NAV_LINKS.slice(0, PRIMARY_SPLIT);
  const moreLinks = NAV_LINKS.slice(PRIMARY_SPLIT);

  const navLinkClass = (href: string) =>
    `text-sm font-medium transition-colors whitespace-nowrap ${
      isActive(href)
        ? scrolled
          ? 'text-primary'
          : 'text-white font-semibold'
        : scrolled
          ? 'text-gray-600 hover:text-primary'
          : 'text-white/85 hover:text-white'
    }`;

  const renderDesktopLink = (link: { href: string; label: string }) => {
    if (isAnmeldenLink(link)) {
      return (
        <div key={link.href} className="relative group">
          <Link
            href={link.href}
            className={`flex items-center gap-1 ${navLinkClass(link.href)}`}
          >
            {link.label}
            <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>

          <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="w-64 rounded-2xl bg-white shadow-xl border border-gray-100 p-2">
              <Link
                href={link.href}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors"
              >
                KFZ online anmelden
                <span className="block text-xs font-normal text-gray-500 mt-0.5">
                  Fahrzeug digital anmelden
                </span>
              </Link>
              <Link
                href="/evb"
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors"
              >
                EVB
                <span className="block text-xs font-normal text-gray-500 mt-0.5">
                  EVB für die Zulassung
                </span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
        {link.label}
      </Link>
    );
  };

  return (
    <>
      <div
        ref={sentinelRef}
        className="absolute top-0 left-0 h-[20px] w-full pointer-events-none"
      />

      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/96 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
        style={{ top: 'var(--promo-banner-height, 0px)' }}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 2xl:px-14">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo — scaled to leave vertical breathing room in the header */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="Online Auto Abmelden"
                width={200}
                height={80}
                className="h-11 sm:h-12 md:h-12 xl:h-14 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation — centered with flex-1 between logo and actions */}
            <div className="hidden xl:flex items-center gap-6 2xl:gap-5 flex-1 justify-center mx-6 2xl:mx-10">

              {/* Primary links: always visible at xl+ */}
              {primaryLinks.map((link) => renderDesktopLink(link))}

              {/* "Mehr" dropdown — visible at xl, hidden at 2xl */}
              {moreLinks.length > 0 && (
                <div className="relative group 2xl:hidden">
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                      scrolled
                        ? 'text-gray-600 hover:text-primary'
                        : 'text-white/85 hover:text-white'
                    }`}
                  >
                    Mehr
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="w-52 rounded-2xl bg-white shadow-xl border border-gray-100 p-2">
                      {moreLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                            isActive(link.href)
                              ? 'text-primary bg-primary/5'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Extra links — hidden at xl, shown directly at 2xl */}
              {moreLinks.map((link) => (
                <span key={`2xl-${link.href}`} className="hidden 2xl:contents">
                  {renderDesktopLink(link)}
                </span>
              ))}
            </div>

            {/* Right side actions */}
            <div className="hidden xl:flex items-center gap-2.5 flex-shrink-0">
              {/* Phone — icon only on desktop to save space */}
              <a
                href={navProps?.phoneLink || 'tel:015224999190'}
                aria-label={`Telefon: ${navProps?.phone || '01522 4999190'}`}
                className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
                  scrolled
                    ? 'border-gray-200 text-gray-500 hover:border-primary/30 hover:text-primary hover:bg-primary/5'
                    : 'border-white/25 text-white/80 hover:border-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* WhatsApp */}
              <a
                href={navProps?.whatsapp || 'https://wa.me/4915224999190'}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white px-3.5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>

              {/* CTA */}
              <Link
                href="/product/fahrzeugabmeldung"
                className="bg-accent hover:bg-accent-600 text-gray-900 font-bold px-4 py-2 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-accent/25 whitespace-nowrap"
              >
                Jetzt abmelden
              </Link>

              {/* Separator */}
              <div className={`w-px h-6 ${scrolled ? 'bg-gray-200' : 'bg-white/20'}`} />

              {/* User / Account */}
              {!authLoading && (
                <Link
                  href={customer ? '/konto' : '/anmelden'}
                  className={`relative group flex items-center justify-center w-9 h-9 rounded-full border transition-all
                    ${
                      scrolled
                        ? 'border-gray-200 hover:border-primary/40 hover:bg-primary/5 text-gray-500 hover:text-primary'
                        : 'border-white/25 hover:border-white/50 hover:bg-white/10 text-white/80 hover:text-white'
                    }
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                    ${scrolled ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-dark'}`}
                  aria-label={customer ? 'Mein Konto' : 'Anmelden'}
                >
                  {customer ? (
                    <span className="text-xs font-bold leading-none">
                      {(customer.firstName?.[0] || customer.email?.[0] || 'K').toUpperCase()}
                    </span>
                  ) : (
                    <UserCircle className="w-[18px] h-[18px]" />
                  )}
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium px-2 py-1 rounded-md bg-dark text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {customer ? 'Mein Konto' : 'Anmelden'}
                  </span>
                </Link>
              )}
            </div>

            {/* Mobile / tablet trigger */}
            <div className="flex xl:hidden items-center gap-2.5">
              {!authLoading && (
                <Link
                  href={customer ? '/konto' : '/anmelden'}
                  className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
                    scrolled
                      ? 'border-gray-200 text-gray-500 hover:text-primary hover:border-primary/40'
                      : 'border-white/25 text-white/80 hover:text-white hover:border-white/50'
                  }`}
                  aria-label={customer ? 'Mein Konto' : 'Anmelden'}
                >
                  {customer ? (
                    <span className="text-xs font-bold leading-none">
                      {(customer.firstName?.[0] || customer.email?.[0] || 'K').toUpperCase()}
                    </span>
                  ) : (
                    <UserCircle className="w-[18px] h-[18px]" />
                  )}
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  scrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Menü öffnen"
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile / tablet slide-down menu */}
        <div
          className={`xl:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/97 backdrop-blur-md border-t border-gray-100 px-5 pt-4 pb-6">

            {/* Nav links */}
            <nav className="space-y-0.5 mb-5">
              {NAV_LINKS.map((link) =>
                isAnmeldenLink(link) ? (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`flex items-center font-medium py-3 px-3 rounded-xl transition-colors ${
                        isActive(link.href)
                          ? 'text-primary bg-primary/5'
                          : 'text-gray-800 hover:text-primary hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                    <Link
                      href="/evb"
                      onClick={closeMenu}
                      className="flex items-center ml-5 text-sm text-gray-500 hover:text-primary font-medium py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      ↳ EVB – Elektronische Versicherungsbestätigung
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center font-medium py-3 px-3 rounded-xl transition-colors ${
                      isActive(link.href)
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-800 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            {/* Bottom CTA row */}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              {!authLoading && (
                <Link
                  href={customer ? '/konto' : '/anmelden'}
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-gray-700 font-medium py-3 px-4 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0">
                    {customer ? (
                      <span className="text-xs font-bold">
                        {(customer.firstName?.[0] || 'K').toUpperCase()}
                      </span>
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                  </span>
                  {customer ? 'Mein Konto' : 'Anmelden / Registrieren'}
                </Link>
              )}

              <a
                href={navProps?.phoneLink || 'tel:015224999190'}
                className="flex items-center gap-3 text-primary font-medium py-3 px-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                {navProps?.phone || '01522 4999190'}
              </a>

              <a
                href={navProps?.whatsapp || 'https://wa.me/4915224999190'}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-full font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Chat starten
              </a>

              <Link
                href="/product/fahrzeugabmeldung"
                onClick={closeMenu}
                className="bg-accent hover:bg-accent-600 text-gray-900 font-bold px-6 py-3 rounded-full text-center transition-colors"
              >
                Jetzt abmelden
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
