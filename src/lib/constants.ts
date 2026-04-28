// Site-wide constants
export const SITE_NAME = 'Online Auto Abmelden';
const _rawSiteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://onlineautoabmelden.com';
// Guard: never let localhost leak into production builds (e.g. if built without the correct .env)
export const SITE_URL =
  _rawSiteUrl.includes('localhost') || _rawSiteUrl.includes('127.0.0.1')
    ? 'https://onlineautoabmelden.com'
    : _rawSiteUrl.replace(/\/$/, '');
export const SITE_DESCRIPTION =
  'Auto online abmelden in 2 Minuten – KFZ online abmelden · Ohne Termin · Ohne Registrierung · Offizielle Bestätigung';
export const PHONE_NUMBER = '01522 4999190';
export const PHONE_LINK = 'tel:015224999190';
export const WHATSAPP_LINK = 'https://wa.me/4915224999190';
export const EMAIL = 'info@onlineautoabmelden.com';
export const NAV_LINKS = [
  { label: 'Startseite', href: '/' },
  { label: 'KFZ sofort abmelden', href: '/product/fahrzeugabmeldung' },
  { label: 'KFZ online anmelden', href: '/product/auto-online-anmelden' },
  { label: 'FAQ / Hilfe', href: '/#faq' },
  { label: 'Blog', href: '/insiderwissen' },
  { label: 'Unsere Videos', href: '/vedio'},
  { label: 'Über Uns', href: '/#ueber-uns' },
  { label: 'Alle Städte', href: '/kfz-zulassung-abmeldung-in-deiner-stadt' },
  
];

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/ikfzdigitalzulassung',
  instagram: 'https://www.instagram.com/ikfz_digital_zulassung/',
  youtube: 'https://www.youtube.com/@ikfzdigitalzulassung',
  tiktok: 'https://www.tiktok.com/@meldino_kfz',
};

export const FAQ_ITEMS = [
  {
    question: 'Wie funktioniert die Online-Abmeldung?',
    answer:
      'Die Online-Abmeldung funktioniert über unsere GKS-Anbindung an das Kraftfahrt-Bundesamt (KBA). Sie geben einfach Ihre Fahrzeugdaten ein, bezahlen sicher online und erhalten Ihre offizielle Bestätigung als PDF per E-Mail.',
  },
  {
    question: 'Was kostet die Online-Abmeldung?',
    answer:
      'Die Online-Abmeldung kostet nur 19,70 € – alle Gebühren inklusive. Keine versteckten Kosten, keine Nachzahlungen.',
  },
  {
    question: 'Wie lange dauert die Abmeldung?',
    answer:
      'Die Abmeldung dauert in der Regel nur 2 Minuten. Sie erhalten Ihre offizielle Bestätigung sofort als PDF per E-Mail.',
  },
  {
    question: 'Was passiert mit meiner Kfz-Steuer?',
    answer:
      'Die Kfz-Steuer endet ab dem Tag der offiziellen Bestätigung. Das Hauptzollamt wird automatisch informiert.',
  },
  {
    question: 'Was passiert mit meiner Versicherung?',
    answer:
      'Ihre Versicherung wird automatisch über die Abmeldung informiert. Sie müssen sich um nichts weiter kümmern.',
  },
  {
    question: 'Brauche ich einen Personalausweis oder die AusweisApp?',
    answer:
      'Nein! Über unseren Service benötigen Sie weder einen Personalausweis noch die AusweisApp. Wir benötigen lediglich Ihre Fahrzeugdaten.',
  },
  {
    question: 'Kann ich mein Auto auch am Wochenende abmelden?',
    answer:
      'Ja! Unser Service steht Ihnen 24/7 zur Verfügung – auch am Wochenende und an Feiertagen.',
  },
  {
    question: 'Ist die Online-Abmeldung rechtssicher?',
    answer:
      'Ja, die Abmeldung erfolgt rechtssicher über die Großkundenschnittstelle (GKS) des Kraftfahrt-Bundesamtes. Sie ist offiziell, bundesweit gültig und 100% rechtssicher.',
  },
];

export const STEPS = [
  {
    number: 1,
    title: 'Fahrzeugschein und ID',
    description: 'Identifizieren Sie die Fahrzeugidentifikationsnummer (FIN) in Ihren Zulassungspapieren, die sich in Spalte E befindet.',
    image: '/uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM.jpeg',
    imageAlt: 'Fahrzeugschein (Zulassungsbescheinigung Teil 1) für die online KFZ Abmeldung',
  },
  {
    number: 2,
    title: 'Sicherheitscode',
    description: 'Entfernen Sie die Schutzfolie, um den Sicherheitscode auf Ihrem Fahrzeugschein freizulegen.',
    image: '/uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM-2.jpeg',
    imageAlt: 'Entfernen der Schutzfolie für die Auto Online Abmelden',
  },
  {
    number: 3,
    title: 'Kennzeichen',
    description: 'Bitte entfernen Sie vorsichtig die Schutzschicht auf den Nummernschildern, um die Sicherheitscodes freizulegen.',
    image: '/uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM-1.jpeg',
    imageAlt: 'Kennzeichen mit freigelegtem Code für die digitale Fahrzeug Abmeldung',
  },
  {
    number: 4,
    title: 'Daten eingeben',
    description: 'FIN + Codes in unser Formular eingeben (ca. 2 Minuten).',
    tip: 'Tipp: Halten Sie den Fahrzeugschein bereit – alle Daten stehen dort.',
  },
  {
    number: 5,
    title: 'Wir prüfen & reichen ein',
    description: 'Wir erledigen die offizielle Abmeldung für Sie – direkt beim KBA.',
    note: 'Bei Fehlern oder Rückfragen melden wir uns sofort per WhatsApp oder Telefon.',
  },
  {
    number: 6,
    title: 'Offizielle Bestätigung erhalten',
    description: 'PDF per E-Mail (auf Wunsch zusätzlich per WhatsApp). Fertig.',
    note: 'Versicherung & KFZ-Steuer werden automatisch informiert.',
  },
];
