import type { BuiltCityPageContent } from './cityPageContent';

/** Same copy as DATENSCHUTZ_JOKER in cityPageContent (kept here to avoid import cycle). */
const STATIC_DATENSCHUTZ_JOKER =
  'Gut zu wissen: Jeder kann ein Auto abmelden! Für die offizielle Abmeldung verlangen die Behörden (Stadt/Landkreis) keine persönlichen Daten von Ihnen. Wir benötigen Ihre E-Mail-Adresse und Telefonnummer lediglich, um Sie im Falle eines Fehlers schnell kontaktieren zu können.';

export const STATIC_CITY_CONTENT_MAP: Record<string, BuiltCityPageContent> = {
  zwickau: {
    metaTitle: 'Auto abmelden Zwickau | ab 19,70 €',
    metaDescription:
      'Auto online abmelden in Zwickau ab 19,70 €. Ohne Termin, ohne Wartezeit und bequem von zu Hause digital starten.',
    intro:
      'Die Fahrzeugabmeldung in Zwickau verläuft digital deutlich schneller als früher. Statt einen Termin bei der Behörde zu reservieren und extra vorbei zu fahren, bereiten Sie alles online vor und erhalten eine digitale Bestätigung.',
    preparation:
      'Vor der Online-Abmeldung sollten Sie folgende Unterlagen bereitlegen: Ihren Fahrzeugschein, Ihr Kennzeichen, die Fahrzeug-Identifizierungsnummer (FIN) und einen Sicherheitscode. Wenn alles komplett ist, läuft der Ablauf meist deutlich flüssiger.',
    trust:
      'Die Abmeldung erfolgt über unsere GKS-Anbindung amtlich und rechtssicher. Ihre Daten werden verschlüsselt übertragen, und Sie erhalten eine digitale Bestätigung per E-Mail.',
    documentsIntro: 'Für die digitale Abmeldung benötigen Sie folgende Unterlagen:',
    documentsList: [
      'Fahrzeugschein',
      'Kennzeichen',
      'Fahrzeugidentifizierungsnummer (FIN)',
      'Sicherheitscode',
    ],
    processIntro: 'Die Abmeldung verläuft in wenigen einfachen Schritten:',
    processList: [
      'Unterlagen bereitlegen',
      'Antrag ausfüllen',
      'Daten übermitteln',
      'Bestätigung erhalten',
    ],
    compareIntro: 'Vergleich zwischen digitaler Abmeldung und Abmeldung bei der Behörde:',
    targetIntro: 'Die Online-Abmeldung eignet sich besonders für folgende Situationen:',
    targetList: [
      'Gebrauchtwagen verkauft?',
      'Fahrzeug außer Betrieb nehmen?',
      'Saisonfahrzeug abstellen?',
    ],
    note:
      'Bitte beachten Sie: Diese digitale Abmeldung ist bundesweit nutzbar. Die genauen Anforderungen können je nach Bundesland und Behörde unterschiedlich sein.',
    expertAccordionIntro: '',
    expertAccordionItems: [],
    expertAccordionOutro: '',
    localBlockTitle: 'Zuständige Behörde in Zwickau',
    localBlockText:
      'Zuständig für die Abmeldung in Zwickau ist die lokale Behörde. Die online Abmeldung wird über unsere GKS-Anbindung amtlich verarbeitet.',
    benefitsTitle: 'Vorteile der Online-Abmeldung',
    benefits: [
      'Einfach von zu Hause aus starten',
      'Keine unnötigen Wege zur Behörde',
      'Schnelle digitale Bestätigung',
      'Transparente Kostenaufstellung',
    ],
    faq: [
      {
        q: 'Kann ich mein Auto online abmelden in Zwickau?',
        a: 'Ja, viele Fahrzeughalter nutzen diesen Weg, weil er einfacher und bequemer ist als ein Termin vor Ort.',
      },
      {
        q: 'Ist die Online-Abmeldung kompliziert?',
        a: 'Für viele ist der Ablauf einfacher als gedacht. Wichtig sind vollständige und gut lesbare Angaben.',
      },
      {
        q: 'Bekomme ich eine Bestätigung?',
        a: 'Nach erfolgreicher Bearbeitung erhalten Sie in der Regel eine Bestätigung per E-Mail.',
      },
      {
        q: 'Warum wählen viele den Online-Weg?',
        a: 'Weil sie Zeit sparen möchten und den Vorgang lieber bequem von zu Hause aus erledigen.',
      },
      {
        q: 'Wie funktioniert die Online-Abmeldung in Zwickau?',
        a: 'Der Ablauf startet digital mit den Fahrzeugdaten und den notwendigen Angaben. Danach wird alles geprüft und bestätigt.',
      },
      {
        q: 'Brauche ich dafür einen Termin?',
        a: 'Viele wählen gerade deshalb den Online-Weg, weil sie keinen klassischen Behördentermin möchten.',
      },
    ],
    linksIntro: 'Weitere Städte in Sachsen:',
    closingText: 'Alle verfügbaren Städte ansehen',
    ctaTitle: 'Jetzt Fahrzeug online abmelden',
    ctaText: 'Starten Sie die digitale Abmeldung noch heute - einfach, schnell und sicher.',
    ctaButton: 'Zur Abmeldung – 19,70 €',
    datenschutzJoker: STATIC_DATENSCHUTZ_JOKER,
    sectionOrder: [
      'benefits',
      'preparation',
      'trust',
      'documents',
      'process',
      'compare',
      'target',
      'local',
      'note',
      'faq',
      'links',
      'cta',
    ],
  },
};
