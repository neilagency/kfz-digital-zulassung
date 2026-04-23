import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MessageCircle, CheckCircle, CreditCard, Landmark, Apple, Wallet } from 'lucide-react';
import { getFooterPages, getSiteSettings, getPaymentMethodLabels } from '@/lib/db';

export default async function Footer() {
  const [footerPages, settings, paymentMethods] = await Promise.all([
    getFooterPages(),
    getSiteSettings(),
    getPaymentMethodLabels(),
  ]);

  const quickLinks = [
    { label: 'KFZ sofort abmelden', href: '/product/fahrzeugabmeldung' },
    { label: 'Blog / Insiderwissen', href: '/insiderwissen' },
    { label: 'FAQ / Hilfe', href: '/#faq' },
    { label: 'Alle Städte', href: '/kfz-zulassung-abmeldung-in-deiner-stadt' },
    ...footerPages.map((fp) => ({ label: fp.title, href: '/' + fp.slug })),
  ];

  const socialIcons: Record<string, React.ReactNode> = {
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.37a8.16 8.16 0 0 0 4.77 1.52V7.44a4.85 4.85 0 0 1-1-.75z"/>
      </svg>
    ),
    whatsapp: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  };

  const getPaymentIcon = (method: string) => {
    const key = method.toLowerCase();
    if (key.includes('paypal')) return <Wallet className="w-4 h-4" />;
    if (key.includes('kredit') || key.includes('credit') || key.includes('card') || key.includes('visa') || key.includes('master')) return <CreditCard className="w-4 h-4" />;
    if (key.includes('klarna')) return <CreditCard className="w-4 h-4" />;
    if (key.includes('apple')) return <Apple className="w-4 h-4" />;
    if (key.includes('bank') || key.includes('überw') || key.includes('sepa')) return <Landmark className="w-4 h-4" />;
    return <CreditCard className="w-4 h-4" />;
  };

  return (
    <footer className="bg-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.svg"
                alt="Online Auto Abmelden"
                width={160}
                height={56}
                className="h-14 w-auto"
                loading="lazy"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Privater Online-Service für die digitale Fahrzeug-Abmeldung.
              Rechtssichere Abmeldung über unsere GKS-Anbindung an das Kraftfahrt-Bundesamt (KBA).
            </p>
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} {settings.companyName}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Kontakt</h3>
            <div className="space-y-3">
                <a href={settings.phoneLink} className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors text-sm">
                  <Phone className="w-4 h-4 text-accent" />
                  {settings.phone}
                </a>
                <a href={settings.whatsapp} target="_blank" rel="nofollow noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors text-sm">
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  WhatsApp Live-Chat
                </a>
                <a href={'mailto:' + settings.email} className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors text-sm">
                  <Mail className="w-4 h-4 text-accent" />
                  {settings.email}
                </a>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {Object.entries(settings.social || {}).map(([name, url]) => {
                const icon = socialIcons[name.toLowerCase()] ?? (
                  <span className="text-xs font-bold text-white">{name[0]?.toUpperCase()}</span>
                );
                return (
                  <a
                    key={name}
                    href={String(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent/20 transition-colors text-white"
                    aria-label={name}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Payment & Trust */}
          <div>
            <h3 className="font-bold text-white mb-4">Sicher bezahlen</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {paymentMethods.map((method: string) => (
                <span
                  key={method}
                  className="bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  title={method}
                >
                  <span className="text-gray-300">{getPaymentIcon(method)}</span>
                  {method}
                </span>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-gray-400 text-sm">Offiziell & Rechtssicher</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-gray-400 text-sm">KBA §34 FZV registriert</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-gray-400 text-sm">100% Geld-zurück-Garantie</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-xs">
            Hinweis: Die Online-Abmeldung ist nicht in allen Städten verfügbar. Bitte prüfen Sie die Verfügbarkeit.
          </p>
          <p className="text-gray-500 text-xs">
            {settings.siteName} – Bundesweite Fahrzeugabmeldung
          </p>
        </div>
      </div>
    </footer>
  );
}
