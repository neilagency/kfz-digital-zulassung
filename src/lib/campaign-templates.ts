/**
 * Predefined email campaign templates.
 * Each template provides starter content that the admin can customize.
 */

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  subject: string;
  heading: string;
  content: string;
  ctaText: string;
  ctaUrl: string;
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'welcome',
    name: 'Willkommen',
    description: 'Begrüßung neuer Kunden',
    icon: '👋',
    subject: 'Willkommen bei Online Auto Abmelden!',
    heading: 'Herzlich Willkommen!',
    content: `<p>Sehr geehrte Kundin, sehr geehrter Kunde,</p>
<p>vielen Dank, dass Sie sich für <strong>Online Auto Abmelden</strong> entschieden haben. Wir freuen uns, Sie als Kunden begrüßen zu dürfen.</p>
<p>Mit unserem Service können Sie Ihr Fahrzeug bequem von zu Hause aus abmelden – schnell, sicher und ohne Behördengang.</p>
<p><strong>So einfach geht's:</strong></p>
<ul>
<li>Formular ausfüllen</li>
<li>Unterlagen hochladen</li>
<li>Fertig! Wir erledigen den Rest.</li>
</ul>
<p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.</p>
<p>Mit freundlichen Grüßen,<br>Ihr Team von Online Auto Abmelden</p>`,
    ctaText: 'Jetzt Fahrzeug abmelden',
    ctaUrl: 'https://onlineautoabmelden.com/service/fahrzeug-abmelden',
  },
  {
    id: 'discount',
    name: 'Rabatt-Aktion',
    description: 'Sonderangebot oder Rabattcode',
    icon: '🏷️',
    subject: 'Exklusiver Rabatt für Sie!',
    heading: 'Sonderangebot nur für Sie!',
    content: `<p>Sehr geehrte Kundin, sehr geehrter Kunde,</p>
<p>als Dankeschön für Ihr Vertrauen haben wir ein <strong>exklusives Angebot</strong> für Sie:</p>
<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:15px;margin:15px 0;text-align:center;">
<p style="font-size:24px;font-weight:bold;color:#856404;margin:0;">SPARE10</p>
<p style="font-size:14px;color:#856404;margin:5px 0 0;">10€ Rabatt auf Ihre nächste Abmeldung</p>
</div>
<p>Geben Sie den Code einfach bei der Bestellung ein und sparen Sie sofort.</p>
<p>⏰ <strong>Begrenztes Angebot</strong> – nur solange der Vorrat reicht!</p>
<p>Mit freundlichen Grüßen,<br>Ihr Team von Online Auto Abmelden</p>`,
    ctaText: 'Jetzt mit Rabatt buchen',
    ctaUrl: 'https://onlineautoabmelden.com/service/fahrzeug-abmelden',
  },
  {
    id: 'reminder',
    name: 'Erinnerung',
    description: 'Kunden an offene Aufgaben erinnern',
    icon: '🔔',
    subject: 'Wussten Sie schon? Fahrzeug online abmelden!',
    heading: 'Vergessen Sie nicht Ihre Abmeldung!',
    content: `<p>Sehr geehrte Kundin, sehr geehrter Kunde,</p>
<p>wussten Sie, dass Sie Ihr Fahrzeug ganz einfach <strong>online abmelden</strong> können?</p>
<p>Kein Behördengang nötig – wir erledigen alles für Sie:</p>
<ul>
<li>✅ Abmeldung in wenigen Minuten</li>
<li>✅ Amtliche Bestätigung per E-Mail</li>
<li>✅ Kfz-Versicherung wird automatisch informiert</li>
</ul>
<p>Sparen Sie sich Zeit und Nerven – starten Sie jetzt!</p>
<p>Mit freundlichen Grüßen,<br>Ihr Team von Online Auto Abmelden</p>`,
    ctaText: 'Jetzt online abmelden',
    ctaUrl: 'https://onlineautoabmelden.com/service/fahrzeug-abmelden',
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Allgemeine Neuigkeiten & Updates',
    icon: '📰',
    subject: 'Neuigkeiten von Online Auto Abmelden',
    heading: 'Was gibt es Neues?',
    content: `<p>Sehr geehrte Kundin, sehr geehrter Kunde,</p>
<p>wir möchten Sie über aktuelle Neuigkeiten informieren:</p>
<h3>🚗 Neuer Service verfügbar</h3>
<p>Ab sofort bieten wir auch die Online-Anmeldung von Fahrzeugen an. Schnell und einfach – ganz ohne Behördengang.</p>
<h3>📱 Verbesserte Website</h3>
<p>Unsere Website wurde komplett überarbeitet, damit Sie noch schneller und einfacher Ihr Fahrzeug abmelden können.</p>
<h3>💬 Haben Sie Fragen?</h3>
<p>Unser Kundenservice ist Montag bis Freitag von 9–17 Uhr für Sie da.</p>
<p>Mit freundlichen Grüßen,<br>Ihr Team von Online Auto Abmelden</p>`,
    ctaText: 'Zur Website',
    ctaUrl: 'https://onlineautoabmelden.com',
  },
  {
    id: 'feedback',
    name: 'Feedback anfragen',
    description: 'Kundenbewertung einholen',
    icon: '⭐',
    subject: 'Wie war Ihre Erfahrung?',
    heading: 'Ihre Meinung ist uns wichtig!',
    content: `<p>Sehr geehrte Kundin, sehr geehrter Kunde,</p>
<p>vielen Dank, dass Sie unseren Service genutzt haben!</p>
<p>Wir würden uns sehr freuen, wenn Sie sich einen Moment Zeit nehmen könnten, um uns eine <strong>Bewertung</strong> zu hinterlassen.</p>
<p>Ihre Meinung hilft uns, unseren Service weiter zu verbessern und anderen Kunden bei ihrer Entscheidung.</p>
<p>⭐⭐⭐⭐⭐</p>
<p>Vielen Dank für Ihre Unterstützung!</p>
<p>Mit freundlichen Grüßen,<br>Ihr Team von Online Auto Abmelden</p>`,
    ctaText: 'Jetzt bewerten',
    ctaUrl: 'https://www.google.com/maps/place/Online+Auto+Abmelden',
  },
  {
    id: 'empty',
    name: 'Leere Vorlage',
    description: 'Starten Sie von Grund auf',
    icon: '📄',
    subject: '',
    heading: '',
    content: '',
    ctaText: '',
    ctaUrl: '',
  },
];
