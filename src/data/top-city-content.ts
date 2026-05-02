export type TopCityContent = {
  intro: string;
  districts: string[];
  licensePlates: string[];
  painPoint: string;
  authorityHint: string;
  conversionText: string;
};

export const TOP_CITY_CONTENT: Record<string, TopCityContent> = {
  essen: {
    intro:
      'In Essen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
    districts: ['Rüttenscheid', 'Altenessen', 'Borbeck', 'Steele', 'Frohnhausen', 'Kray', 'Katernberg'],
    licensePlates: ['E'],
    painPoint:
      'Gerade in Essen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
    authorityHint:
      'Wer sein Fahrzeug mit Essener Kennzeichen E abmelden möchte, kann den Vorgang online vorbereiten und spart sich in vielen Fällen den Weg zur Behörde.',
    conversionText:
      'Gerade bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel hilft ein klarer digitaler Ablauf ohne zusätzlichen Termin.',
  },

  berlin: {
    intro:
      'In Berlin ist die Online-Abmeldung für viele Fahrzeughalter besonders hilfreich, weil Wege, Termine und Wartezeiten je nach Bezirk schnell viel Zeit kosten können.',
    districts: ['Mitte', 'Neukölln', 'Spandau', 'Charlottenburg', 'Pankow', 'Tempelhof'],
    licensePlates: ['B'],
    painPoint:
      'Gerade in Berlin können lange Wege durch die Stadt und knappe Termine den Ablauf erschweren.',
    authorityHint:
      'Für Fahrzeuge mit Berliner Kennzeichen B ist der digitale Weg oft die einfachere Lösung.',
    conversionText:
      'Der digitale Weg ist besonders praktisch, wenn die Abmeldung ohne Anfahrt und ohne Termin vorbereitet werden soll.',
  },

  hamburg: {
    intro:
      'In Hamburg nutzen viele Fahrzeughalter die Online-Abmeldung, um Wege durch die Stadt und Wartezeiten zu vermeiden.',
    districts: ['Altona', 'Wandsbek', 'Eimsbüttel', 'Harburg', 'Bergedorf', 'Hamburg-Mitte'],
    licensePlates: ['HH'],
    painPoint:
      'Gerade in Hamburg kosten Verkehr, Parkplatzsuche und Behördenwege oft zusätzliche Zeit.',
    authorityHint:
      'Wer ein Fahrzeug mit Hamburger Kennzeichen HH abmelden möchte, kann den Vorgang bequem online vorbereiten.',
    conversionText:
      'Für Nutzer aus Altona, Wandsbek, Eimsbüttel, Harburg, Bergedorf oder Hamburg-Mitte ist der digitale Weg oft deutlich bequemer.',
  },
};
