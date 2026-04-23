'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, MessageCircle, UserCircle, LogIn } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { useCustomerAuth } from '@/components/CustomerAuthProvider';
import type { NavProps } from '@/components/ConditionalLayout';

export default function Navbar({ navProps }: { navProps?: NavProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { customer, loading: authLoading } = useCustomerAuth();
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/* Invisible sentinel — when this scrolls out of view, navbar becomes opaque */}
      <div ref={sentinelRef} className="absolute top-0 left-0 h-[20px] w-full pointer-events-none" />
      <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      style={{ top: 'var(--promo-banner-height, 0px)' }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Online Auto Abmelden"
              width={200}
              height={80}
              className="h-16 md:h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation — center */}
          <div className="hidden xl:flex items-center gap-5 2xl:gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium transition-colors whitespace-nowrap hover:text-accent ${
                  scrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: CTA + Account */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            <a
              href={navProps?.phoneLink || 'tel:015224999190'}
              className={`flex items-center gap-1.5 text-sm font-medium whitespace-nowrap ${
                scrolled ? 'text-primary' : 'text-white'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden 2xl:inline">{navProps?.phone || '01522 4999190'}</span>
            </a>
            <a
              href={navProps?.whatsapp || 'https://wa.me/4915224999190'}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
            <Link
              href="/product/fahrzeugabmeldung"
              className="bg-accent hover:bg-accent-600 text-primary font-bold px-4 py-2 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-accent/25"
            >
              Jetzt abmelden
            </Link>

            {/* Divider */}
            <div className={`w-px h-6 mx-1 ${scrolled ? 'bg-gray-200' : 'bg-white/20'}`} />

            {/* Account icon — far right, separated */}
            {!authLoading && (
              <Link
                href={customer ? '/konto' : '/anmelden'}
                className={`relative group flex items-center justify-center w-9 h-9 rounded-full border transition-all
                  ${scrolled
                    ? 'border-gray-200 hover:border-primary/40 hover:bg-primary/5 text-gray-500 hover:text-primary'
                    : 'border-white/25 hover:border-white/50 hover:bg-white/10 text-white/80 hover:text-white'
                  }
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                  ${scrolled ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-dark'}
                `}
                aria-label={customer ? 'Mein Konto' : 'Anmelden'}
              >
                {customer ? (
                  <span className="text-xs font-bold leading-none">
                    {(customer.firstName?.[0] || customer.email?.[0] || 'K').toUpperCase()}
                  </span>
                ) : (
                  <UserCircle className="w-[18px] h-[18px]" />
                )}
                {/* Tooltip */}
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium px-2 py-1 rounded-md bg-dark text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {customer ? 'Mein Konto' : 'Anmelden'}
                </span>
              </Link>
            )}
          </div>

          {/* Mobile: account + hamburger */}
          <div className="flex xl:hidden items-center gap-2">
            {!authLoading && (
              <Link
                href={customer ? '/konto' : '/anmelden'}
                className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors
                  ${scrolled
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
              className={`p-2 rounded-lg ${
                scrolled ? 'text-primary' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`xl:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t px-4 py-6 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="block text-gray-700 hover:text-primary font-medium py-2 border-b border-gray-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {!authLoading && (
              <Link
                href={customer ? '/konto' : '/anmelden'}
                onClick={closeMenu}
                className="flex items-center gap-2.5 text-gray-700 font-medium py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  {customer ? (
                    <span className="text-xs font-bold">{(customer.firstName?.[0] || 'K').toUpperCase()}</span>
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                </span>
                {customer ? 'Mein Konto' : 'Anmelden / Registrieren'}
              </Link>
            )}
            <a
              href={navProps?.phoneLink || 'tel:015224999190'}
              className="flex items-center gap-2 text-primary font-medium"
            >
              <Phone className="w-5 h-5" />
              {navProps?.phone || '01522 4999190'}
            </a>
            <Link
              href="/product/fahrzeugabmeldung"
              className="bg-accent text-primary font-bold px-6 py-3 rounded-full text-center"
              onClick={closeMenu}
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
