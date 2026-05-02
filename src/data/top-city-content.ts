export type TopCityContent = {
  intro: string;
  districts?: string[];
  licensePlates?: string[];
  painPoint: string;
  authorityHint: string;
  conversionText: string;
};

export const TOP_CITY_CONTENT: Record<string, TopCityContent> = {
 aachen: {
  intro: 'In Aachen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Laurensberg', 'Brand', 'Eilendorf', 'Kornelimünster', 'Richterich', 'Haaren', 'Burtscheid'],
  licensePlates: ['AC', 'MON'],
  painPoint: 'Gerade in Aachen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AC oder MON abmelden möchte, kann den Vorgang online vorbereiten und spart sich in vielen Fällen den Weg zur Behörde.',
  conversionText: 'Gerade bei Fahrzeugverkauf, Stilllegung oder Wechsel des Fahrzeugs hilft ein klarer digitaler Ablauf ohne zusätzlichen Termin.',
},

aalen: {
  intro: 'In Aalen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Wasseralfingen', 'Unterkochen', 'Dewangen', 'Fachsenfeld', 'Hofen', 'Ebnat'],
  licensePlates: ['AA'],
  painPoint: 'Gerade in Aalen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AA abmelden möchte, kann den Vorgang online vorbereiten und spart sich in vielen Fällen den Weg zur Behörde.',
  conversionText: 'Besonders bei Verkauf, Stilllegung oder Fahrzeugwechsel ist die Online-Abmeldung eine einfache und schnelle Lösung.',
},

abensberg: {
  intro: 'In Abensberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Sandharlanden', 'Arnhofen', 'Pullach', 'Offenstetten', 'Gaden', 'Allersdorf'],
  licensePlates: ['KEH'],
  painPoint: 'Gerade in Abensberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KEH abmelden möchte, kann den Vorgang online vorbereiten und spart sich häufig den Weg zur Behörde.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch, wenn das Fahrzeug verkauft, stillgelegt oder schnell abgemeldet werden soll.',
},

achern: {
  intro: 'In Achern möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne unnötige Wartezeit.',
  districts: ['Oberachern', 'Fautenbach', 'Gamshurst', 'Großweier', 'Mösbach', 'Wagshurst', 'Önsbach'],
  licensePlates: ['OG', 'BH', 'KEL', 'LR', 'WOL'],
  painPoint: 'Gerade in Achern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OG oder einem regionalen Ortenau-Kennzeichen abmelden möchte, kann den Vorgang bequem online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

achim: {
  intro: 'In Achim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne dafür einen Termin vor Ort einplanen zu müssen.',
  districts: ['Baden', 'Uphusen', 'Bierden', 'Embsen', 'Uesen', 'Borstel'],
  licensePlates: ['VER'],
  painPoint: 'Gerade in Achim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VER abmelden möchte, kann den Vorgang online vorbereiten und spart sich in vielen Fällen den Weg zur Behörde.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch, wenn es schnell gehen soll und keine Zeit für einen Behördentermin bleibt.',
},

adorf: {
  intro: 'In Adorf möchten viele Fahrzeughalter die Auto-Abmeldung einfach und schnell erledigen, ohne unnötige Wege.',
  districts: ['Remtengrün', 'Leubetha', 'Freiberg', 'Arnsgrün', 'Gettengrün'],
  licensePlates: ['V', 'AE', 'OVL', 'PL', 'RC'],
  painPoint: 'Gerade in Adorf kosten Anfahrt, Termin und Wartezeit oft mehr Zeit als nötig.',
  authorityHint: 'Wer sein Fahrzeug mit Vogtland-Kennzeichen wie V, AE oder PL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist eine bequeme Lösung bei Fahrzeugverkauf, Stilllegung oder Ummeldung.',
},

ahaus: {
  intro: 'In Ahaus möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra einen Termin suchen zu müssen.',
  districts: ['Wüllen', 'Alstätte', 'Graes', 'Ottenstein', 'Wessum', 'Ammeln'],
  licensePlates: ['BOR', 'AH', 'BOH'],
  painPoint: 'Gerade in Ahaus kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BOR, AH oder BOH abmelden möchte, kann den Vorgang digital vorbereiten.',
  conversionText: 'Besonders bei Verkauf, Stilllegung oder Fahrzeugwechsel ist die Online-Abmeldung eine schnelle und einfache Lösung.',
},

ahrweiler: {
  intro: 'In Ahrweiler möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder Behördentermin.',
  districts: ['Bad Neuenahr', 'Heimersheim', 'Walporzheim', 'Bachem', 'Ehlingen', 'Gimmigen'],
  licensePlates: ['AW'],
  painPoint: 'Gerade in Ahrweiler kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AW abmelden möchte, kann den Vorgang online vorbereiten und spart sich häufig den Weg zur Behörde.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch, wenn das Fahrzeug verkauft oder stillgelegt werden soll.',
},

aichach: {
  intro: 'In Aichach möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Oberbernbach', 'Untergriesbach', 'Klingen', 'Ecknach', 'Griesbeckerzell', 'Sulzbach'],
  licensePlates: ['AIC', 'FDB'],
  painPoint: 'Gerade in Aichach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AIC oder FDB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder schnellem Fahrzeugwechsel.',
},

aichtal: {
  intro: 'In Aichtal möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Aich', 'Grötzingen', 'Neuenhaus'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade in Aichtal kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf oder Stilllegung.',
},

'alb-donau-kreis': {
  intro: 'Im Alb-Donau-Kreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Behörde.',
  districts: ['Ehingen', 'Blaubeuren', 'Laichingen', 'Langenau', 'Erbach', 'Dietenheim', 'Schelklingen'],
  licensePlates: ['UL', 'EHI'],
  painPoint: 'Gerade im Alb-Donau-Kreis kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UL oder EHI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn die Behörde weiter entfernt liegt oder der Vorgang schnell erledigt werden soll.',
},

albstadt: {
  intro: 'In Albstadt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Wege.',
  districts: ['Ebingen', 'Tailfingen', 'Onstmettingen', 'Truchtelfingen', 'Lautlingen', 'Pfeffingen', 'Margrethausen'],
  licensePlates: ['BL', 'HCH'],
  painPoint: 'Gerade in Albstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BL oder HCH abmelden möchte, kann den Vorgang bequem online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

alfeld: {
  intro: 'In Alfeld möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne unnötige Wartezeit vor Ort.',
  districts: ['Limmer', 'Föhrste', 'Gerzen', 'Warzen', 'Röllinghausen', 'Brunkensen'],
  licensePlates: ['HI', 'ALF'],
  painPoint: 'Gerade in Alfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HI oder ALF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die digitale Abmeldung spart Zeit und hilft besonders bei Verkauf oder Stilllegung.',
},

alsfeld: {
  intro: 'In Alsfeld möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Altenburg', 'Berfa', 'Eifa', 'Elbenrod', 'Hattendorf', 'Leusel', 'Reibertenrod'],
  licensePlates: ['VB', 'ALS'],
  painPoint: 'Gerade in Alsfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VB oder ALS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

altena: {
  intro: 'In Altena möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege und Wartezeiten.',
  districts: ['Dahle', 'Evingsen', 'Mühlenrahmede', 'Rahmede', 'Rosmart', 'Breitenhagen'],
  licensePlates: ['MK'],
  painPoint: 'Gerade in Altena kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch, wenn das Fahrzeug verkauft oder stillgelegt werden soll.',
},

altenburg: {
  intro: 'In Altenburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit bei der Behörde.',
  districts: ['Nord', 'Südost', 'Rasephas', 'Ehrenberg', 'Kosma', 'Zetzscha'],
  licensePlates: ['ABG', 'SLN'],
  painPoint: 'Gerade in Altenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ABG oder SLN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung hilft besonders bei Verkauf, Stilllegung oder schnellem Fahrzeugwechsel.',
},

'altenburger-land': {
  intro: 'Im Altenburger Land möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Altenburg', 'Schmölln', 'Meuselwitz', 'Gößnitz', 'Lucka', 'Nobitz'],
  licensePlates: ['ABG', 'SLN'],
  painPoint: 'Gerade im Altenburger Land kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ABG oder SLN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

altenholz: {
  intro: 'In Altenholz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Klausdorf', 'Stift', 'Knoop'],
  licensePlates: ['RD', 'ECK'],
  painPoint: 'Gerade in Altenholz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RD oder ECK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

altenkirchen: {
  intro: 'In Altenkirchen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wartezeit vor Ort.',
  districts: ['Leuzbach', 'Honneroth', 'Dieperzen', 'Helmenzen'],
  licensePlates: ['AK'],
  painPoint: 'Gerade in Altenkirchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

altensteig: {
  intro: 'In Altensteig möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Berneck', 'Garrweiler', 'Hornberg', 'Spielberg', 'Überberg', 'Walddorf-Wart'],
  licensePlates: ['CW'],
  painPoint: 'Gerade in Altensteig kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

altoetting: {
  intro: 'In Altötting möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit bei der Behörde.',
  districts: ['Raitenhart', 'Graming', 'Unterholzhausen', 'Sankt Georgen'],
  licensePlates: ['AÖ'],
  painPoint: 'Gerade in Altötting kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

alzenau: {
  intro: 'In Alzenau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne dafür einen Behördentermin einplanen zu müssen.',
  districts: ['Wasserlos', 'Hörstein', 'Albstadt', 'Michelbach', 'Kälberau'],
  licensePlates: ['AB', 'ALZ'],
  painPoint: 'Gerade in Alzenau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AB oder ALZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders angenehm, wenn das Fahrzeug schnell verkauft oder stillgelegt werden soll.',
},

alzey: {
  intro: 'In Alzey möchten viele Fahrzeughalter ihr Auto schnell und unkompliziert online abmelden.',
  districts: ['Weinheim', 'Dautenheim', 'Schafhausen', 'Heimersheim'],
  licensePlates: ['AZ'],
  painPoint: 'Gerade in Alzey kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'alzey-worms': {
  intro: 'Im Landkreis Alzey-Worms möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege zur Behörde.',
  districts: ['Alzey', 'Wörrstadt', 'Osthofen', 'Monsheim', 'Eich', 'Flonheim', 'Gau-Odernheim'],
  licensePlates: ['AZ'],
  painPoint: 'Gerade im Landkreis Alzey-Worms kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Vorgang schnell und ohne zusätzlichen Termin erledigt werden soll.',
},

amberg: {
  intro: 'In Amberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit bei der Behörde.',
  districts: ['Gailoh', 'Raigering', 'Ammersricht', 'Luitpoldhöhe', 'Kümmersbruck'],
  licensePlates: ['AM'],
  painPoint: 'Gerade in Amberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

ammerland: {
  intro: 'Im Ammerland möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Westerstede', 'Bad Zwischenahn', 'Rastede', 'Edewecht', 'Wiefelstede', 'Apen'],
  licensePlates: ['WST'],
  painPoint: 'Gerade im Ammerland kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WST abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich, wenn das Fahrzeug schnell verkauft oder stillgelegt werden soll.',
},

andernach: {
  intro: 'In Andernach möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Namedy', 'Eich', 'Kell', 'Miesenheim'],
  licensePlates: ['MYK', 'MY'],
  painPoint: 'Gerade in Andernach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MYK oder MY abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'anhalt-bitterfeld': {
  intro: 'Im Landkreis Anhalt-Bitterfeld möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötige Behördengänge abmelden.',
  districts: ['Bitterfeld-Wolfen', 'Köthen', 'Zerbst', 'Aken', 'Sandersdorf-Brehna', 'Zörbig'],
  licensePlates: ['ABI', 'BTF', 'KÖT', 'AZE'],
  painPoint: 'Gerade im Landkreis Anhalt-Bitterfeld kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ABI, BTF, KÖT oder AZE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem, wenn der Vorgang schnell und ohne zusätzlichen Termin erledigt werden soll.',
},

anklam: {
  intro: 'In Anklam möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Pelsin', 'Stretense', 'Gellendin'],
  licensePlates: ['VG', 'ANK'],
  painPoint: 'Gerade in Anklam kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VG oder ANK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'annaberg-buchholz': {
  intro: 'In Annaberg-Buchholz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wartezeit bei der Behörde.',
  districts: ['Frohnau', 'Cunersdorf', 'Kleinrückerswalde', 'Geyersdorf'],
  licensePlates: ['ERZ', 'ANA'],
  painPoint: 'Gerade in Annaberg-Buchholz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ERZ oder ANA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Fahrzeugverkauf oder Stilllegung.',
},

ansbach: {
  intro: 'In Ansbach möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördentermin abmelden.',
  districts: ['Eyb', 'Brodswinden', 'Elpersdorf', 'Hennenbach', 'Meinhardswinden', 'Schalkhausen'],
  licensePlates: ['AN'],
  painPoint: 'Gerade in Ansbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

apolda: {
  intro: 'In Apolda möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Oberndorf', 'Herressen-Sulzbach', 'Zottelstedt', 'Schöten'],
  licensePlates: ['AP'],
  painPoint: 'Gerade in Apolda kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn das Fahrzeug verkauft, stillgelegt oder gewechselt wird.',
},

arnsberg: {
  intro: 'In Arnsberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Neheim', 'Hüsten', 'Oeventrop', 'Voßwinkel', 'Bruchhausen', 'Herdringen', 'Müschede'],
  licensePlates: ['HSK'],
  painPoint: 'Gerade in Arnsberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HSK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

arnstadt: {
  intro: 'In Arnstadt möchten viele Fahrzeughalter ihr Auto schnell und unkompliziert online abmelden.',
  districts: ['Rudisleben', 'Angelhausen-Oberndorf', 'Siegelbach', 'Dosdorf', 'Espenfeld'],
  licensePlates: ['IK', 'ARN'],
  painPoint: 'Gerade in Arnstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen IK oder ARN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

artern: {
  intro: 'In Artern möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Voigtstedt', 'Schönfeld', 'Kachstedt'],
  licensePlates: ['KYF', 'ART'],
  painPoint: 'Gerade in Artern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KYF oder ART abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders angenehm, wenn das Fahrzeug schnell abgemeldet werden soll.',
},

aschaffenburg: {
  intro: 'In Aschaffenburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Damm', 'Leider', 'Nilkheim', 'Obernau', 'Schweinheim', 'Strietwald', 'Gailbach'],
  licensePlates: ['AB'],
  painPoint: 'Gerade in Aschaffenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

aschendorf: {
  intro: 'In Aschendorf möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Tunxdorf', 'Herbrum', 'Nenndorf'],
  licensePlates: ['EL', 'ASD', 'MEP', 'PAP'],
  painPoint: 'Gerade in Aschendorf kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EL, ASD, MEP oder PAP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

aschersleben: {
  intro: 'In Aschersleben möchten viele Fahrzeughalter ihr Auto schnell und ohne zusätzlichen Behördentermin abmelden.',
  districts: ['Westdorf', 'Mehringen', 'Klein Schierstedt', 'Wilsleben', 'Schackenthal'],
  licensePlates: ['SLK', 'ASL'],
  painPoint: 'Gerade in Aschersleben kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SLK oder ASL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

aue: {
  intro: 'In Aue möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit bei der Behörde.',
  districts: ['Aue-Bad Schlema', 'Niederschlema', 'Wildbach', 'Zelle'],
  licensePlates: ['ERZ', 'AUE'],
  painPoint: 'Gerade in Aue kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ERZ oder AUE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

auerbach: {
  intro: 'In Auerbach möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege und Wartezeiten.',
  districts: ['Reumtengrün', 'Beerheide', 'Rebesgrün', 'Sorga', 'Brunn'],
  licensePlates: ['V', 'AE', 'OVL', 'PL', 'RC'],
  painPoint: 'Gerade in Auerbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen V, AE, OVL, PL oder RC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

augsburg: {
  intro: 'In Augsburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Göggingen', 'Haunstetten', 'Lechhausen', 'Pfersee', 'Oberhausen', 'Hochzoll', 'Innenstadt'],
  licensePlates: ['A'],
  painPoint: 'Gerade in Augsburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen A abmelden möchte, kann den Vorgang online vorbereiten und spart sich häufig den Weg zur Behörde.',
  conversionText: 'Besonders bei Verkauf, Stilllegung oder Fahrzeugwechsel ist die Online-Abmeldung eine schnelle und einfache Lösung.',
},

aurich: {
  intro: 'In Aurich möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Sandhorst', 'Popens', 'Walle', 'Wallinghausen', 'Middels', 'Tannenhausen', 'Egels'],
  licensePlates: ['AUR', 'NOR'],
  painPoint: 'Gerade in Aurich kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AUR oder NOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn das Fahrzeug verkauft, stillgelegt oder schnell abgemeldet werden soll.',
},

bochum: {
  intro: 'In Bochum möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne Wartezeit bei der Zulassungsstelle.',
  districts: ['Wattenscheid', 'Langendreer', 'Wiemelhausen', 'Grumme', 'Linden', 'Weitmar', 'Hamme'],
  licensePlates: ['BO'],
  painPoint: 'Gerade in Bochum kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BO abmelden möchte, kann den Vorgang online vorbereiten und spart sich häufig den Weg zur Behörde.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

heilbronn: {
  intro: 'In Heilbronn möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzlichen Behördentermin.',
  districts: ['Böckingen', 'Sontheim', 'Neckargartach', 'Klingenberg', 'Kirchhausen', 'Biberach', 'Frankenbach'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Heilbronn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

karlsbad: {
  intro: 'In Karlsbad möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Langensteinbach', 'Auerbach', 'Ittersbach', 'Mutschelbach', 'Spielberg'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Karlsbad kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf oder Stilllegung.',
},

koeln: {
  intro: 'In Köln möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Ehrenfeld', 'Nippes', 'Kalk', 'Porz', 'Lindenthal', 'Mülheim', 'Innenstadt'],
  licensePlates: ['K'],
  painPoint: 'Gerade in Köln kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen K abmelden möchte, kann den Vorgang online vorbereiten und spart sich häufig den Weg zur Behörde.',
  conversionText: 'Für Nutzer aus Ehrenfeld, Nippes, Kalk, Porz, Lindenthal, Mülheim oder der Innenstadt ist der digitale Weg oft die bequemere Lösung.',
},

landshut: {
  intro: 'In Landshut möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit bei der Behörde.',
  districts: ['Achdorf', 'Berg', 'Nikola', 'Schönbrunn', 'Münchnerau', 'Wolfgangsiedlung', 'Frauenberg'],
  licensePlates: ['LA'],
  painPoint: 'Gerade in Landshut kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

neuss: {
  intro: 'In Neuss möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne Termin und ohne unnötige Wartezeit.',
  districts: ['Norf', 'Reuschenberg', 'Grimlinghausen', 'Holzheim', 'Uedesheim', 'Weckhoven', 'Furth'],
  licensePlates: ['NE', 'GV'],
  painPoint: 'Gerade in Neuss kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NE oder GV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

wuppertal: {
  intro: 'In Wuppertal möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder Behördentermin.',
  districts: ['Barmen', 'Elberfeld', 'Vohwinkel', 'Cronenberg', 'Ronsdorf', 'Langerfeld', 'Heckinghausen'],
  licensePlates: ['W'],
  painPoint: 'Gerade in Wuppertal kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen W abmelden möchte, kann den Vorgang online vorbereiten und spart sich häufig den Weg zur Behörde.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

backnang: {
  intro: 'In Backnang möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Maubach', 'Waldrems', 'Heiningen', 'Strümpfelbach', 'Steinbach', 'Sachsenweiler'],
  licensePlates: ['WN', 'BK'],
  painPoint: 'Gerade in Backnang kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WN oder BK abmelden möchte, kann den Vorgang online vorbereiten und spart sich in vielen Fällen den Weg zur Behörde.',
  conversionText: 'Gerade bei Fahrzeugverkauf, Stilllegung oder Wechsel des Fahrzeugs hilft ein klarer digitaler Ablauf ohne zusätzlichen Termin.',
},

'bad-aibling': {
  intro: 'In Bad Aibling möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder unnötige Wege.',
  districts: ['Mietraching', 'Ellmosen', 'Berbling', 'Thürham', 'Willing', 'Harthausen'],
  licensePlates: ['RO', 'AIB'],
  painPoint: 'Gerade in Bad Aibling kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RO oder AIB abmelden möchte, kann den Vorgang online vorbereiten und spart sich häufig den Weg zur Behörde.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder schnellem Fahrzeugwechsel.',
},

'bad-arolsen': {
  intro: 'In Bad Arolsen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra einen Behördentermin einplanen zu müssen.',
  districts: ['Mengeringhausen', 'Helsen', 'Massenhausen', 'Wetterburg', 'Schmillinghausen', 'Landau'],
  licensePlates: ['KB', 'WA'],
  painPoint: 'Gerade in Bad Arolsen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KB oder WA abmelden möchte, kann den Vorgang bequem online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-bentheim': {
  intro: 'In Bad Bentheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit bei der Behörde.',
  districts: ['Gildehaus', 'Sieringhoek', 'Waldseite', 'Bardel', 'Westenberg'],
  licensePlates: ['NOH'],
  painPoint: 'Gerade in Bad Bentheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NOH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem, wenn das Fahrzeug verkauft, stillgelegt oder gewechselt werden soll.',
},

'bad-bergzabern': {
  intro: 'In Bad Bergzabern möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötige Wege abmelden.',
  districts: ['Blankenborn', 'Dörrenbach', 'Kapellen-Drusweiler', 'Birkenhördt', 'Oberotterbach'],
  licensePlates: ['SÜW'],
  painPoint: 'Gerade in Bad Bergzabern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SÜW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-berleburg': {
  intro: 'In Bad Berleburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Anfahrt oder Wartezeit.',
  districts: ['Berghausen', 'Aue', 'Elsoff', 'Girkhausen', 'Raumland', 'Schwarzenau', 'Wingeshausen'],
  licensePlates: ['SI', 'BLB'],
  painPoint: 'Gerade in Bad Berleburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SI oder BLB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich, wenn der Behördengang zeitlich schlecht passt oder das Fahrzeug schnell abgemeldet werden soll.',
},

'bad-brueckenau': {
  intro: 'In Bad Brückenau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Staatsbad Brückenau', 'Volkers', 'Wernarz', 'Römershag'],
  licensePlates: ['KG', 'BRK'],
  painPoint: 'Gerade in Bad Brückenau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KG oder BRK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-doberan': {
  intro: 'In Bad Doberan möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wartezeit oder Behördengang.',
  districts: ['Althof', 'Heiligendamm', 'Vorder Bollhagen', 'Hohenfelde', 'Glashagen'],
  licensePlates: ['LRO', 'DBR'],
  painPoint: 'Gerade in Bad Doberan kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LRO oder DBR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders angenehm bei Fahrzeugverkauf oder Stilllegung.',
},

'bad-duerkheim': {
  intro: 'In Bad Dürkheim möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördentermin abmelden.',
  districts: ['Grethen', 'Hardenburg', 'Hausen', 'Leistadt', 'Seebach', 'Ungstein'],
  licensePlates: ['DÜW'],
  painPoint: 'Gerade in Bad Dürkheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DÜW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-ems': {
  intro: 'In Bad Ems möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Kemmenau', 'Arzbach', 'Nievern', 'Fachbach', 'Dausenau'],
  licensePlates: ['EMS', 'DIZ', 'GOH'],
  painPoint: 'Gerade in Bad Ems kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EMS, DIZ oder GOH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-fallingbostel': {
  intro: 'In Bad Fallingbostel möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne einen Termin vor Ort einplanen zu müssen.',
  districts: ['Dorfmark', 'Riepe', 'Vierde', 'Jettebruch', 'Mengebostel'],
  licensePlates: ['HK'],
  painPoint: 'Gerade in Bad Fallingbostel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

'bad-friedrichshall': {
  intro: 'In Bad Friedrichshall möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder Behördengang.',
  districts: ['Kochendorf', 'Jagstfeld', 'Duttenberg', 'Untergriesheim', 'Hagenbach'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Bad Friedrichshall kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-gandersheim': {
  intro: 'In Bad Gandersheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Dankelsheim', 'Ellierode', 'Gremsheim', 'Harriehausen', 'Helmscherode', 'Wrescherode'],
  licensePlates: ['NOM', 'GAN'],
  painPoint: 'Gerade in Bad Gandersheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NOM oder GAN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-herrenalb': {
  intro: 'In Bad Herrenalb möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Bernbach', 'Neusatz', 'Rotensol', 'Gaistal'],
  licensePlates: ['CW'],
  painPoint: 'Gerade in Bad Herrenalb kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-hersfeld': {
  intro: 'In Bad Hersfeld möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit bei der Zulassungsstelle.',
  districts: ['Hohe Luft', 'Johannesberg', 'Petersberg', 'Sorga', 'Kathus', 'Asbach'],
  licensePlates: ['HEF', 'ROF'],
  painPoint: 'Gerade in Bad Hersfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HEF oder ROF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-homburg-vor-der-hoehe': {
  intro: 'In Bad Homburg vor der Höhe möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Kirdorf', 'Gonzenheim', 'Ober-Eschbach', 'Dornholzhausen', 'Ober-Erlenbach'],
  licensePlates: ['HG', 'USI'],
  painPoint: 'Gerade in Bad Homburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HG oder USI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-kissingen': {
  intro: 'In Bad Kissingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Garitz', 'Hausen', 'Reiterswiesen', 'Winkels', 'Arnshausen', 'Albertshausen'],
  licensePlates: ['KG', 'BRK'],
  painPoint: 'Gerade in Bad Kissingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KG oder BRK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn das Fahrzeug verkauft, stillgelegt oder gewechselt werden soll.',
},

'bad-koenigshofen': {
  intro: 'In Bad Königshofen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder Behördengang.',
  districts: ['Aubstadt', 'Eyershausen', 'Ipthausen', 'Merkershausen', 'Unteressfeld'],
  licensePlates: ['NES', 'KÖN'],
  painPoint: 'Gerade in Bad Königshofen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NES oder KÖN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-koesen': {
  intro: 'In Bad Kösen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege zur Behörde.',
  districts: ['Pforte', 'Fränkenau', 'Kleinheringen', 'Saaleck', 'Schulpforte'],
  licensePlates: ['BLK', 'NMB', 'NEB', 'ZZ'],
  painPoint: 'Gerade in Bad Kösen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BLK, NMB, NEB oder ZZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

'bad-koetzting': {
  intro: 'In Bad Kötzting möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit bei der Behörde.',
  districts: ['Liebenstein', 'Sackenried', 'Wettzell', 'Haus', 'Grub', 'Reitenstein'],
  licensePlates: ['CHA', 'KÖZ'],
  painPoint: 'Gerade in Bad Kötzting kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CHA oder KÖZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-kreuznach': {
  intro: 'In Bad Kreuznach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Bad Münster am Stein', 'Bosenheim', 'Ippesheim', 'Planig', 'Winzenheim'],
  licensePlates: ['KH'],
  painPoint: 'Gerade in Bad Kreuznach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-krozingen': {
  intro: 'In Bad Krozingen möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Biengen', 'Hausen', 'Schlatt', 'Tunsel', 'Schmidhofen'],
  licensePlates: ['FR', 'MÜL'],
  painPoint: 'Gerade in Bad Krozingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR oder MÜL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

'bad-langensalza': {
  intro: 'In Bad Langensalza möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Ufhoven', 'Zimmern', 'Thamsbrück', 'Nägelstedt', 'Aschara', 'Eckardtsleben'],
  licensePlates: ['UH', 'LSZ'],
  painPoint: 'Gerade in Bad Langensalza kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UH oder LSZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-liebenwerda': {
  intro: 'In Bad Liebenwerda möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Dobra', 'Kröbeln', 'Maasdorf', 'Theisa', 'Zobersdorf', 'Zeischa'],
  licensePlates: ['EE', 'FI', 'LIB'],
  painPoint: 'Gerade in Bad Liebenwerda kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EE, FI oder LIB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-liebenzell': {
  intro: 'In Bad Liebenzell möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege zur Behörde.',
  districts: ['Beinberg', 'Maisenbach-Zainen', 'Monakam', 'Möttlingen', 'Unterhaugstett'],
  licensePlates: ['CW'],
  painPoint: 'Gerade in Bad Liebenzell kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders angenehm bei Verkauf oder Stilllegung.',
},

'bad-mergentheim': {
  intro: 'In Bad Mergentheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne langen Behördentermin.',
  districts: ['Markelsheim', 'Edelfingen', 'Althausen', 'Dainbach', 'Neunkirchen', 'Stuppach'],
  licensePlates: ['TBB', 'MGH'],
  painPoint: 'Gerade in Bad Mergentheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TBB oder MGH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-muender': {
  intro: 'In Bad Münder möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Eimbeckhausen', 'Bakede', 'Nienstedt', 'Hachmühlen', 'Flegessen', 'Beber'],
  licensePlates: ['HM'],
  painPoint: 'Gerade in Bad Münder kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-neuenahr-ahrweiler': {
  intro: 'In Bad Neuenahr-Ahrweiler möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Ahrweiler', 'Bad Neuenahr', 'Heimersheim', 'Bachem', 'Walporzheim', 'Ehlingen'],
  licensePlates: ['AW'],
  painPoint: 'Gerade in Bad Neuenahr-Ahrweiler kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-neustadt-an-der-saale': {
  intro: 'In Bad Neustadt an der Saale möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege zur Behörde.',
  districts: ['Brendlorenzen', 'Dürrnhof', 'Herschfeld', 'Lebenhan', 'Mühlbach'],
  licensePlates: ['NES', 'KÖN'],
  painPoint: 'Gerade in Bad Neustadt an der Saale kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NES oder KÖN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-oeynhausen': {
  intro: 'In Bad Oeynhausen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Eidinghausen', 'Rehme', 'Werste', 'Volmerdingsen', 'Dehme', 'Lohe'],
  licensePlates: ['MI'],
  painPoint: 'Gerade in Bad Oeynhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-oldesloe': {
  intro: 'In Bad Oldesloe möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Rethwischfeld', 'Sehmsdorf', 'Wolkenwehe', 'Glinde', 'Pölitz'],
  licensePlates: ['OD'],
  painPoint: 'Gerade in Bad Oldesloe kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

'bad-rappenau': {
  intro: 'In Bad Rappenau möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördentermin abmelden.',
  districts: ['Bonfeld', 'Fürfeld', 'Grombach', 'Heinsheim', 'Obergimpern', 'Treschklingen', 'Wollenberg'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Bad Rappenau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-reichenhall': {
  intro: 'In Bad Reichenhall möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit bei der Behörde.',
  districts: ['Karlstein', 'Marzoll', 'Nonn', 'St. Zeno', 'Kirchberg'],
  licensePlates: ['BGL'],
  painPoint: 'Gerade in Bad Reichenhall kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BGL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-saeckingen': {
  intro: 'In Bad Säckingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeit.',
  districts: ['Wallbach', 'Rippolingen', 'Harpolingen', 'Obersäckingen'],
  licensePlates: ['WT', 'SÄK'],
  painPoint: 'Gerade in Bad Säckingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WT oder SÄK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

'bad-salzuflen': {
  intro: 'In Bad Salzuflen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Schötmar', 'Wüsten', 'Knetterheide', 'Werl-Aspe', 'Retzen', 'Ehrsen-Breden'],
  licensePlates: ['LIP'],
  painPoint: 'Gerade in Bad Salzuflen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LIP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-salzungen': {
  intro: 'In Bad Salzungen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge.',
  districts: ['Allendorf', 'Ettenhausen', 'Hämbach', 'Kaltenborn', 'Kloster', 'Langenfeld'],
  licensePlates: ['WAK', 'SLZ'],
  painPoint: 'Gerade in Bad Salzungen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WAK oder SLZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-saulgau': {
  intro: 'In Bad Saulgau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Bierstetten', 'Bolstern', 'Bondorf', 'Braunenweiler', 'Friedberg', 'Renhardsweiler', 'Wolfartsweiler'],
  licensePlates: ['SIG', 'SLG'],
  painPoint: 'Gerade in Bad Saulgau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SIG oder SLG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-schoenborn': {
  intro: 'In Bad Schönborn möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wartezeiten oder Wege.',
  districts: ['Mingolsheim', 'Langenbrücken'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Bad Schönborn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf oder Stilllegung.',
},

'bad-schwalbach': {
  intro: 'In Bad Schwalbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit bei der Behörde.',
  districts: ['Adolfseck', 'Fischbach', 'Heimbach', 'Hettenhain', 'Langenseifen', 'Lindschied'],
  licensePlates: ['RÜD', 'SWA'],
  painPoint: 'Gerade in Bad Schwalbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RÜD oder SWA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-segeberg': {
  intro: 'In Bad Segeberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Wege.',
  districts: ['Klein Niendorf', 'Ihlwald', 'Högersdorf', 'Fahrenkrug', 'Schackendorf'],
  licensePlates: ['SE'],
  painPoint: 'Gerade in Bad Segeberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-toelz': {
  intro: 'In Bad Tölz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Wackersberg', 'Ellbach', 'Oberfischbach', 'Kirchbichl', 'Walgerfranz'],
  licensePlates: ['TÖL', 'WOR'],
  painPoint: 'Gerade in Bad Tölz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TÖL oder WOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bad-waldsee': {
  intro: 'In Bad Waldsee möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Gaisbeuren', 'Haisterkirch', 'Michelwinnaden', 'Mittelurbach', 'Reute', 'Steinach'],
  licensePlates: ['RV', 'SLG'],
  painPoint: 'Gerade in Bad Waldsee kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RV oder SLG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-wildbad-calmbach': {
  intro: 'In Bad Wildbad-Calmbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Calmbach', 'Sprollenhaus', 'Aichelberg', 'Hünerberg', 'Meistern'],
  licensePlates: ['CW'],
  painPoint: 'Gerade in Bad Wildbad-Calmbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

'bad-wildungen': {
  intro: 'In Bad Wildungen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wartezeit bei der Behörde.',
  districts: ['Altwildungen', 'Reinhardshausen', 'Braunau', 'Bergfreiheit', 'Odershausen', 'Wega'],
  licensePlates: ['KB', 'WA'],
  painPoint: 'Gerade in Bad Wildungen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KB oder WA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bad-windsheim': {
  intro: 'In Bad Windsheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Külsheim', 'Lenkersheim', 'Oberntief', 'Erkenbrechtshofen', 'Ickelheim', 'Wiebelsheim'],
  licensePlates: ['NEA', 'SEF', 'UFE'],
  painPoint: 'Gerade in Bad Windsheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NEA, SEF oder UFE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'baden-baden': {
  intro: 'In Baden-Baden möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Oos', 'Lichtental', 'Sandweier', 'Steinbach', 'Neuweier', 'Haueneberstein', 'Ebersteinburg'],
  licensePlates: ['BAD'],
  painPoint: 'Gerade in Baden-Baden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BAD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'baden-wuerttemberg': {
  intro: 'In Baden-Württemberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Stuttgart', 'Karlsruhe', 'Mannheim', 'Freiburg', 'Heilbronn', 'Ulm', 'Pforzheim'],
  licensePlates: ['S', 'KA', 'MA', 'FR', 'HN', 'UL', 'PF'],
  painPoint: 'Gerade in Baden-Württemberg kosten Termine, Anfahrt und Wartezeit je nach Stadt oder Landkreis oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug in Baden-Württemberg abmelden möchte, kann den Vorgang online vorbereiten und spart sich in vielen Fällen den Weg zur Behörde.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Vorgang schnell, einfach und bundesweit gültig erledigt werden soll.',
},

baiersbronn: {
  intro: 'In Baiersbronn möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Klosterreichenbach', 'Mitteltal', 'Obertal', 'Schwarzenberg', 'Tonbach', 'Röt'],
  licensePlates: ['FDS', 'HOR'],
  painPoint: 'Gerade in Baiersbronn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FDS oder HOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

balingen: {
  intro: 'In Balingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege zur Zulassungsstelle.',
  districts: ['Endingen', 'Engstlatt', 'Frommern', 'Heselwangen', 'Ostdorf', 'Weilstetten', 'Zillhausen'],
  licensePlates: ['BL', 'HCH'],
  painPoint: 'Gerade in Balingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BL oder HCH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

bamberg: {
  intro: 'In Bamberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Gaustadt', 'Gartenstadt', 'Bug', 'Wunderburg', 'Kramersfeld', 'Berggebiet', 'Inselstadt'],
  licensePlates: ['BA'],
  painPoint: 'Gerade in Bamberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

barnim: {
  intro: 'Im Barnim möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötige Behördengänge abmelden.',
  districts: ['Eberswalde', 'Bernau', 'Wandlitz', 'Ahrensfelde', 'Panketal', 'Biesenthal', 'Werbellinsee'],
  licensePlates: ['BAR', 'BER', 'EW'],
  painPoint: 'Gerade im Barnim kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BAR, BER oder EW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Weg zur Behörde länger ist oder der Vorgang schnell erledigt werden soll.',
},

barntrup: {
  intro: 'In Barntrup möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder unnötige Wege.',
  districts: ['Alverdissen', 'Selbeck', 'Sonneborn', 'Sommerell', 'Bega'],
  licensePlates: ['LIP'],
  painPoint: 'Gerade in Barntrup kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LIP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

bautzen: {
  intro: 'In Bautzen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit bei der Behörde.',
  districts: ['Gesundbrunnen', 'Seidau', 'Stiebitz', 'Teichnitz', 'Kleinwelka', 'Nadelwitz', 'Oberkaina'],
  licensePlates: ['BZ', 'BIW', 'HY', 'KM'],
  painPoint: 'Gerade in Bautzen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BZ, BIW, HY oder KM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

bayreuth: {
  intro: 'In Bayreuth möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne unnötige Wartezeit.',
  districts: ['Altstadt', 'St. Georgen', 'Meyernberg', 'Laineck', 'Saas', 'Aichig', 'Oberkonnersreuth'],
  licensePlates: ['BT'],
  painPoint: 'Gerade in Bayreuth kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

beckum: {
  intro: 'In Beckum möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Neubeckum', 'Roland', 'Vellern', 'Dünninghausen'],
  licensePlates: ['WAF', 'BE'],
  painPoint: 'Gerade in Beckum kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WAF oder BE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

beelitz: {
  intro: 'In Beelitz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Beelitz-Heilstätten', 'Fichtenwalde', 'Schönefeld', 'Busendorf', 'Elsholz', 'Salzbrunn'],
  licensePlates: ['PM'],
  painPoint: 'Gerade in Beelitz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf oder Stilllegung.',
},

beeskow: {
  intro: 'In Beeskow möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördentermin abmelden.',
  districts: ['Oegeln', 'Radinkendorf', 'Bornow', 'Neuendorf', 'Schneeberg'],
  licensePlates: ['LOS', 'BSK', 'EH', 'FW'],
  painPoint: 'Gerade in Beeskow kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LOS, BSK, EH oder FW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

beilngries: {
  intro: 'In Beilngries möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Hirschberg', 'Kottingwörth', 'Paulushofen', 'Wolfsbuch', 'Kevenhüll', 'Biberbach'],
  licensePlates: ['EI'],
  painPoint: 'Gerade in Beilngries kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

belzig: {
  intro: 'In Belzig möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Kuhlowitz', 'Lütte', 'Neschholz', 'Schwanebeck', 'Werbig', 'Dippmannsdorf'],
  licensePlates: ['PM'],
  painPoint: 'Gerade in Belzig kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

'berchtesgadener-land': {
  intro: 'Im Berchtesgadener Land möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Bad Reichenhall', 'Berchtesgaden', 'Freilassing', 'Laufen', 'Piding', 'Bischofswiesen', 'Ainring'],
  licensePlates: ['BGL'],
  painPoint: 'Gerade im Berchtesgadener Land kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BGL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich, wenn der Vorgang schnell und ohne zusätzlichen Termin erledigt werden soll.',
},

bergheim: {
  intro: 'In Bergheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Quadrath-Ichendorf', 'Ahe', 'Glesch', 'Niederaußem', 'Oberaußem', 'Paffendorf', 'Zieverich'],
  licensePlates: ['BM'],
  painPoint: 'Gerade in Bergheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bergisch-gladbach': {
  intro: 'In Bergisch Gladbach möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Bensberg', 'Refrath', 'Schildgen', 'Paffrath', 'Hand', 'Hebborn', 'Moitzfeld'],
  licensePlates: ['GL'],
  painPoint: 'Gerade in Bergisch Gladbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

bergstrasse: {
  intro: 'Im Kreis Bergstraße möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Heppenheim', 'Bensheim', 'Viernheim', 'Lampertheim', 'Lorsch', 'Zwingenberg', 'Fürth'],
  licensePlates: ['HP'],
  painPoint: 'Gerade im Kreis Bergstraße kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

berlin: {
  intro: 'In Berlin ist die Online-Abmeldung für viele Fahrzeughalter besonders hilfreich, weil Wege, Termine und Wartezeiten je nach Bezirk schnell viel Zeit kosten können.',
  districts: ['Mitte', 'Neukölln', 'Spandau', 'Charlottenburg', 'Pankow', 'Tempelhof', 'Marzahn'],
  licensePlates: ['B'],
  painPoint: 'Gerade in Berlin kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Berliner Kennzeichen B abmelden möchte, kann den Vorgang online vorbereiten und spart sich häufig den Weg zur Behörde.',
  conversionText: 'Der digitale Weg ist besonders praktisch, wenn der Vorgang ohne Anfahrt und ohne Termin vorbereitet werden soll.',
},

bernburg: {
  intro: 'In Bernburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Waldau', 'Preußlitz', 'Biendorf', 'Gröna', 'Peißen', 'Poley', 'Baalberge'],
  licensePlates: ['SLK', 'BBG'],
  painPoint: 'Gerade in Bernburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SLK oder BBG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'bernkastel-kues': {
  intro: 'In Bernkastel-Kues möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Kues', 'Andel', 'Wehlen', 'Bernkastel', 'Brauheck'],
  licensePlates: ['WIL', 'BKS'],
  painPoint: 'Gerade in Bernkastel-Kues kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WIL oder BKS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'bernkastel-wittlich': {
  intro: 'Im Landkreis Bernkastel-Wittlich möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Behörde.',
  districts: ['Wittlich', 'Bernkastel-Kues', 'Morbach', 'Traben-Trarbach', 'Manderscheid', 'Zeltingen-Rachtig'],
  licensePlates: ['WIL', 'BKS'],
  painPoint: 'Gerade im Landkreis Bernkastel-Wittlich kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WIL oder BKS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Vorgang schnell und ohne zusätzlichen Termin erledigt werden soll.',
},

bersenbrueck: {
  intro: 'In Bersenbrück möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Ahausen', 'Hastrup', 'Talge', 'Woltrup'],
  licensePlates: ['OS', 'BSB'],
  painPoint: 'Gerade in Bersenbrück kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OS oder BSB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

besigheim: {
  intro: 'In Besigheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder Zusatzwege.',
  districts: ['Ottmarsheim', 'Walheim', 'Hessigheim', 'Gemrigheim', 'Löchgau'],
  licensePlates: ['LB', 'VAI'],
  painPoint: 'Gerade in Besigheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LB oder VAI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

biberach: {
  intro: 'In Biberach möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Rißegg', 'Mettenberg', 'Stafflangen', 'Ringschnait', 'Hagenbuch'],
  licensePlates: ['BC'],
  painPoint: 'Gerade in Biberach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

biedenkopf: {
  intro: 'In Biedenkopf möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege zur Behörde.',
  districts: ['Wallau', 'Breidenstein', 'Dexbach', 'Eckelshausen', 'Kombach', 'Weifenbach'],
  licensePlates: ['MR', 'BID'],
  painPoint: 'Gerade in Biedenkopf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MR oder BID abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

bielefeld: {
  intro: 'In Bielefeld möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Brackwede', 'Senne', 'Sennestadt', 'Heepen', 'Jöllenbeck', 'Dornberg', 'Mitte'],
  licensePlates: ['BI'],
  painPoint: 'Gerade in Bielefeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

birkenfeld: {
  intro: 'In Birkenfeld möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Brücken', 'Dienstweiler', 'Hoppstädten-Weiersbach', 'Niederbrombach', 'Rinzenberg'],
  licensePlates: ['BIR'],
  painPoint: 'Gerade in Birkenfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BIR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

bischofswerda: {
  intro: 'In Bischofswerda möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Belmsdorf', 'Geißmannsdorf', 'Goldbach', 'Großdrebnitz', 'Schönbrunn', 'Weickersdorf'],
  licensePlates: ['BZ', 'BIW', 'HY', 'KM'],
  painPoint: 'Gerade in Bischofswerda kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BZ, BIW, HY oder KM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

bitburg: {
  intro: 'In Bitburg möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördentermin abmelden.',
  districts: ['Matzen', 'Mötsch', 'Erdorf', 'Masholder', 'Stahl'],
  licensePlates: ['BIT', 'PRÜ'],
  painPoint: 'Gerade in Bitburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BIT oder PRÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders angenehm bei Verkauf oder Stilllegung.',
},

'bitburg-pruem': {
  intro: 'Im Eifelkreis Bitburg-Prüm möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege zur Behörde.',
  districts: ['Bitburg', 'Prüm', 'Neuerburg', 'Speicher', 'Arzfeld', 'Irrel', 'Kyllburg'],
  licensePlates: ['BIT', 'PRÜ'],
  painPoint: 'Gerade im Eifelkreis Bitburg-Prüm kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BIT oder PRÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich, wenn der Weg zur Zulassungsstelle länger ist oder der Vorgang schnell erledigt werden soll.',
},

bitterfeld: {
  intro: 'In Bitterfeld möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit bei der Behörde.',
  districts: ['Bitterfeld-Wolfen', 'Holzweißig', 'Greppin', 'Bobbau', 'Thalheim'],
  licensePlates: ['ABI', 'BTF', 'KÖT', 'AZE'],
  painPoint: 'Gerade in Bitterfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ABI, BTF, KÖT oder AZE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

blankenburg: {
  intro: 'In Blankenburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Cattenstedt', 'Derenburg', 'Heimburg', 'Hüttenrode', 'Timmenrode', 'Wienrode'],
  licensePlates: ['HZ', 'HBS', 'QLB', 'WR'],
  painPoint: 'Gerade in Blankenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HZ, HBS, QLB oder WR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

blaubeuren: {
  intro: 'In Blaubeuren möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Gerhausen', 'Asch', 'Beiningen', 'Pappelau', 'Seißen', 'Sonderbuch', 'Weiler'],
  licensePlates: ['UL', 'EHI'],
  painPoint: 'Gerade in Blaubeuren kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UL oder EHI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

blaustein: {
  intro: 'In Blaustein möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Herrlingen', 'Klingenstein', 'Ehrenstein', 'Arnegg', 'Markbronn', 'Weidach'],
  licensePlates: ['UL', 'EHI'],
  painPoint: 'Gerade in Blaustein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UL oder EHI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

boeblingen: {
  intro: 'In Böblingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Dagersheim', 'Diezenhalde', 'Hulb', 'Tannenberg', 'Waldburg', 'Grund'],
  licensePlates: ['BB', 'LEO'],
  painPoint: 'Gerade in Böblingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BB oder LEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

bocholt: {
  intro: 'In Bocholt möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Biemenhorst', 'Lowick', 'Holtwick', 'Stenern', 'Mussum', 'Barlo', 'Suderwick'],
  licensePlates: ['BOR', 'BOH', 'AH'],
  painPoint: 'Gerade in Bocholt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BOR, BOH oder AH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

bodenseekreis: {
  intro: 'Im Bodenseekreis möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Friedrichshafen', 'Überlingen', 'Tettnang', 'Markdorf', 'Meckenbeuren', 'Salem', 'Langenargen'],
  licensePlates: ['FN', 'TT', 'ÜB'],
  painPoint: 'Gerade im Bodenseekreis kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FN, TT oder ÜB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Weg zur Behörde länger ist oder der Vorgang schnell erledigt werden soll.',
},

bogen: {
  intro: 'In Bogen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege zur Zulassungsstelle.',
  districts: ['Oberalteich', 'Bärndorf', 'Pfelling', 'Degernbach', 'Bogenberg'],
  licensePlates: ['SR', 'BOG', 'MAL'],
  painPoint: 'Gerade in Bogen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SR, BOG oder MAL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

boizenburg: {
  intro: 'In Boizenburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Wege.',
  districts: ['Bahnhof', 'Gehrum', 'Gothmann', 'Vier', 'Schwartow'],
  licensePlates: ['LUP', 'HGN', 'LWL', 'PCH', 'STB'],
  painPoint: 'Gerade in Boizenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LUP, HGN oder LWL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

bonn: {
  intro: 'In Bonn möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Bad Godesberg', 'Beuel', 'Duisdorf', 'Tannenbusch', 'Hardtberg', 'Endenich', 'Poppelsdorf'],
  licensePlates: ['BN'],
  painPoint: 'Gerade in Bonn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

bopfingen: {
  intro: 'In Bopfingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Aufhausen', 'Baldern', 'Flochberg', 'Kerkingen', 'Oberdorf', 'Schloßberg', 'Trochtelfingen'],
  licensePlates: ['AA'],
  painPoint: 'Gerade in Bopfingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

boppard: {
  intro: 'In Boppard möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Bad Salzig', 'Buchholz', 'Herschwiesen', 'Hirzenach', 'Oppenhausen', 'Weiler'],
  licensePlates: ['SIM', 'GOA'],
  painPoint: 'Gerade in Boppard kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SIM oder GOA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

borken: {
  intro: 'In Borken möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne unnötige Wartezeit.',
  districts: ['Gemen', 'Weseke', 'Burlo', 'Marbeck', 'Rhedebrügge', 'Hoxfeld'],
  licensePlates: ['BOR', 'BOH', 'AH'],
  painPoint: 'Gerade in Borken kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BOR, BOH oder AH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

borna: {
  intro: 'In Borna möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit bei der Behörde.',
  districts: ['Gnandorf', 'Zedtlitz', 'Eula', 'Neukirchen', 'Wyhra', 'Thräna'],
  licensePlates: ['L', 'BNA', 'GRM', 'MTL'],
  painPoint: 'Gerade in Borna kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen L, BNA, GRM oder MTL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

bottrop: {
  intro: 'In Bottrop möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Kirchhellen', 'Eigen', 'Fuhlenbrock', 'Boy', 'Welheim', 'Batenbrock', 'Grafenwald'],
  licensePlates: ['BOT'],
  painPoint: 'Gerade in Bottrop kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BOT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

brackenheim: {
  intro: 'In Brackenheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Botenheim', 'Dürrenzimmern', 'Hausen', 'Haberschlacht', 'Meimsheim', 'Neipperg', 'Stockheim'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Brackenheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

brake: {
  intro: 'In Brake möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Harrien', 'Kirchhammelwarden', 'Golzwarden', 'Boitwarden', 'Süddieck'],
  licensePlates: ['BRA'],
  painPoint: 'Gerade in Brake kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BRA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

bramsche: {
  intro: 'In Bramsche möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder unnötige Wege.',
  districts: ['Achmer', 'Engter', 'Epe', 'Hesepe', 'Kalkriese', 'Pente', 'Ueffeln'],
  licensePlates: ['OS', 'BSB'],
  painPoint: 'Gerade in Bramsche kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OS oder BSB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'brandenburg-an-der-havel': {
  intro: 'In Brandenburg an der Havel möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Hohenstücken', 'Nord', 'Görden', 'Kirchmöser', 'Plaue', 'Wust', 'Schmerzke'],
  licensePlates: ['BRB'],
  painPoint: 'Gerade in Brandenburg an der Havel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BRB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

braunschweig: {
  intro: 'In Braunschweig möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne unnötige Wartezeit.',
  districts: ['Wenden', 'Rüningen', 'Querum', 'Gliesmarode', 'Stöckheim', 'Lehndorf', 'Heidberg'],
  licensePlates: ['BS'],
  painPoint: 'Gerade in Braunschweig kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'breisach-am-rhein': {
  intro: 'In Breisach am Rhein möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder Zusatzwege.',
  districts: ['Gündlingen', 'Niederrimsingen', 'Oberrimsingen', 'Hochstetten'],
  licensePlates: ['FR', 'MÜL'],
  painPoint: 'Gerade in Breisach am Rhein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR oder MÜL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

bremen: {
  intro: 'In Bremen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Neustadt', 'Walle', 'Vegesack', 'Hemelingen', 'Findorff', 'Osterholz', 'Gröpelingen'],
  licensePlates: ['HB'],
  painPoint: 'Gerade in Bremen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

bremerhaven: {
  intro: 'In Bremerhaven möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit bei der Behörde.',
  districts: ['Lehe', 'Geestemünde', 'Wulsdorf', 'Mitte', 'Surheide', 'Schiffdorferdamm'],
  licensePlates: ['HB'],
  painPoint: 'Gerade in Bremerhaven kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf oder Stilllegung.',
},

bremervoerde: {
  intro: 'In Bremervörde möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Bevern', 'Elm', 'Hesedorf', 'Minstedt', 'Nieder Ochtenhausen', 'Plönjeshausen'],
  licensePlates: ['ROW', 'BRV'],
  painPoint: 'Gerade in Bremervörde kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ROW oder BRV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

bretten: {
  intro: 'In Bretten möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Bauerbach', 'Büchig', 'Diedelsheim', 'Dürrenbüchig', 'Gölshausen', 'Neibsheim', 'Rinklingen'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Bretten kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

brilon: {
  intro: 'In Brilon möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Alme', 'Hoppecke', 'Madfeld', 'Messinghausen', 'Nehden', 'Scharfenberg', 'Thülen'],
  licensePlates: ['HSK', 'BRI', 'MES'],
  painPoint: 'Gerade in Brilon kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HSK, BRI oder MES abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders bequem bei Verkauf oder Stilllegung.',
},

bruchsal: {
  intro: 'In Bruchsal möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Heidelsheim', 'Helmsheim', 'Obergrombach', 'Untergrombach', 'Büchenau'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Bruchsal kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

buchen: {
  intro: 'In Buchen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Bödigheim', 'Eberstadt', 'Götzingen', 'Hainstadt', 'Hettingen', 'Hollerbach', 'Waldhausen'],
  licensePlates: ['MOS', 'BCH'],
  painPoint: 'Gerade in Buchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MOS oder BCH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

bueckeburg: {
  intro: 'In Bückeburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Berenbusch', 'Bergdorf', 'Cammer', 'Meinsen', 'Rusbend', 'Scheie', 'Warber'],
  licensePlates: ['SHG'],
  painPoint: 'Gerade in Bückeburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

buedingen: {
  intro: 'In Büdingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wartezeit bei der Behörde.',
  districts: ['Düdelsheim', 'Vonhausen', 'Wolf', 'Lorbach', 'Aulendiebach', 'Büches', 'Dudenrod'],
  licensePlates: ['FB', 'BÜD'],
  painPoint: 'Gerade in Büdingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FB oder BÜD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

buehl: {
  intro: 'In Bühl möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Altschweier', 'Eisental', 'Moos', 'Neusatz', 'Oberbruch', 'Vimbuch', 'Weitenung'],
  licensePlates: ['RA', 'BH'],
  painPoint: 'Gerade in Bühl kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RA oder BH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf oder Stilllegung.',
},

burg: {
  intro: 'In Burg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Niegripp', 'Reesen', 'Schartau', 'Detershagen', 'Ihleburg'],
  licensePlates: ['JL', 'BRG', 'GNT'],
  painPoint: 'Gerade in Burg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen JL, BRG oder GNT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

burgdorf: {
  intro: 'In Burgdorf möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Ehlershausen', 'Hülptingsen', 'Otze', 'Ramlingen', 'Schillerslage', 'Sorgensen', 'Weferlingsen'],
  licensePlates: ['H'],
  painPoint: 'Gerade in Burgdorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen H abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

burgenlandkreis: {
  intro: 'Im Burgenlandkreis möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötige Behördengänge abmelden.',
  districts: ['Naumburg', 'Weißenfels', 'Zeitz', 'Nebra', 'Hohenmölsen', 'Lützen', 'Teuchern'],
  licensePlates: ['BLK', 'NMB', 'NEB', 'ZZ'],
  painPoint: 'Gerade im Burgenlandkreis kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BLK, NMB, NEB oder ZZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Vorgang schnell und ohne zusätzlichen Termin erledigt werden soll.',
},

burghausen: {
  intro: 'In Burghausen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder unnötige Wege.',
  districts: ['Raitenhaslach', 'Lindach', 'Marienberg', 'Mehring', 'Haiming'],
  licensePlates: ['AÖ'],
  painPoint: 'Gerade in Burghausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

burglengenfeld: {
  intro: 'In Burglengenfeld möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Pilsheim', 'Dietldorf', 'Pottenstetten', 'See', 'Mossendorf', 'Lanzenried'],
  licensePlates: ['SAD', 'BUL', 'NAB', 'OVI', 'ROD'],
  painPoint: 'Gerade in Burglengenfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SAD, BUL, NAB, OVI oder ROD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

buxtehude: {
  intro: 'In Buxtehude möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Altkloster', 'Hedendorf', 'Immenbeck', 'Neukloster', 'Ovelgönne', 'Ottensen', 'Daensen'],
  licensePlates: ['STD'],
  painPoint: 'Gerade in Buxtehude kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen STD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

calau: {
  intro: 'In Calau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder unnötige Wege zur Behörde.',
  districts: ['Saßleben', 'Werchow', 'Zinnitz', 'Buckow', 'Mlode', 'Groß Jehser', 'Bolschwitz'],
  licensePlates: ['OSL', 'CA', 'SFB'],
  painPoint: 'Gerade in Calau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OSL, CA oder SFB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

calw: {
  intro: 'In Calw möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Altburg', 'Heumaden', 'Hirsau', 'Stammheim', 'Wimberg', 'Alzenberg', 'Holzbronn'],
  licensePlates: ['CW'],
  painPoint: 'Gerade in Calw kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

'castrop-rauxel': {
  intro: 'In Castrop-Rauxel möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Rauxel', 'Habinghorst', 'Ickern', 'Henrichenburg', 'Merklinde', 'Behringhausen', 'Frohlinde'],
  licensePlates: ['RE', 'CAS'],
  painPoint: 'Gerade in Castrop-Rauxel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RE oder CAS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

celle: {
  intro: 'In Celle möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Altstadt', 'Heese', 'Wietzenbruch', 'Vorwerk', 'Garßen', 'Klein Hehlen', 'Westercelle'],
  licensePlates: ['CE'],
  painPoint: 'Gerade in Celle kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

cham: {
  intro: 'In Cham möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Altenmarkt', 'Chammünster', 'Katzberg', 'Loibling', 'Thierlstein', 'Untertraubenbach', 'Windischbergerdorf'],
  licensePlates: ['CHA', 'KÖZ', 'ROD'],
  painPoint: 'Gerade in Cham kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CHA, KÖZ oder ROD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

chemnitz: {
  intro: 'In Chemnitz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Kaßberg', 'Sonnenberg', 'Schloßchemnitz', 'Bernsdorf', 'Gablenz', 'Altendorf', 'Kappel'],
  licensePlates: ['C'],
  painPoint: 'Gerade in Chemnitz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen C abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'clausthal-zellerfeld': {
  intro: 'In Clausthal-Zellerfeld möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Clausthal', 'Zellerfeld', 'Buntenbock', 'Wildemann', 'Schulenberg im Oberharz', 'Altenau'],
  licensePlates: ['GS', 'CLZ', 'BRL'],
  painPoint: 'Gerade in Clausthal-Zellerfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GS, CLZ oder BRL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf oder Stilllegung.',
},

cloppenburg: {
  intro: 'In Cloppenburg möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Bethen', 'Emstekerfeld', 'Stapelfeld', 'Galgenmoor', 'Ambühren', 'Staatsforsten', 'Vahren'],
  licensePlates: ['CLP'],
  painPoint: 'Gerade in Cloppenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CLP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Wechsel.',
},

coburg: {
  intro: 'In Coburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Ketschendorf', 'Cortendorf', 'Creidlitz', 'Scheuerfeld', 'Neuses', 'Lützelbuch', 'Wüstenahorn'],
  licensePlates: ['CO', 'NEC'],
  painPoint: 'Gerade in Coburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CO oder NEC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

cochem: {
  intro: 'In Cochem möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Sehl', 'Cond', 'Brauheck', 'Dohr', 'Valwig', 'Faid', 'Klotten'],
  licensePlates: ['COC', 'ZEL'],
  painPoint: 'Gerade in Cochem kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen COC oder ZEL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf oder Stilllegung.',
},

'cochem-zell': {
  intro: 'Im Landkreis Cochem-Zell möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötige Behördengänge abmelden.',
  districts: ['Cochem', 'Zell', 'Ulmen', 'Kaisersesch', 'Treis-Karden', 'Ediger-Eller', 'Bremm'],
  licensePlates: ['COC', 'ZEL'],
  painPoint: 'Gerade im Landkreis Cochem-Zell kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen COC oder ZEL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Weg zur Behörde länger ist oder der Vorgang schnell erledigt werden soll.',
},

coesfeld: {
  intro: 'In Coesfeld möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Lette', 'Goxel', 'Harle', 'Flamschen', 'Stevede', 'Sirksfeld', 'Brink'],
  licensePlates: ['COE', 'LH'],
  painPoint: 'Gerade in Coesfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen COE oder LH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

cottbus: {
  intro: 'In Cottbus möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wartezeit oder Behördengang.',
  districts: ['Sandow', 'Ströbitz', 'Sachsendorf', 'Spremberger Vorstadt', 'Schmellwitz', 'Madlow', 'Sielow'],
  licensePlates: ['CB'],
  painPoint: 'Gerade in Cottbus kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

crailsheim: {
  intro: 'In Crailsheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Altenmünster', 'Ingersheim', 'Onolzheim', 'Roßfeld', 'Jagstheim', 'Westgartshausen', 'Goldbach'],
  licensePlates: ['SHA', 'CR'],
  painPoint: 'Gerade in Crailsheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHA oder CR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Wechsel.',
},

cuxhaven: {
  intro: 'In Cuxhaven möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Döse', 'Duhnen', 'Sahlenburg', 'Groden', 'Altenbruch', 'Lüdingworth', 'Stickenbüttel'],
  licensePlates: ['CUX'],
  painPoint: 'Gerade in Cuxhaven kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CUX abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

dachau: {
  intro: 'In Dachau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Altstadt', 'Dachau-Ost', 'Dachau-Süd', 'Etzenhausen', 'Pellheim', 'Mitterndorf', 'Augustenfeld'],
  licensePlates: ['DAH'],
  painPoint: 'Gerade in Dachau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DAH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'dahme-spreewald': {
  intro: 'Im Landkreis Dahme-Spreewald möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Lübben', 'Königs Wusterhausen', 'Luckau', 'Wildau', 'Zeuthen', 'Schönefeld', 'Mittenwalde'],
  licensePlates: ['LDS', 'KW', 'LC', 'LN'],
  painPoint: 'Gerade im Landkreis Dahme-Spreewald kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LDS, KW, LC oder LN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich, wenn der Weg zur Behörde länger ist oder die Abmeldung schnell erledigt werden soll.',
},

'darmstadt-dieburg': {
  intro: 'Im Landkreis Darmstadt-Dieburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Dieburg', 'Weiterstadt', 'Griesheim', 'Pfungstadt', 'Babenhausen', 'Groß-Umstadt', 'Ober-Ramstadt'],
  licensePlates: ['DA', 'DI'],
  painPoint: 'Gerade im Landkreis Darmstadt-Dieburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DA oder DI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

daun: {
  intro: 'In Daun möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Gemünden', 'Neunkirchen', 'Pützborn', 'Rengen', 'Steinborn', 'Waldkönigen', 'Boverath'],
  licensePlates: ['DAU'],
  painPoint: 'Gerade in Daun kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DAU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

deggendorf: {
  intro: 'In Deggendorf möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Fischerdorf', 'Natternberg', 'Seebach', 'Greising', 'Mietraching', 'Rettenbach', 'Mainkofen'],
  licensePlates: ['DEG'],
  painPoint: 'Gerade in Deggendorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DEG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

delitzsch: {
  intro: 'In Delitzsch möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Schenkenberg', 'Döbernitz', 'Laue', 'Benndorf', 'Spröda', 'Poßdorf', 'Beerendorf'],
  licensePlates: ['TDO', 'DZ'],
  painPoint: 'Gerade in Delitzsch kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TDO oder DZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

delmenhorst: {
  intro: 'In Delmenhorst möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Deichhorst', 'Düsternort', 'Hasport', 'Bungerhof', 'Stickgras', 'Brendel', 'Iprump'],
  licensePlates: ['DEL'],
  painPoint: 'Gerade in Delmenhorst kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DEL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

demmin: {
  intro: 'In Demmin möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Vorwerk', 'Deven', 'Wotenick', 'Seedorf', 'Waldberg', 'Meyenkrebs', 'Randow'],
  licensePlates: ['MSE', 'DM'],
  painPoint: 'Gerade in Demmin kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSE oder DM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

denzlingen: {
  intro: 'In Denzlingen möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Unterdorf', 'Oberdorf', 'Heidach', 'Mauracher Berg', 'Stuttgarter Straße', 'Hauptstraße', 'Gewerbegebiet'],
  licensePlates: ['EM'],
  painPoint: 'Gerade in Denzlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

dessau: {
  intro: 'In Dessau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Ziebigk', 'Süd', 'Nord', 'Törten', 'Kochstedt', 'Waldersee'],
  licensePlates: ['DE'],
  painPoint: 'Gerade in Dessau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'dessau-rosslau': {
  intro: 'In Dessau-Roßlau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wartezeit oder Behördengang.',
  districts: ['Dessau', 'Roßlau', 'Ziebigk', 'Kochstedt', 'Waldersee', 'Törten', 'Mildensee'],
  licensePlates: ['DE'],
  painPoint: 'Gerade in Dessau-Roßlau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

detmold: {
  intro: 'In Detmold möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Hiddesen', 'Heidenoldendorf', 'Pivitsheide', 'Remmighausen', 'Spork-Eichholz', 'Jerxen-Orbke'],
  licensePlates: ['LIP', 'DT'],
  painPoint: 'Gerade in Detmold kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LIP oder DT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

dieburg: {
  intro: 'In Dieburg möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Innenstadt', 'Steinweg', 'Nordring', 'Südwest', 'Moret', 'Gewerbegebiet', 'Albinistraße'],
  licensePlates: ['DA', 'DI'],
  painPoint: 'Gerade in Dieburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DA oder DI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

diepholz: {
  intro: 'In Diepholz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Aschen', 'Heede', 'Sankt Hülfe', 'Falkenhardt', 'Moorhäuser', 'Graftlage', 'Spreckel'],
  licensePlates: ['DH'],
  painPoint: 'Gerade in Diepholz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Fahrzeugverkauf oder Stilllegung.',
},

dietzenbach: {
  intro: 'In Dietzenbach möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Altstadt', 'Steinberg', 'Hexenberg', 'Westend', 'Spessartviertel', 'Wingertsberg', 'Neue Stadtmitte'],
  licensePlates: ['OF'],
  painPoint: 'Gerade in Dietzenbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'dillingen-an-der-donau': {
  intro: 'In Dillingen an der Donau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Steinheim', 'Hausen', 'Schretzheim', 'Donaualtheim', 'Fristingen', 'Kicklingen', 'Dillingen Mitte'],
  licensePlates: ['DLG'],
  painPoint: 'Gerade in Dillingen an der Donau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DLG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

dingolfing: {
  intro: 'In Dingolfing möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Teisbach', 'Frauenbiburg', 'Höfen', 'Oberdingolfing', 'Schermau', 'Brunn', 'Mietzing'],
  licensePlates: ['DGF'],
  painPoint: 'Gerade in Dingolfing kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DGF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

dinkelsbuehl: {
  intro: 'In Dinkelsbühl möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wartezeit bei der Behörde.',
  districts: ['Segringen', 'Sinbronn', 'Waldeck', 'Wolfertsbronn', 'Weidelbach', 'Oberradach', 'Hoffeld'],
  licensePlates: ['AN', 'DKB'],
  painPoint: 'Gerade in Dinkelsbühl kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AN oder DKB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

dinslaken: {
  intro: 'In Dinslaken möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Innenstadt', 'Hiesfeld', 'Lohberg', 'Bruch', 'Averbruch', 'Eppinghoven', 'Blumenviertel'],
  licensePlates: ['WES', 'DIN'],
  painPoint: 'Gerade in Dinslaken kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WES oder DIN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

dithmarschen: {
  intro: 'Im Kreis Dithmarschen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Heide', 'Meldorf', 'Brunsbüttel', 'Büsum', 'Marne', 'Albersdorf', 'Wesselburen'],
  licensePlates: ['HEI', 'MED'],
  painPoint: 'Gerade im Kreis Dithmarschen kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HEI oder MED abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Weg zur Behörde länger ist oder der Vorgang schnell erledigt werden soll.',
},

doebeln: {
  intro: 'In Döbeln möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Großbauchlitz', 'Technitz', 'Zschäschütz', 'Ebersbach', 'Masten', 'Gärtitz', 'Bormitz'],
  licensePlates: ['FG', 'DL'],
  painPoint: 'Gerade in Döbeln kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FG oder DL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

donaueschingen: {
  intro: 'In Donaueschingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Aasen', 'Grüningen', 'Heidenhofen', 'Hubertshofen', 'Neudingen', 'Pfohren', 'Wolterdingen'],
  licensePlates: ['VS', 'DS'],
  painPoint: 'Gerade in Donaueschingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VS oder DS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

donauwoerth: {
  intro: 'In Donauwörth möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wartezeit bei der Behörde.',
  districts: ['Berg', 'Auchsesheim', 'Nordheim', 'Riedlingen', 'Zirgesheim', 'Schäfstall', 'Wörnitzstein'],
  licensePlates: ['DON', 'NÖ'],
  painPoint: 'Gerade in Donauwörth kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DON oder NÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

donnersbergkreis: {
  intro: 'Im Donnersbergkreis möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Kirchheimbolanden', 'Rockenhausen', 'Winnweiler', 'Eisenberg', 'Göllheim', 'Alsenz', 'Marnheim'],
  licensePlates: ['KIB', 'ROK'],
  painPoint: 'Gerade im Donnersbergkreis kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KIB oder ROK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich, wenn der Weg zur Behörde länger ist oder die Abmeldung schnell erledigt werden soll.',
},

donzdorf: {
  intro: 'In Donzdorf möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Reichenbach unter Rechberg', 'Winzingen', 'Grünbach', 'Messelberg', 'Donzdorf Mitte', 'Scharrenberg', 'Lautergarten'],
  licensePlates: ['GP'],
  painPoint: 'Gerade in Donzdorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

dormagen: {
  intro: 'In Dormagen möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Nievenheim', 'Zons', 'Horrem', 'Hackenbroich', 'Straberg', 'Delrath', 'Rheinfeld'],
  licensePlates: ['NE', 'GV'],
  painPoint: 'Gerade in Dormagen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NE oder GV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

dornstetten: {
  intro: 'In Dornstetten möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Aach', 'Hallwangen', 'Dornstetten Mitte', 'Lattenberg', 'Bruckwiesen', 'Frutenhof', 'Waldgericht'],
  licensePlates: ['FDS', 'HOR'],
  painPoint: 'Gerade in Dornstetten kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FDS oder HOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

dortmund: {
  intro: 'In Dortmund nutzen viele Fahrzeughalter den digitalen Weg, wenn die Auto-Abmeldung schnell und ohne Termin vorbereitet werden soll.',
  districts: ['Hörde', 'Aplerbeck', 'Hombruch', 'Eving', 'Brackel', 'Mengede', 'Innenstadt'],
  licensePlates: ['DO'],
  painPoint: 'Gerade in Dortmund kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Für Nutzer aus Hörde, Aplerbeck, Hombruch, Eving, Brackel, Mengede oder der Innenstadt ist die Online-Abmeldung oft besonders bequem.',
},

'dresden-kfz-zulassungsstelle': {
  intro: 'In Dresden möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit bei der Zulassungsstelle.',
  districts: ['Altstadt', 'Neustadt', 'Löbtau', 'Pieschen', 'Blasewitz', 'Klotzsche', 'Cotta'],
  licensePlates: ['DD'],
  painPoint: 'Gerade in Dresden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

duderstadt: {
  intro: 'In Duderstadt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Gerblingerode', 'Tiftlingerode', 'Westerode', 'Mingerode', 'Breitenberg', 'Esplingerode', 'Nesselröden'],
  licensePlates: ['GÖ', 'DUD'],
  painPoint: 'Gerade in Duderstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GÖ oder DUD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

duisburg: {
  intro: 'In Duisburg möchten viele Fahrzeughalter ihre Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Hamborn', 'Meiderich', 'Rheinhausen', 'Walsum', 'Homberg', 'Neudorf', 'Duisburg-Mitte'],
  licensePlates: ['DU'],
  painPoint: 'Gerade in Duisburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Ob Hamborn, Meiderich, Rheinhausen, Walsum, Homberg, Neudorf oder Duisburg-Mitte – der digitale Weg ist für viele Nutzer angenehm einfach.',
},

duelmen: {
  intro: 'In Dülmen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Buldern', 'Hausdülmen', 'Hiddingsel', 'Merfeld', 'Rorup', 'Kirchspiel', 'Mitte'],
  licensePlates: ['COE', 'LH'],
  painPoint: 'Gerade in Dülmen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen COE oder LH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

dueren: {
  intro: 'In Düren möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Birkesdorf', 'Gürzenich', 'Mariaweiler', 'Arnoldsweiler', 'Derichsweiler', 'Lendersdorf', 'Merken'],
  licensePlates: ['DN', 'JÜL'],
  painPoint: 'Gerade in Düren kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DN oder JÜL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

duesseldorf: {
  intro: 'In Düsseldorf ist die Online-Abmeldung für viele Nutzer eine einfache Möglichkeit, Zeit zu sparen und den Vorgang digital vorzubereiten.',
  districts: ['Bilk', 'Oberkassel', 'Eller', 'Benrath', 'Pempelfort', 'Derendorf', 'Flingern'],
  licensePlates: ['D'],
  painPoint: 'Gerade in Düsseldorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen D abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Ob Bilk, Oberkassel, Eller, Benrath, Pempelfort, Derendorf oder Flingern – der digitale Weg kann bequem von zu Hause gestartet werden.',
},

ebermannstadt: {
  intro: 'In Ebermannstadt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Innenstadt', 'Breitenbach', 'Burggaillenreuth', 'Gasseldorf', 'Niedermirsberg', 'Rüssenbach', 'Wohlmuthshüll'],
  licensePlates: ['FO', 'EBS'],
  painPoint: 'Gerade in Ebermannstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FO oder EBS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

ebern: {
  intro: 'In Ebern möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Ebern Mitte', 'Eyrichshof', 'Heubach', 'Reutersbrunn', 'Unterpreppach', 'Vorbach', 'Jesserndorf'],
  licensePlates: ['HAS', 'EBN'],
  painPoint: 'Gerade in Ebern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HAS oder EBN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

ebersbach: {
  intro: 'In Ebersbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Bünzwangen', 'Krapfenreut', 'Roßwälden', 'Sulpach', 'Weiler', 'Büchenbronn'],
  licensePlates: ['GP'],
  painPoint: 'Gerade in Ebersbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

ebersberg: {
  intro: 'In Ebersberg möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Ebersberg Mitte', 'Oberndorf', 'Neuhausen', 'Egglburger See', 'Vorderegglburg', 'Hinteregglburg', 'Aßlkofen'],
  licensePlates: ['EBE'],
  painPoint: 'Gerade in Ebersberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EBE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

eberswalde: {
  intro: 'In Eberswalde möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Finow', 'Westend', 'Brandenburgisches Viertel', 'Nordend', 'Ostend', 'Sommerfelde', 'Tornow'],
  licensePlates: ['BAR', 'EW'],
  painPoint: 'Gerade in Eberswalde kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BAR oder EW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders bequem bei Fahrzeugverkauf oder Stilllegung.',
},

echterdingen: {
  intro: 'In Echterdingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Echterdingen Mitte', 'Stetten', 'Leinfelden', 'Musberg', 'Oberaichen', 'Unteraichen', 'Weidach'],
  licensePlates: ['ES'],
  painPoint: 'Gerade in Echterdingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

eckernfoerde: {
  intro: 'In Eckernförde möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Borby', 'Carlshöhe', 'Grasholz', 'Louisenberg', 'Püschenwinkel', 'Wilhelmstal', 'Innenstadt'],
  licensePlates: ['RD', 'ECK'],
  painPoint: 'Gerade in Eckernförde kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RD oder ECK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

efringen: {
  intro: 'In Efringen möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Efringen', 'Kirchen', 'Blansingen', 'Egringen', 'Huttingen', 'Istein', 'Kleinkems'],
  licensePlates: ['LÖ'],
  painPoint: 'Gerade in Efringen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

eggenstein: {
  intro: 'In Eggenstein möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Eggenstein', 'Leopoldshafen', 'Schröcker Tor', 'Neureuter Straße', 'Gewerbegebiet', 'Hardtwaldsiedlung', 'Ortsmitte'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Eggenstein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

ehingen: {
  intro: 'In Ehingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Berg', 'Dettingen', 'Dächingen', 'Erbstetten', 'Frankenhofen', 'Kirchbierlingen', 'Altsteußlingen'],
  licensePlates: ['UL', 'EHI'],
  painPoint: 'Gerade in Ehingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UL oder EHI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

ehrenkirchen: {
  intro: 'In Ehrenkirchen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Kirchhofen', 'Ehrenstetten', 'Norsingen', 'Offnadingen', 'Scherzingen', 'Ortsmitte', 'Batzenberg'],
  licensePlates: ['FR'],
  painPoint: 'Gerade in Ehrenkirchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

eichsfeld: {
  intro: 'Im Landkreis Eichsfeld möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Heilbad Heiligenstadt', 'Leinefelde-Worbis', 'Dingelstädt', 'Teistungen', 'Uder', 'Niederorschel', 'Arenshausen'],
  licensePlates: ['EIC', 'HIG', 'WBS'],
  painPoint: 'Gerade im Landkreis Eichsfeld kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EIC, HIG oder WBS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich, wenn der Weg zur Behörde länger ist oder der Vorgang schnell erledigt werden soll.',
},

eichstaett: {
  intro: 'In Eichstätt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Wasserzell', 'Marienstein', 'Landershofen', 'Wintershof', 'Rebdorf', 'Blumenberg'],
  licensePlates: ['EI'],
  painPoint: 'Gerade in Eichstätt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'eifelkreis-bitburg-pruem': {
  intro: 'Im Eifelkreis Bitburg-Prüm möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Bitburg', 'Prüm', 'Speicher', 'Kyllburg', 'Neuerburg', 'Irrel', 'Arzfeld'],
  licensePlates: ['BIT', 'PRÜ'],
  painPoint: 'Gerade im Eifelkreis Bitburg-Prüm kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BIT oder PRÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Weg zur Behörde länger ist oder das Fahrzeug schnell abgemeldet werden soll.',
},

eilenburg: {
  intro: 'In Eilenburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Eilenburg Mitte', 'Eilenburg-Ost', 'Eilenburg-Berg', 'Hainichen', 'Kospa', 'Wedelwitz', 'Behlitz'],
  licensePlates: ['TDO', 'DZ', 'EB'],
  painPoint: 'Gerade in Eilenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TDO, DZ oder EB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

einbeck: {
  intro: 'In Einbeck möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Innenstadt', 'Kreiensen', 'Greene', 'Salzderhelden', 'Vogelbeck', 'Hullersen', 'Stroit'],
  licensePlates: ['NOM', 'EIN', 'GAN'],
  painPoint: 'Gerade in Einbeck kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NOM, EIN oder GAN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

eisenach: {
  intro: 'In Eisenach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Innenstadt', 'Stregda', 'Hötzelsroda', 'Neuenhof', 'Wartha', 'Stockhausen', 'Stedtfeld'],
  licensePlates: ['EA', 'WAK'],
  painPoint: 'Gerade in Eisenach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EA oder WAK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

eisenberg: {
  intro: 'In Eisenberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Friedrichstanneck', 'Saasa', 'Königshofen', 'Gösen', 'Hainspitz', 'Crossen'],
  licensePlates: ['SHK', 'EIS'],
  painPoint: 'Gerade in Eisenberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHK oder EIS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

eisenhuettenstadt: {
  intro: 'In Eisenhüttenstadt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Fürstenberg', 'Schönfließ', 'Diehlo', 'Neuzelle', 'Vogelsang', 'Lawitz'],
  licensePlates: ['LOS', 'EH', 'BSK'],
  painPoint: 'Gerade in Eisenhüttenstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LOS, EH oder BSK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

eisleben: {
  intro: 'In Eisleben möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Helfta', 'Volkstedt', 'Osterhausen', 'Rothenschirmbach', 'Bischofrode', 'Wolferode', 'Unterrißdorf'],
  licensePlates: ['MSH', 'EIL', 'ML'],
  painPoint: 'Gerade in Eisleben kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSH, EIL oder ML abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'elbe-elster': {
  intro: 'Im Landkreis Elbe-Elster möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Finsterwalde', 'Elsterwerda', 'Bad Liebenwerda', 'Herzberg', 'Doberlug-Kirchhain', 'Mühlberg', 'Falkenberg'],
  licensePlates: ['EE', 'FI', 'LIB'],
  painPoint: 'Gerade im Landkreis Elbe-Elster kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EE, FI oder LIB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Weg zur Behörde länger ist oder der Vorgang schnell erledigt werden soll.',
},

elmshorn: {
  intro: 'In Elmshorn möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Hainholz', 'Klostersande', 'Langelohe', 'Sibirien', 'Ramskamp', 'Kölln-Reisiek'],
  licensePlates: ['PI'],
  painPoint: 'Gerade in Elmshorn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

emden: {
  intro: 'In Emden möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Innenstadt', 'Borssum', 'Constantia', 'Larrelt', 'Port Arthur', 'Wolthusen', 'Harsweg'],
  licensePlates: ['EMD'],
  painPoint: 'Gerade in Emden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EMD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

emmendingen: {
  intro: 'In Emmendingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Kollmarsreute', 'Maleck', 'Mundingen', 'Wasser', 'Windenreute', 'Bürkle-Bleiche'],
  licensePlates: ['EM'],
  painPoint: 'Gerade in Emmendingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

emsland: {
  intro: 'Im Landkreis Emsland möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Meppen', 'Lingen', 'Papenburg', 'Haren', 'Haselünne', 'Sögel', 'Freren'],
  licensePlates: ['EL', 'MEP', 'LIN', 'ASD'],
  painPoint: 'Gerade im Emsland kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EL, MEP, LIN oder ASD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich, wenn der Weg zur Behörde länger ist oder der Vorgang schnell erledigt werden soll.',
},

'endingen-am-kaiserstuhl': {
  intro: 'In Endingen am Kaiserstuhl möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Endingen', 'Amoltern', 'Kiechlinsbergen', 'Königschaffhausen', 'Siedlung', 'Stadtmitte', 'Kaiserstuhlrand'],
  licensePlates: ['EM'],
  painPoint: 'Gerade in Endingen am Kaiserstuhl kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ennepe-ruhr-kreis': {
  intro: 'Im Ennepe-Ruhr-Kreis möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Schwelm', 'Witten', 'Hattingen', 'Gevelsberg', 'Ennepetal', 'Herdecke', 'Sprockhövel'],
  licensePlates: ['EN', 'WIT'],
  painPoint: 'Gerade im Ennepe-Ruhr-Kreis kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EN oder WIT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

enzkreis: {
  intro: 'Im Enzkreis möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Mühlacker', 'Königsbach-Stein', 'Remchingen', 'Neuenbürg', 'Niefern-Öschelbronn', 'Keltern', 'Ispringen'],
  licensePlates: ['PF', 'MÜH'],
  painPoint: 'Gerade im Enzkreis kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PF oder MÜH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Weg zur Behörde länger ist oder der Vorgang schnell erledigt werden soll.',
},

eppingen: {
  intro: 'In Eppingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Adelshofen', 'Elsenz', 'Kleingartach', 'Mühlbach', 'Rohrbach', 'Richen', 'Eppingen Mitte'],
  licensePlates: ['HN', 'EPP'],
  painPoint: 'Gerade in Eppingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN oder EPP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

erbach: {
  intro: 'In Erbach möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Erbach Mitte', 'Bullau', 'Dorf-Erbach', 'Ebersberg', 'Elsbach', 'Erlenbach', 'Günterfürst'],
  licensePlates: ['ERB', 'MIC'],
  painPoint: 'Gerade in Erbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ERB oder MIC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

erding: {
  intro: 'In Erding möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Altenerding', 'Klettham', 'Langengeisling', 'Pretzen', 'Aufhausen', 'Bergham', 'Indorf'],
  licensePlates: ['ED'],
  painPoint: 'Gerade in Erding kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ED abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

erkelenz: {
  intro: 'In Erkelenz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Gerderath', 'Kückhoven', 'Keyenberg', 'Holzweiler', 'Lövenich', 'Venrath', 'Schwanenberg'],
  licensePlates: ['HS', 'ERK', 'GK'],
  painPoint: 'Gerade in Erkelenz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HS, ERK oder GK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

erlangen: {
  intro: 'In Erlangen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Büchenbach', 'Bruck', 'Eltersdorf', 'Tennenlohe', 'Alterlangen', 'Sieglitzhof'],
  licensePlates: ['ER'],
  painPoint: 'Gerade in Erlangen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ER abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

eschwege: {
  intro: 'In Eschwege möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Niederhone', 'Oberhone', 'Eltmannshausen', 'Niddawitzhausen', 'Albungen', 'Niederdünzebach', 'Oberdünzebach'],
  licensePlates: ['ESW', 'WIZ'],
  painPoint: 'Gerade in Eschwege kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ESW oder WIZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'eschwege-witzenhausen': {
  intro: 'Im Bereich Eschwege-Witzenhausen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Eschwege', 'Witzenhausen', 'Bad Sooden-Allendorf', 'Meinhard', 'Wehretal', 'Wanfried', 'Berkatal'],
  licensePlates: ['ESW', 'WIZ'],
  painPoint: 'Gerade im Bereich Eschwege-Witzenhausen kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ESW oder WIZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch, wenn der Weg zur Behörde länger ist oder der Vorgang schnell erledigt werden soll.',
},

essen: {
  intro: 'In Essen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Rüttenscheid', 'Altenessen', 'Borbeck', 'Steele', 'Frohnhausen', 'Kray', 'Katernberg'],
  licensePlates: ['E'],
  painPoint: 'Gerade in Essen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Essener Kennzeichen E abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Gerade bei Fahrzeugverkauf, Stilllegung oder Wechsel des Fahrzeugs hilft ein klarer digitaler Ablauf ohne zusätzlichen Termin.',
},

'esslingen-am-neckar': {
  intro: 'In Esslingen am Neckar möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Berkheim', 'Oberesslingen', 'Mettingen', 'Zell', 'Sulzgries', 'Wäldenbronn'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade in Esslingen am Neckar kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

ettlingen: {
  intro: 'In Ettlingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Bruchhausen', 'Ettlingenweier', 'Oberweier', 'Schluttenbach', 'Schöllbronn', 'Spessart', 'Kernstadt'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Ettlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

euskirchen: {
  intro: 'In Euskirchen möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Innenstadt', 'Kuchenheim', 'Stotzheim', 'Billig', 'Flamersheim', 'Kirchheim', 'Roitzheim'],
  licensePlates: ['EU', 'SLE'],
  painPoint: 'Gerade in Euskirchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EU oder SLE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

eutin: {
  intro: 'In Eutin möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Fissau', 'Neudorf', 'Sibbersdorf', 'Sielbeck', 'Sandfeld', 'Am Kleinen Eutiner See'],
  licensePlates: ['OH'],
  painPoint: 'Gerade in Eutin kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

falkensee: {
  intro: 'In Falkensee möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Falkensee Mitte', 'Finkenkrug', 'Seegefeld', 'Waldheim', 'Falkenhagen', 'Neufinkenkrug', 'Albrechtshof'],
  licensePlates: ['HVL', 'NAU', 'RN'],
  painPoint: 'Gerade in Falkensee kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HVL, NAU oder RN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

farchant: {
  intro: 'In Farchant möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Farchant Mitte', 'Mühldörfl', 'Unterfeld', 'Föhrenheide', 'Reschberg', 'Am Gern', 'Loisachtal'],
  licensePlates: ['GAP'],
  painPoint: 'Gerade in Farchant kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GAP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

feuchtwangen: {
  intro: 'In Feuchtwangen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Breitenau', 'Dorfgütingen', 'Krapfenau', 'Mosbach', 'Vorderbreitenthann', 'Wehlmäusel'],
  licensePlates: ['AN', 'DKB', 'FEU', 'ROT'],
  painPoint: 'Gerade in Feuchtwangen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AN, DKB, FEU oder ROT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

filderstadt: {
  intro: 'In Filderstadt möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Bernhausen', 'Bonlanden', 'Harthausen', 'Plattenhardt', 'Sielmingen', 'Filderstadt Mitte', 'Filderklinik'],
  licensePlates: ['ES'],
  painPoint: 'Gerade in Filderstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

finsterwalde: {
  intro: 'In Finsterwalde möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Nehesdorf', 'Massen', 'Pechhütte', 'Sorno', 'Langer Damm', 'Südpassage'],
  licensePlates: ['EE', 'FI', 'LIB'],
  painPoint: 'Gerade in Finsterwalde kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EE, FI oder LIB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

flensburg: {
  intro: 'In Flensburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Altstadt', 'Mürwik', 'Jürgensby', 'Weiche', 'Engelsby', 'Friesischer Berg', 'Südstadt'],
  licensePlates: ['FL'],
  painPoint: 'Gerade in Flensburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

forchheim: {
  intro: 'In Forchheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne Termin und ohne lange Wartezeit.',
  districts: ['Innenstadt', 'Burk', 'Buckenhofen', 'Reuth', 'Kersbach', 'Serlbach', 'Buckenhofener Siedlung'],
  licensePlates: ['FO', 'EBS', 'PEG'],
  painPoint: 'Gerade in Forchheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FO, EBS oder PEG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

forst: {
  intro: 'In Forst möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Forst Mitte', 'Keune', 'Noßdorf', 'Sacrow', 'Bohrau', 'Eulo', 'Klein Jamno'],
  licensePlates: ['SPN', 'FOR', 'GUB', 'SPB'],
  painPoint: 'Gerade in Forst kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SPN, FOR, GUB oder SPB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

frankenberg: {
  intro: 'In Frankenberg möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Innenstadt', 'Ederbringhausen', 'Friedrichshausen', 'Geismar', 'Haubern', 'Hommerhausen', 'Röddenau'],
  licensePlates: ['KB', 'FKB', 'WA'],
  painPoint: 'Gerade in Frankenberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KB, FKB oder WA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

frankenthal: {
  intro: 'In Frankenthal möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Eppstein', 'Flomersheim', 'Mörsch', 'Studernheim', 'Lauterecken', 'Jakobsplatz'],
  licensePlates: ['FT'],
  painPoint: 'Gerade in Frankenthal kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'frankenthal-pfalz': {
  intro: 'In Frankenthal (Pfalz) möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Eppstein', 'Flomersheim', 'Mörsch', 'Studernheim', 'Nordend', 'Südend'],
  licensePlates: ['FT'],
  painPoint: 'Gerade in Frankenthal (Pfalz) kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

frankfurt: {
  intro: 'In Frankfurt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Sachsenhausen', 'Bornheim', 'Bockenheim', 'Höchst', 'Gallus', 'Nordend'],
  licensePlates: ['F'],
  painPoint: 'Gerade in Frankfurt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Frankfurter Kennzeichen F abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Gerade bei Fahrzeugverkauf, Stilllegung oder Wechsel des Fahrzeugs hilft ein klarer digitaler Ablauf ohne zusätzlichen Termin.',
},

'frankfurt-oder': {
  intro: 'In Frankfurt (Oder) möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Innenstadt', 'Berliner Vorstadt', 'Neuberesinchen', 'Altberesinchen', 'Hansa Nord', 'Hansa Süd', 'Markendorf'],
  licensePlates: ['FF'],
  painPoint: 'Gerade in Frankfurt (Oder) kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'frankfurt-am-main': {
  intro: 'In Frankfurt am Main ist die Online-Abmeldung besonders hilfreich, wenn der Alltag wenig Zeit für Behördentermine lässt.',
  districts: ['Sachsenhausen', 'Bornheim', 'Bockenheim', 'Höchst', 'Gallus', 'Nordend', 'Innenstadt'],
  licensePlates: ['F'],
  painPoint: 'Gerade in Frankfurt am Main kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Frankfurter Kennzeichen F abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Ob Sachsenhausen, Bornheim, Bockenheim, Höchst, Gallus, Nordend oder Innenstadt – viele Nutzer bevorzugen den digitalen Weg.',
},

freiberg: {
  intro: 'In Freiberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Friedeburg', 'Zug', 'Halsbach', 'Kleinwaltersdorf', 'Lossnitz', 'Südvorstadt'],
  licensePlates: ['FG', 'BED', 'DL', 'FLÖ', 'HC', 'MW'],
  painPoint: 'Gerade in Freiberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FG, BED, DL, FLÖ, HC oder MW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

freiburg: {
  intro: 'In Freiburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder unnötige Wege.',
  districts: ['Altstadt', 'Wiehre', 'Stühlinger', 'Herdern', 'Zähringen', 'Haslach', 'Littenweiler'],
  licensePlates: ['FR'],
  painPoint: 'Gerade in Freiburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'freiburg-breisgau': {
  intro: 'In Freiburg im Breisgau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen.',
  districts: ['Altstadt', 'Wiehre', 'Stühlinger', 'Herdern', 'Zähringen', 'Haslach', 'Littenweiler'],
  licensePlates: ['FR'],
  painPoint: 'Gerade in Freiburg im Breisgau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

freising: {
  intro: 'In Freising möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Innenstadt', 'Lerchenfeld', 'Vötting', 'Neustift', 'Tuching', 'Attaching', 'Pulling'],
  licensePlates: ['FS'],
  painPoint: 'Gerade in Freising kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

freital: {
  intro: 'In Freital möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Döhlen', 'Deuben', 'Potschappel', 'Hainsberg', 'Zauckerode', 'Burgk', 'Wurgwitz'],
  licensePlates: ['PIR', 'DW', 'FTL', 'SEB'],
  painPoint: 'Gerade in Freital kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PIR, DW, FTL oder SEB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

freudenstadt: {
  intro: 'In Freudenstadt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Dietersweiler', 'Grüntal', 'Igelsberg', 'Kniebis', 'Musbach', 'Wittlensweiler'],
  licensePlates: ['FDS', 'HOR', 'WOL'],
  painPoint: 'Gerade in Freudenstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FDS, HOR oder WOL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

freyung: {
  intro: 'In Freyung möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Freyung Mitte', 'Kreuzberg', 'Ort', 'Perlesöd', 'Solla', 'Winkelbrunn', 'Ahornöd'],
  licensePlates: ['FRG', 'GRA', 'WOS'],
  painPoint: 'Gerade in Freyung kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FRG, GRA oder WOS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

frickenhausen: {
  intro: 'In Frickenhausen möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Frickenhausen', 'Linsenhofen', 'Tischardt', 'Ortsmitte', 'Im Käppele', 'Tälesbahngebiet', 'Steinach'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade in Frickenhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

friedberg: {
  intro: 'In Friedberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Dorheim', 'Ockstadt', 'Ossenheim', 'Bauernheim', 'Bruchenbrücken', 'Fauerbach'],
  licensePlates: ['FB', 'BÜD'],
  painPoint: 'Gerade in Friedberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FB oder BÜD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

friedrichshafen: {
  intro: 'In Friedrichshafen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Ailingen', 'Ettenkirch', 'Kluftern', 'Raderach', 'Fischbach', 'Manzell'],
  licensePlates: ['FN', 'TT'],
  painPoint: 'Gerade in Friedrichshafen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FN oder TT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

friesland: {
  intro: 'Im Landkreis Friesland möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Jever', 'Varel', 'Schortens', 'Sande', 'Zetel', 'Bockhorn', 'Wangerland'],
  licensePlates: ['FRI'],
  painPoint: 'Gerade im Landkreis Friesland kosten Anfahrt, Termin und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FRI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn der Weg zur Behörde länger ist oder das Fahrzeug schnell abgemeldet werden soll.',
},

fritzlar: {
  intro: 'In Fritzlar möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Innenstadt', 'Geismar', 'Züschen', 'Ungedanken', 'Obermöllrich', 'Wehren', 'Cappel'],
  licensePlates: ['HR', 'FZ', 'MEG', 'ZIG'],
  painPoint: 'Gerade in Fritzlar kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HR, FZ, MEG oder ZIG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

fulda: {
  intro: 'In Fulda möchten viele Fahrzeughalter ihr Auto schnell und ohne unnötigen Behördengang abmelden.',
  districts: ['Innenstadt', 'Bronnzell', 'Horas', 'Lehnerz', 'Kämmerzell', 'Maberzell', 'Ziehers-Nord'],
  licensePlates: ['FD'],
  painPoint: 'Gerade in Fulda kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

fuerstenau: {
  intro: 'In Fürstenau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Fürstenau Mitte', 'Hollenstede', 'Settrup', 'Schwagstorf', 'Hollenhorst', 'Lütkeberge', 'Lonnerbecke'],
  licensePlates: ['OS', 'BSB', 'MEL', 'WTL'],
  painPoint: 'Gerade in Fürstenau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OS, BSB, MEL oder WTL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

fuerstenfeldbruck: {
  intro: 'In Fürstenfeldbruck möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Buchenau', 'Hasenheide', 'Puch', 'Lindach', 'Aich', 'Gelbenholzen'],
  licensePlates: ['FFB'],
  painPoint: 'Gerade in Fürstenfeldbruck kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FFB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

fuerstenwalde: {
  intro: 'In Fürstenwalde möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Mitte', 'Nord', 'Süd', 'Trebus', 'Ketschendorf', 'Spreevorstadt', 'Heideland'],
  licensePlates: ['LOS', 'BSK', 'EH', 'FW'],
  painPoint: 'Gerade in Fürstenwalde kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LOS, BSK, EH oder FW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

fuerth: {
  intro: 'In Fürth möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Südstadt', 'Hardhöhe', 'Stadeln', 'Burgfarrnbach', 'Vach', 'Ronhof'],
  licensePlates: ['FÜ'],
  painPoint: 'Gerade in Fürth kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

fuessen: {
  intro: 'In Füssen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Bad Faulenbach', 'Hopfen am See', 'Weißensee', 'Ziegelwies', 'Eschach', 'Erkenbollingen'],
  licensePlates: ['OAL', 'FÜS', 'MOD'],
  painPoint: 'Gerade in Füssen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OAL, FÜS oder MOD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

gadebusch: {
  intro: 'In Gadebusch möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Gadebusch Mitte', 'Reinhardtsdorf', 'Möllin', 'Buchholz', 'Ganzow', 'Radegast', 'Wakenstädt'],
  licensePlates: ['NWM', 'GDB', 'GVM', 'WIS'],
  painPoint: 'Gerade in Gadebusch kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NWM, GDB, GVM oder WIS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

gaggenau: {
  intro: 'In Gaggenau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Ottenau', 'Bad Rotenfels', 'Michelbach', 'Selbach', 'Sulzbach', 'Hörden'],
  licensePlates: ['RA', 'BH'],
  painPoint: 'Gerade in Gaggenau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RA oder BH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gardelegen: {
  intro: 'In Gardelegen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Mieste', 'Letzlingen', 'Jävenitz', 'Solpke', 'Zichtau', 'Estedt'],
  licensePlates: ['SAW', 'GA', 'KLZ'],
  painPoint: 'Gerade in Gardelegen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SAW, GA oder KLZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'garmisch-partenkirchen': {
  intro: 'In Garmisch-Partenkirchen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Garmisch', 'Partenkirchen', 'Burgrain', 'Griesen', 'Hammersbach', 'Schlattan', 'Wamberg'],
  licensePlates: ['GAP'],
  painPoint: 'Gerade in Garmisch-Partenkirchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GAP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

geislingen: {
  intro: 'In Geislingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Geislingen Mitte', 'Altenstadt', 'Eybach', 'Stötten', 'Türkheim', 'Waldhausen', 'Weiler ob Helfenstein'],
  licensePlates: ['GP'],
  painPoint: 'Gerade in Geislingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'geislingen-an-der-steige': {
  intro: 'In Geislingen an der Steige möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Altenstadt', 'Eybach', 'Stötten', 'Türkheim', 'Waldhausen', 'Weiler ob Helfenstein', 'Aufhausen'],
  licensePlates: ['GP'],
  painPoint: 'Gerade in Geislingen an der Steige kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

geithain: {
  intro: 'In Geithain möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne Termin und ohne lange Wartezeit.',
  districts: ['Innenstadt', 'Nauenhain', 'Niedergräfenhain', 'Syhra', 'Theusdorf', 'Wickershain', 'Bruchheim'],
  licensePlates: ['L', 'BNA', 'GHA', 'GRM', 'MTL', 'WUR'],
  painPoint: 'Gerade in Geithain kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen L, BNA, GHA, GRM, MTL oder WUR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

geldern: {
  intro: 'In Geldern möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Kapellen', 'Pont', 'Veert', 'Walbeck', 'Hartefeld', 'Lüllingen'],
  licensePlates: ['KLE', 'GEL'],
  painPoint: 'Gerade in Geldern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KLE oder GEL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gelsenkirchen: {
  intro: 'In Gelsenkirchen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Buer', 'Schalke', 'Erle', 'Horst', 'Ückendorf', 'Resse', 'Rotthausen'],
  licensePlates: ['GE'],
  painPoint: 'Gerade in Gelsenkirchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Gerade bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel hilft ein klarer digitaler Ablauf ohne zusätzlichen Termin.',
},

georgsmarienhuette: {
  intro: 'In Georgsmarienhütte möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Alt-Georgsmarienhütte', 'Harderberg', 'Holsten-Mündrup', 'Kloster Oesede', 'Oesede', 'Dröper', 'Malbergen'],
  licensePlates: ['OS', 'BSB', 'MEL', 'WTL'],
  painPoint: 'Gerade in Georgsmarienhütte kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OS, BSB, MEL oder WTL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

gera: {
  intro: 'In Gera möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder lange Wartezeiten.',
  districts: ['Innenstadt', 'Debschwitz', 'Lusan', 'Bieblach', 'Zwötzen', 'Untermhaus', 'Leumnitz'],
  licensePlates: ['G'],
  painPoint: 'Gerade in Gera kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen G abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gerlingen: {
  intro: 'In Gerlingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Gerlingen Mitte', 'Gehenbühl', 'Schillerhöhe', 'Bopser', 'Siedlung', 'Bruhweg', 'Breitwiesen'],
  licensePlates: ['LB', 'VAI'],
  painPoint: 'Gerade in Gerlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LB oder VAI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

germersheim: {
  intro: 'In Germersheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Sondernheim', 'Germersheim Süd', 'Germersheim Nord', 'Rheinvorland', 'Germersheim West', 'Germersheim Ost'],
  licensePlates: ['GER'],
  painPoint: 'Gerade in Germersheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GER abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gerolstein: {
  intro: 'In Gerolstein möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Gerolstein Mitte', 'Büscheich', 'Lissingen', 'Müllenborn', 'Oos', 'Roth', 'Sarresdorf'],
  licensePlates: ['DAU', 'PRÜ'],
  painPoint: 'Gerade in Gerolstein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DAU oder PRÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

gerstetten: {
  intro: 'In Gerstetten möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötigen Behördengang.',
  districts: ['Gerstetten', 'Dettingen am Albuch', 'Gussenstadt', 'Heuchlingen', 'Heldenfingen', 'Sontbergen', 'Heuchstetten'],
  licensePlates: ['HDH'],
  painPoint: 'Gerade in Gerstetten kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HDH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gersthofen: {
  intro: 'In Gersthofen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Gersthofen Mitte', 'Hirblingen', 'Batzenhofen', 'Edenbergen', 'Rettenbergen', 'Peterhof', 'Stiftersiedlung'],
  licensePlates: ['A'],
  painPoint: 'Gerade in Gersthofen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen A abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'giengen-an-der-brenz': {
  intro: 'In Giengen an der Brenz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Burgberg', 'Hohenmemmingen', 'Hürben', 'Sachsenhausen', 'Lederstraße', 'Brenzgebiet'],
  licensePlates: ['HDH'],
  painPoint: 'Gerade in Giengen an der Brenz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HDH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

giessen: {
  intro: 'In Gießen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Wieseck', 'Kleinlinden', 'Allendorf', 'Rödgen', 'Lützellinden', 'Schiffenberg'],
  licensePlates: ['GI'],
  painPoint: 'Gerade in Gießen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gifhorn: {
  intro: 'In Gifhorn möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Gamsen', 'Kästorf', 'Wilsche', 'Neubokel', 'Winkel', 'Lehmweg'],
  licensePlates: ['GF'],
  painPoint: 'Gerade in Gifhorn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

glauchau: {
  intro: 'In Glauchau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Gesau', 'Jerchwitz', 'Niederlungwitz', 'Reinholdshain', 'Rothenbach', 'Wernsdorf'],
  licensePlates: ['Z', 'GC', 'HOT', 'WDA'],
  painPoint: 'Gerade in Glauchau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen Z, GC, HOT oder WDA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'goeppingen-suessen': {
  intro: 'In Göppingen und Süßen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Göppingen Mitte', 'Faurndau', 'Jebenhausen', 'Hohenstaufen', 'Bartenbach', 'Süßen Mitte', 'Salach'],
  licensePlates: ['GP'],
  painPoint: 'Gerade in Göppingen und Süßen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

goerlitz: {
  intro: 'In Görlitz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Nikolaivorstadt', 'Rauschwalde', 'Weinhübel', 'Königshufen', 'Biesnitz', 'Tauchritz'],
  licensePlates: ['GR', 'LÖB', 'NOL', 'NY', 'WSW', 'ZI'],
  painPoint: 'Gerade in Görlitz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GR, LÖB, NOL, NY, WSW oder ZI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

goslar: {
  intro: 'In Goslar möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Altstadt', 'Oker', 'Jürgenohl', 'Hahndorf', 'Vienenburg', 'Ohlhof', 'Georgenberg'],
  licensePlates: ['GS', 'BRL', 'CLZ'],
  painPoint: 'Gerade in Goslar kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GS, BRL oder CLZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gotha: {
  intro: 'In Gotha möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Innenstadt', 'Sundhausen', 'Siebleben', 'Boilstädt', 'Uelleben', 'Kindleben', 'Gotha West'],
  licensePlates: ['GTH'],
  painPoint: 'Gerade in Gotha kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GTH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'graben-neudorf': {
  intro: 'In Graben-Neudorf möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Graben', 'Neudorf', 'Graben Mitte', 'Neudorf Mitte', 'Bahnhofsgebiet', 'Siedlung', 'Gewerbegebiet'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Graben-Neudorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

grafenau: {
  intro: 'In Grafenau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Grafenau Mitte', 'Bärnstein', 'Großarmschlag', 'Neudorf', 'Rosenau', 'Schlag', 'Lichteneck'],
  licensePlates: ['FRG', 'GRA', 'WOS'],
  painPoint: 'Gerade in Grafenau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FRG, GRA oder WOS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

graefenhainichen: {
  intro: 'In Gräfenhainichen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Jüdenberg', 'Möhlau', 'Schköna', 'Tornau', 'Zschornewitz', 'Mescheide'],
  licensePlates: ['WB', 'GHC', 'JE'],
  painPoint: 'Gerade in Gräfenhainichen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WB, GHC oder JE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gransee: {
  intro: 'In Gransee möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Gransee Mitte', 'Altlüdersdorf', 'Dannenwalde', 'Gramzow', 'Neulögow', 'Meseberg', 'Wendefeld'],
  licensePlates: ['OHV'],
  painPoint: 'Gerade in Gransee kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OHV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

greifswald: {
  intro: 'In Greifswald möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten bei der Behörde.',
  districts: ['Innenstadt', 'Schönwalde I', 'Schönwalde II', 'Eldena', 'Wieck', 'Ladebow', 'Fettenvorstadt'],
  licensePlates: ['HGW', 'VG'],
  painPoint: 'Gerade in Greifswald kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HGW oder VG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

greiz: {
  intro: 'In Greiz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Aubachtal', 'Dölau', 'Irchwitz', 'Obergrochlitz', 'Pohlitz', 'Reinsdorf'],
  licensePlates: ['GRZ', 'ZR'],
  painPoint: 'Gerade in Greiz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GRZ oder ZR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'grenzach-wyhlen': {
  intro: 'In Grenzach-Wyhlen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Grenzach', 'Wyhlen', 'Hörnle', 'Rührberg', 'Rheinfelder Straße', 'Markhof', 'Oberberg'],
  licensePlates: ['LÖ'],
  painPoint: 'Gerade in Grenzach-Wyhlen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

grevenbroich: {
  intro: 'In Grevenbroich möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder lange Wartezeiten.',
  districts: ['Innenstadt', 'Kapellen', 'Wevelinghoven', 'Gustorf', 'Frimmersdorf', 'Elsen', 'Neukirchen'],
  licensePlates: ['NE', 'GV'],
  painPoint: 'Gerade in Grevenbroich kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NE oder GV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

grevesmuehlen: {
  intro: 'In Grevesmühlen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Wotenitz', 'Questin', 'Santow', 'Barendorf', 'Neu Degtow', 'Poischow'],
  licensePlates: ['NWM', 'GDB', 'GVM', 'WIS'],
  painPoint: 'Gerade in Grevesmühlen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NWM, GDB, GVM oder WIS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

grimma: {
  intro: 'In Grimma möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Hohnstädt', 'Nerchau', 'Döben', 'Großbardau', 'Mutzschen', 'Beiersdorf'],
  licensePlates: ['L', 'BNA', 'GHA', 'GRM', 'MTL', 'WUR'],
  painPoint: 'Gerade in Grimma kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen L, BNA, GHA, GRM, MTL oder WUR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

grimmen: {
  intro: 'In Grimmen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Greifswalder Vorstadt', 'Jarpenbeek', 'Stoltenhagen', 'Hohenwieden', 'Klein Lehmhagen', 'Groß Lehmhagen'],
  licensePlates: ['VR', 'GMN', 'NVP', 'RDG', 'RÜG'],
  painPoint: 'Gerade in Grimmen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VR, GMN, NVP, RDG oder RÜG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'gross-gerau': {
  intro: 'In Groß-Gerau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Dornheim', 'Berkach', 'Wallerstädten', 'Auf Esch', 'Nordend', 'Südstadt'],
  licensePlates: ['GG'],
  painPoint: 'Gerade in Groß-Gerau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

grossenhain: {
  intro: 'In Großenhain möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Zabeltitz', 'Folbern', 'Skassa', 'Walda', 'Kleinraschütz', 'Naundorf'],
  licensePlates: ['MEI', 'GRH', 'RG', 'RIE'],
  painPoint: 'Gerade in Großenhain kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MEI, GRH, RG oder RIE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

gruenstadt: {
  intro: 'In Grünstadt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Innenstadt', 'Asselheim', 'Sausenheim', 'Grünstadt Nord', 'Grünstadt Süd', 'Bahnhofsgebiet', 'Industriegebiet'],
  licensePlates: ['DÜW', 'GRÜ'],
  painPoint: 'Gerade in Grünstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DÜW oder GRÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

guben: {
  intro: 'In Guben möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Groß Breesen', 'Reichenbach', 'Bresinchen', 'Deulowitz', 'Sprucke', 'Kaltenborn'],
  licensePlates: ['SPN', 'FOR', 'GUB', 'SPB'],
  painPoint: 'Gerade in Guben kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SPN, FOR, GUB oder SPB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gummersbach: {
  intro: 'In Gummersbach möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeit oder zusätzliche Wege.',
  districts: ['Innenstadt', 'Dieringhausen', 'Bernberg', 'Niederseßmar', 'Strombach', 'Derschlag', 'Rebbelroth'],
  licensePlates: ['GM'],
  painPoint: 'Gerade in Gummersbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

gundelfingen: {
  intro: 'In Gundelfingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötigen Behördengang.',
  districts: ['Gundelfingen Mitte', 'Wildtal', 'Sonnenwiese', 'Ortskern', 'Am Rebberg', 'Gewerbegebiet', 'Bahnhofsbereich'],
  licensePlates: ['FR'],
  painPoint: 'Gerade in Gundelfingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

guenzburg: {
  intro: 'In Günzburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Reisensburg', 'Denzingen', 'Deffingen', 'Leinheim', 'Nornheim', 'Wasserburg'],
  licensePlates: ['GZ', 'KRU'],
  painPoint: 'Gerade in Günzburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GZ oder KRU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

gunzenhausen: {
  intro: 'In Gunzenhausen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Frickenfelden', 'Aha', 'Laubenzedel', 'Schlungenhof', 'Wald', 'Unterwurmbach'],
  licensePlates: ['WUG', 'GUN'],
  painPoint: 'Gerade in Gunzenhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WUG oder GUN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

guestrow: {
  intro: 'In Güstrow möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Distelberg', 'Suckow', 'Klueß', 'Neu Strenz', 'Primerburg', 'Glasewitz'],
  licensePlates: ['LRO', 'BÜZ', 'DBR', 'GÜ', 'ROS', 'TET'],
  painPoint: 'Gerade in Güstrow kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LRO, BÜZ, DBR, GÜ, ROS oder TET abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

guetersloh: {
  intro: 'In Gütersloh möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Avenwedde', 'Isselhorst', 'Friedrichsdorf', 'Spexard', 'Pavenstädt', 'Blankenhagen'],
  licensePlates: ['GT'],
  painPoint: 'Gerade in Gütersloh kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Gerade bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel hilft ein klarer digitaler Ablauf ohne zusätzlichen Termin.',
},

hachenburg: {
  intro: 'In Hachenburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Altstadt', 'Hachenburg Nord', 'Hachenburg Süd', 'Steinebach', 'Gehlert', 'Nister'],
  licensePlates: ['WW'],
  painPoint: 'Gerade in Hachenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hagen: {
  intro: 'In Hagen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Haspe', 'Hohenlimburg', 'Eilpe', 'Boele', 'Wehringhausen', 'Altenhagen', 'Emst'],
  licensePlates: ['HA'],
  painPoint: 'Gerade in Hagen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Gerade bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel hilft ein klarer digitaler Ablauf ohne zusätzlichen Termin.',
},

hagenow: {
  intro: 'In Hagenow möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Hagenow Heide', 'Scharbow', 'Zapelsdorf', 'Viez', 'Granzin', 'Sudenhof'],
  licensePlates: ['LWL', 'HGN', 'LBZ', 'LUP', 'PCH', 'STB'],
  painPoint: 'Gerade in Hagenow kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LWL, HGN, LBZ, LUP, PCH oder STB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

halberstadt: {
  intro: 'In Halberstadt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten bei der Behörde.',
  districts: ['Innenstadt', 'Wehrstedt', 'Emersleben', 'Klein Quenstedt', 'Aspenstedt', 'Langenstein', 'Sargstedt'],
  licensePlates: ['HZ', 'HBS', 'QLB', 'WR'],
  painPoint: 'Gerade in Halberstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HZ, HBS, QLB oder WR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

haldensleben: {
  intro: 'In Haldensleben möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Althaldensleben', 'Satuelle', 'Uthmöden', 'Wedringen', 'Hundisburg', 'Süplingen'],
  licensePlates: ['BK', 'BÖ', 'HDL', 'OC', 'WMS', 'WZL'],
  painPoint: 'Gerade in Haldensleben kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BK, BÖ, HDL, OC, WMS oder WZL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hamburg: {
  intro: 'In Hamburg nutzen viele Fahrzeughalter die Online-Abmeldung, um Wege durch die Stadt, Terminaufwand und Wartezeiten zu vermeiden.',
  districts: ['Altona', 'Wandsbek', 'Eimsbüttel', 'Harburg', 'Bergedorf', 'Hamburg-Mitte', 'Winterhude'],
  licensePlates: ['HH'],
  painPoint: 'Gerade in Hamburg kosten Termine, Verkehr, Parkplatzsuche und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Für Nutzer aus Altona, Wandsbek, Eimsbüttel, Harburg, Bergedorf oder Hamburg-Mitte ist der digitale Weg oft deutlich bequemer.',
},

'hameln-pyrmont': {
  intro: 'Im Landkreis Hameln-Pyrmont möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Hameln', 'Bad Pyrmont', 'Hessisch Oldendorf', 'Aerzen', 'Coppenbrügge', 'Emmerthal', 'Salzhemmendorf'],
  licensePlates: ['HM', 'PYR'],
  painPoint: 'Gerade im Landkreis Hameln-Pyrmont kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HM oder PYR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hamm: {
  intro: 'In Hamm möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Mitte', 'Bockum-Hövel', 'Heessen', 'Herringen', 'Pelkum', 'Rhynern', 'Uentrop'],
  licensePlates: ['HAM'],
  painPoint: 'Gerade in Hamm kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HAM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hammelburg: {
  intro: 'In Hammelburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Diebach', 'Feuerthal', 'Gauaschach', 'Morlesau', 'Obererthal', 'Untererthal'],
  licensePlates: ['KG', 'BRK', 'HAB'],
  painPoint: 'Gerade in Hammelburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KG, BRK oder HAB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hanau: {
  intro: 'In Hanau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Behörde zu fahren.',
  districts: ['Innenstadt', 'Kesselstadt', 'Steinheim', 'Großauheim', 'Klein-Auheim', 'Wolfgang', 'Mittelbuchen'],
  licensePlates: ['HU', 'GN', 'SLÜ'],
  painPoint: 'Gerade in Hanau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HU, GN oder SLÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'hannoversch-muenden': {
  intro: 'In Hannoversch Münden möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Gimte', 'Hedemünden', 'Hemeln', 'Laubach', 'Lippoldshausen', 'Volkmarshausen'],
  licensePlates: ['GÖ', 'DUD', 'HMÜ'],
  painPoint: 'Gerade in Hannoversch Münden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GÖ, DUD oder HMÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

harburg: {
  intro: 'In Harburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Harburg', 'Wilstorf', 'Eißendorf', 'Marmstorf', 'Heimfeld', 'Neugraben', 'Hausbruch'],
  licensePlates: ['WL'],
  painPoint: 'Gerade in Harburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

harsefeld: {
  intro: 'In Harsefeld möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder lange Wartezeiten.',
  districts: ['Harsefeld Mitte', 'Issendorf', 'Hollenbeck', 'Ruschwedel', 'Griemshorst', 'Weißenfelde', 'Lusthoop'],
  licensePlates: ['STD'],
  painPoint: 'Gerade in Harsefeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen STD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

harz: {
  intro: 'Im Landkreis Harz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Halberstadt', 'Wernigerode', 'Quedlinburg', 'Blankenburg', 'Thale', 'Ilsenburg', 'Osterwieck'],
  licensePlates: ['HZ', 'HBS', 'QLB', 'WR'],
  painPoint: 'Gerade im Landkreis Harz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HZ, HBS, QLB oder WR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hassfurt: {
  intro: 'In Haßfurt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Augsfeld', 'Sylbach', 'Prappach', 'Wülflingen', 'Mariaburghausen', 'Uchenhofen'],
  licensePlates: ['HAS', 'EBN', 'GEO', 'HOH'],
  painPoint: 'Gerade in Haßfurt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HAS, EBN, GEO oder HOH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hassloch: {
  intro: 'In Haßloch möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Haßloch Mitte', 'Südlich der Bahn', 'Nördlich der Bahn', 'Böhl', 'Iggelheim', 'Mußbach', 'Duttweiler'],
  licensePlates: ['DÜW'],
  painPoint: 'Gerade in Haßloch kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DÜW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hauzenberg: {
  intro: 'In Hauzenberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Hauzenberg Mitte', 'Raßreuth', 'Jahrdorf', 'Wotzdorf', 'Germannsdorf', 'Oberdiendorf', 'Krinning'],
  licensePlates: ['PA', 'EG', 'GRA', 'WOS'],
  painPoint: 'Gerade in Hauzenberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PA, EG, GRA oder WOS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

havelberg: {
  intro: 'In Havelberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Nitzow', 'Warnau', 'Kuhlhausen', 'Vehlgast', 'Garz', 'Toppel'],
  licensePlates: ['SDL', 'HV', 'OHA'],
  painPoint: 'Gerade in Havelberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SDL, HV oder OHA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

havelland: {
  intro: 'Im Landkreis Havelland möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Rathenow', 'Nauen', 'Falkensee', 'Premnitz', 'Ketzin', 'Brieselang', 'Dallgow-Döberitz'],
  licensePlates: ['HVL', 'NAU', 'RN'],
  painPoint: 'Gerade im Havelland kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HVL, NAU oder RN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hechingen: {
  intro: 'In Hechingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Stetten', 'Stein', 'Schlatt', 'Sickingen', 'Beuren', 'Boll'],
  licensePlates: ['BL', 'HEC'],
  painPoint: 'Gerade in Hechingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BL oder HEC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

heidelberg: {
  intro: 'In Heidelberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Behörde zu fahren.',
  districts: ['Altstadt', 'Bergheim', 'Handschuhsheim', 'Neuenheim', 'Rohrbach', 'Kirchheim', 'Ziegelhausen'],
  licensePlates: ['HD'],
  painPoint: 'Gerade in Heidelberg kosten Termine, Anfahrt, Parkplatzsuche und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

heidenheim: {
  intro: 'In Heidenheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Schnaitheim', 'Mergelstetten', 'Oggenhausen', 'Großkuchen', 'Aufhausen', 'Voithsiedlung'],
  licensePlates: ['HDH'],
  painPoint: 'Gerade in Heidenheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HDH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'heidenheim-herbrechtingen': {
  intro: 'In Heidenheim und Herbrechtingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Heidenheim Innenstadt', 'Schnaitheim', 'Mergelstetten', 'Herbrechtingen', 'Bolheim', 'Bissingen', 'Eselsburg'],
  licensePlates: ['HDH'],
  painPoint: 'Gerade in Heidenheim und Herbrechtingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HDH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

heilbad-heiligenstadt: {
  intro: 'In Heilbad Heiligenstadt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Rengelrode', 'Flinsberg', 'Kalteneber', 'Günterode', 'Petriviertel', 'Bahnhofsbereich'],
  licensePlates: ['EIC', 'HIG', 'WBS'],
  painPoint: 'Gerade in Heilbad Heiligenstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EIC, HIG oder WBS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

heinsberg: {
  intro: 'In Heinsberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Dremmen', 'Oberbruch', 'Kirchhoven', 'Karken', 'Lieck', 'Schafhausen'],
  licensePlates: ['HS', 'ERK', 'GK'],
  painPoint: 'Gerade in Heinsberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HS, ERK oder GK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

helmstedt: {
  intro: 'In Helmstedt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Emmerstedt', 'Barmke', 'Bad Helmstedt', 'Offleben', 'Büddenstedt', 'Hohnsleben'],
  licensePlates: ['HE'],
  painPoint: 'Gerade in Helmstedt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

heppenheim: {
  intro: 'In Heppenheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Erbach', 'Hambach', 'Kirschhausen', 'Mittershausen', 'Sonderbach', 'Wald-Erlenbach'],
  licensePlates: ['HP'],
  painPoint: 'Gerade in Heppenheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

herbolzheim: {
  intro: 'In Herbolzheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Bleichheim', 'Broggingen', 'Tutschfelden', 'Wagenstadt', 'Herbolzheim Nord', 'Herbolzheim Süd'],
  licensePlates: ['EM'],
  painPoint: 'Gerade in Herbolzheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

herborn: {
  intro: 'In Herborn möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Burg', 'Hörbach', 'Merkenbach', 'Seelbach', 'Schönbach', 'Uckersdorf'],
  licensePlates: ['LDK', 'DIL', 'WZ'],
  painPoint: 'Gerade in Herborn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LDK, DIL oder WZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

herford: {
  intro: 'In Herford möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Elverdissen', 'Diebrock', 'Eickum', 'Laar', 'Schwarzenmoor', 'Stedefreund'],
  licensePlates: ['HF'],
  painPoint: 'Gerade in Herford kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hermeskeil: {
  intro: 'In Hermeskeil möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Abtei', 'Damhäuser', 'Höfchen', 'Lascheiderhof', 'Rascheid', 'Züsch'],
  licensePlates: ['TR', 'SAB'],
  painPoint: 'Gerade in Hermeskeil kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TR oder SAB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

herrenberg: {
  intro: 'In Herrenberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Gültstein', 'Haslach', 'Kayh', 'Kuppingen', 'Mönchberg', 'Oberjesingen'],
  licensePlates: ['BB', 'LEO'],
  painPoint: 'Gerade in Herrenberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BB oder LEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hersbruck: {
  intro: 'In Hersbruck möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Altensittenbach', 'Kühnhofen', 'Weiher', 'Ellenbach', 'Großviehberg', 'Leutenbach'],
  licensePlates: ['LAU', 'ESB', 'HEB', 'N', 'PEG'],
  painPoint: 'Gerade in Hersbruck kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LAU, ESB, HEB, N oder PEG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

herzberg: {
  intro: 'In Herzberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Pöhlde', 'Scharzfeld', 'Lonau', 'Sieber', 'Mühlenberg', 'Juessee'],
  licensePlates: ['GÖ', 'DUD', 'OHA'],
  painPoint: 'Gerade in Herzberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GÖ, DUD oder OHA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hildburghausen: {
  intro: 'In Hildburghausen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Weitersroda', 'Leimrieth', 'Wallrabs', 'Birkenfeld', 'Pfaffenholz', 'Gerhardtsgereuth'],
  licensePlates: ['HBN'],
  painPoint: 'Gerade in Hildburghausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HBN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hildesheim: {
  intro: 'In Hildesheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Moritzberg', 'Neuhof', 'Ochtersum', 'Drispenstedt', 'Itzum', 'Himmelsthür'],
  licensePlates: ['HI', 'ALF'],
  painPoint: 'Gerade in Hildesheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HI oder ALF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hochsauerlandkreis: {
  intro: 'Im Hochsauerlandkreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Arnsberg', 'Meschede', 'Brilon', 'Sundern', 'Winterberg', 'Olsberg', 'Schmallenberg'],
  licensePlates: ['HSK', 'AR', 'BRI', 'MES'],
  painPoint: 'Gerade im Hochsauerlandkreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HSK, AR, BRI oder MES abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'hoechstadt-an-der-aisch': {
  intro: 'In Höchstadt an der Aisch möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Etzelskirchen', 'Greuth', 'Höchstadt Nord', 'Höchstadt Süd', 'Nackendorf', 'Sterpersdorf'],
  licensePlates: ['ERH', 'HÖS'],
  painPoint: 'Gerade in Höchstadt an der Aisch kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ERH oder HÖS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hof: {
  intro: 'In Hof möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Moschendorf', 'Krötenbruck', 'Unterkotzau', 'Jägersruh', 'Hofeck', 'Vogelherd'],
  licensePlates: ['HO'],
  painPoint: 'Gerade in Hof kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hofgeismar: {
  intro: 'In Hofgeismar möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Hombressen', 'Hümme', 'Carlsdorf', 'Kelze', 'Schöneberg', 'Beberbeck'],
  licensePlates: ['KS', 'HOG', 'WOH'],
  painPoint: 'Gerade in Hofgeismar kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KS, HOG oder WOH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hofheim: {
  intro: 'In Hofheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder lange Wartezeiten.',
  districts: ['Innenstadt', 'Diedenbergen', 'Langenhain', 'Lorsbach', 'Marxheim', 'Wallau', 'Wildsachsen'],
  licensePlates: ['MTK'],
  painPoint: 'Gerade in Hofheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MTK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hohenlohe: {
  intro: 'Im Hohenlohekreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Künzelsau', 'Öhringen', 'Neuenstein', 'Forchtenberg', 'Waldenburg', 'Ingelfingen', 'Bretzfeld'],
  licensePlates: ['KÜN', 'ÖHR'],
  painPoint: 'Gerade im Hohenlohekreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KÜN oder ÖHR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hohenlohekreis: {
  intro: 'Im Hohenlohekreis möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Künzelsau', 'Öhringen', 'Pfedelbach', 'Bretzfeld', 'Neuenstein', 'Kupferzell', 'Ingelfingen'],
  licensePlates: ['KÜN', 'ÖHR'],
  painPoint: 'Gerade im Hohenlohekreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KÜN oder ÖHR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hohenmoelsen: {
  intro: 'In Hohenmölsen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Großgrimma', 'Wählitz', 'Webau', 'Zembschen', 'Taucha', 'Granschütz'],
  licensePlates: ['BLK', 'HHM', 'NEB', 'NMB', 'WSF', 'ZZ'],
  painPoint: 'Gerade in Hohenmölsen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BLK, HHM, NEB, NMB, WSF oder ZZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'hohenstein-ernstthal': {
  intro: 'In Hohenstein-Ernstthal möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Hohenstein', 'Ernstthal', 'Wüstenbrand', 'Hüttengrund', 'Sonnenstraße', 'Bahnhofsviertel', 'Altmarkt'],
  licensePlates: ['Z', 'GC', 'HOT', 'WDA'],
  painPoint: 'Gerade in Hohenstein-Ernstthal kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen Z, GC, HOT oder WDA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

holzgerlingen: {
  intro: 'In Holzgerlingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Holzgerlingen Mitte', 'Buch', 'Stäuchle', 'Hülben', 'Gewerbegebiet', 'Hohenzollernstraße', 'Böblinger Straße'],
  licensePlates: ['BB', 'LEO'],
  painPoint: 'Gerade in Holzgerlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BB oder LEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

holzminden: {
  intro: 'In Holzminden möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Allersheim', 'Neuhaus', 'Silberborn', 'Mühlenberg', 'Fohlenplacken', 'Böntal'],
  licensePlates: ['HOL'],
  painPoint: 'Gerade in Holzminden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HOL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

homberg: {
  intro: 'In Homberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Wernswig', 'Holzhausen', 'Mardorf', 'Lützelwig', 'Caßdorf', 'Mörshausen'],
  licensePlates: ['HR', 'FZ', 'MEG', 'ZIG'],
  painPoint: 'Gerade in Homberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HR, FZ, MEG oder ZIG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

homburg: {
  intro: 'In Homburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Innenstadt', 'Erbach', 'Jägersburg', 'Einöd', 'Kirrberg', 'Wörschweiler', 'Schwarzenacker'],
  licensePlates: ['HOM', 'IGB'],
  painPoint: 'Gerade in Homburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HOM oder IGB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'horb-am-neckar': {
  intro: 'In Horb am Neckar möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Bildechingen', 'Dettingen', 'Mühlen', 'Nordstetten', 'Talheim', 'Altheim'],
  licensePlates: ['FDS', 'HCH', 'HOR'],
  painPoint: 'Gerade in Horb am Neckar kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FDS, HCH oder HOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

hoexter: {
  intro: 'In Höxter möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Albaxen', 'Bödexen', 'Godelheim', 'Lüchtringen', 'Ottbergen', 'Stahle'],
  licensePlates: ['HX'],
  painPoint: 'Gerade in Höxter kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HX abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

hueckeswagen: {
  intro: 'In Hückeswagen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Wiehagen', 'Kobeshofen', 'Herweg', 'Dreibäumen', 'Kammerforsterhöhe', 'Hartkopsbever'],
  licensePlates: ['RS', 'SG'],
  painPoint: 'Gerade in Hückeswagen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RS oder SG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

huenfeld: {
  intro: 'In Hünfeld möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Mackenzell', 'Michelsrombach', 'Molzbach', 'Nüst', 'Oberfeld', 'Rückers'],
  licensePlates: ['FD'],
  painPoint: 'Gerade in Hünfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

huerth: {
  intro: 'In Hürth möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Alt-Hürth', 'Efferen', 'Gleuel', 'Hermülheim', 'Kendenich', 'Fischenich', 'Berrenrath'],
  licensePlates: ['BM'],
  painPoint: 'Gerade in Hürth kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

husum: {
  intro: 'In Husum möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Rödemis', 'Schobüll', 'Hockensbüll', 'Dreimühlen', 'Osterhusum', 'Mildstedt'],
  licensePlates: ['NF'],
  painPoint: 'Gerade in Husum kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

idar-oberstein: {
  intro: 'In Idar-Oberstein möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Oberstein', 'Idar', 'Algenrodt', 'Göttschied', 'Weierbach', 'Nahbollenbach'],
  licensePlates: ['BIR'],
  painPoint: 'Gerade in Idar-Oberstein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BIR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

idstein: {
  intro: 'In Idstein möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Wörsdorf', 'Walsdorf', 'Heftrich', 'Kröftel', 'Niederauroff', 'Dasbach'],
  licensePlates: ['RÜD', 'SWA'],
  painPoint: 'Gerade in Idstein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RÜD oder SWA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

illertissen: {
  intro: 'In Illertissen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Au', 'Betlinshausen', 'Jedesheim', 'Tiefenbach', 'Bellenberg', 'Vöhringen'],
  licensePlates: ['NU', 'ILL'],
  painPoint: 'Gerade in Illertissen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NU oder ILL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

ilm-kreis: {
  intro: 'Im Ilm-Kreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle einplanen zu müssen.',
  districts: ['Arnstadt', 'Ilmenau', 'Stadtilm', 'Großbreitenbach', 'Plaue', 'Gehren', 'Langewiesen'],
  licensePlates: ['IK', 'ARN', 'IL'],
  painPoint: 'Gerade im Ilm-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen IK, ARN oder IL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

ilmenau: {
  intro: 'In Ilmenau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Langewiesen', 'Gehren', 'Manebach', 'Stützerbach', 'Unterpörlitz', 'Oberpörlitz'],
  licensePlates: ['IK', 'ARN', 'IL'],
  painPoint: 'Gerade in Ilmenau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen IK, ARN oder IL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

ilsfeld: {
  intro: 'In Ilsfeld möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Ilsfeld', 'Auenstein', 'Schozach', 'Helfenberg', 'Abstetterhof', 'Wüstenhausen', 'Beilstein'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Ilsfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

ingolstadt: {
  intro: 'In Ingolstadt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Mitte', 'Nordost', 'Südost', 'Südwest', 'Friedrichshofen', 'Gerolfing', 'Etting'],
  licensePlates: ['IN'],
  painPoint: 'Gerade in Ingolstadt kosten Termine, Anfahrt, Verkehr und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen IN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

iserlohn: {
  intro: 'In Iserlohn möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Zentrum', 'Letmathe', 'Hennen', 'Sümmern', 'Dröschede', 'Oestrich', 'Kalthof'],
  licensePlates: ['MK', 'IS'],
  painPoint: 'Gerade in Iserlohn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MK oder IS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

itzehoe: {
  intro: 'In Itzehoe möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Wellenkamp', 'Edendorf', 'Tegelhörn', 'Sude', 'Klosterforst', 'Oelixdorf'],
  licensePlates: ['IZ'],
  painPoint: 'Gerade in Itzehoe kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen IZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

jena: {
  intro: 'In Jena möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Zentrum', 'Lobeda', 'Winzerla', 'Jena-Nord', 'Jena-Ost', 'Jena-West', 'Zwätzen'],
  licensePlates: ['J'],
  painPoint: 'Gerade in Jena kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen J abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

jessen: {
  intro: 'In Jessen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Jessen', 'Schweinitz', 'Holzdorf', 'Elster', 'Klöden', 'Seyda', 'Annaburg'],
  licensePlates: ['WB', 'JE', 'GHC'],
  painPoint: 'Gerade in Jessen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WB, JE oder GHC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

jever: {
  intro: 'In Jever möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Moorwarfen', 'Rahrdum', 'Cleverns', 'Sandel', 'Sillenstede', 'Hooksiel'],
  licensePlates: ['FRI'],
  painPoint: 'Gerade in Jever kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FRI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

juelich: {
  intro: 'In Jülich möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Koslar', 'Barmen', 'Broich', 'Güsten', 'Welldorf', 'Stetternich'],
  licensePlates: ['DN', 'JÜL'],
  painPoint: 'Gerade in Jülich kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DN oder JÜL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

juenkerath: {
  intro: 'In Jünkerath möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Jünkerath', 'Glaadt', 'Gönnersdorf', 'Lissendorf', 'Birgel', 'Stadtkyll', 'Hallschlag'],
  licensePlates: ['DAU'],
  painPoint: 'Gerade in Jünkerath kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DAU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kaiserslautern: {
  intro: 'In Kaiserslautern möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Einsiedlerhof', 'Erfenbach', 'Morlautern', 'Dansenberg', 'Hohenecken', 'Siegelbach'],
  licensePlates: ['KL'],
  painPoint: 'Gerade in Kaiserslautern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kamenz: {
  intro: 'In Kamenz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Deutschbaselitz', 'Wiesa', 'Bernbruch', 'Jesau', 'Schiedel', 'Zschornau'],
  licensePlates: ['BZ', 'KM', 'HY'],
  painPoint: 'Gerade in Kamenz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BZ, KM oder HY abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kandel: {
  intro: 'In Kandel möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Kandel', 'Mindeslachen', 'Winden', 'Minfeld', 'Steinweiler', 'Erlenbach', 'Freckenfeld'],
  licensePlates: ['GER'],
  painPoint: 'Gerade in Kandel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GER abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kandern: {
  intro: 'In Kandern möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Kandern', 'Feuerbach', 'Holzen', 'Riedlingen', 'Sitzenkirch', 'Tannenkirch', 'Wollbach'],
  licensePlates: ['LÖ'],
  painPoint: 'Gerade in Kandern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

karben: {
  intro: 'In Karben möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Groß-Karben', 'Klein-Karben', 'Okarben', 'Rendel', 'Burg-Gräfenrode', 'Petterweil', 'Kloppenheim'],
  licensePlates: ['FB', 'BÜD'],
  painPoint: 'Gerade in Karben kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FB oder BÜD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

karlsruhe: {
  intro: 'In Karlsruhe möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Durlach', 'Mühlburg', 'Knielingen', 'Grötzingen', 'Rüppurr', 'Neureut'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Karlsruhe kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

karlstadt: {
  intro: 'In Karlstadt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Karlstadt', 'Gambach', 'Heßlar', 'Karlburg', 'Laudenbach', 'Mühlbach', 'Stetten'],
  licensePlates: ['MSP', 'GEM', 'LOH', 'MAR'],
  painPoint: 'Gerade in Karlstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSP, GEM, LOH oder MAR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kassel: {
  intro: 'In Kassel möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wartezeiten oder Behördengänge.',
  districts: ['Mitte', 'Bad Wilhelmshöhe', 'Bettenhausen', 'Harleshausen', 'Nord-Holland', 'Waldau', 'Wehlheiden'],
  licensePlates: ['KS'],
  painPoint: 'Gerade in Kassel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kaufbeuren: {
  intro: 'In Kaufbeuren möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Neugablonz', 'Oberbeuren', 'Hirschzell', 'Kemnat', 'Mauerstetten', 'Pforzen'],
  licensePlates: ['KF'],
  painPoint: 'Gerade in Kaufbeuren kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kehl: {
  intro: 'In Kehl möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Kehl', 'Auenheim', 'Bodersweier', 'Goldscheuer', 'Kork', 'Marlen', 'Sundheim'],
  licensePlates: ['OG', 'BH', 'KEL', 'LR', 'WOL'],
  painPoint: 'Gerade in Kehl kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OG, BH, KEL, LR oder WOL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kelheim: {
  intro: 'In Kelheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Kelheim', 'Affecking', 'Gronsdorf', 'Weltenburg', 'Staubing', 'Thaldorf', 'Saal an der Donau'],
  licensePlates: ['KEH', 'MAI', 'PAR', 'RID', 'ROL'],
  painPoint: 'Gerade in Kelheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KEH, MAI, PAR, RID oder ROL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

keltern: {
  intro: 'In Keltern möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Dietlingen', 'Ellmendingen', 'Weiler', 'Niebelsbach', 'Dietenhausen', 'Pfinzweiler', 'Ispringen'],
  licensePlates: ['PF', 'ENZ'],
  painPoint: 'Gerade in Keltern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PF oder ENZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kemnath: {
  intro: 'In Kemnath möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Kemnath', 'Atzmannsberg', 'Guttenberg', 'Kötzersdorf', 'Oberndorf', 'Schütz', 'Waldeck'],
  licensePlates: ['TIR', 'KEM', 'REH', 'MAK', 'WUN'],
  painPoint: 'Gerade in Kemnath kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TIR, KEM, REH, MAK oder WUN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kempen: {
  intro: 'In Kempen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wartezeiten oder Behördengänge.',
  districts: ['Kempen', 'St. Hubert', 'Tönisberg', 'Schmalbroich', 'Unterweiden', 'Voesch', 'Ziegelheide'],
  licensePlates: ['VIE', 'KK'],
  painPoint: 'Gerade in Kempen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VIE oder KK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kempten: {
  intro: 'In Kempten möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Innenstadt', 'Sankt Mang', 'Thingers', 'Lenzfried', 'Leubas', 'Hegge', 'Rothkreuz'],
  licensePlates: ['KE'],
  painPoint: 'Gerade in Kempten kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kenzingen: {
  intro: 'In Kenzingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Kenzingen', 'Bombach', 'Hecklingen', 'Nordweil', 'Herbolzheim', 'Riegel', 'Malterdingen'],
  licensePlates: ['EM'],
  painPoint: 'Gerade in Kenzingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'kfz-zulassung-pirna': {
  intro: 'In Pirna möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Pirna', 'Copitz', 'Sonnenstein', 'Graupa', 'Mockethal', 'Zehista', 'Liebethal'],
  licensePlates: ['PIR', 'DW', 'FTL', 'SEB'],
  painPoint: 'Gerade in Pirna kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PIR, DW, FTL oder SEB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'kfz-zulassungsstelle-goeppingen': {
  intro: 'In Göppingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Innenstadt', 'Faurndau', 'Jebenhausen', 'Hohenstaufen', 'Bartenbach', 'Holzheim', 'Bezgenriet'],
  licensePlates: ['GP'],
  painPoint: 'Gerade in Göppingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kirchen: {
  intro: 'In Kirchen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Kirchen', 'Wehbach', 'Katzenbach', 'Freusburg', 'Offhausen', 'Herkersdorf', 'Mudersbach'],
  licensePlates: ['AK'],
  painPoint: 'Gerade in Kirchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kirchheim: {
  intro: 'In Kirchheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Kirchheim', 'Ötlingen', 'Jesingen', 'Nabern', 'Lindorf', 'Dettingen', 'Notzingen'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade in Kirchheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kirchheimbolanden: {
  intro: 'In Kirchheimbolanden möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Kirchheimbolanden', 'Marnheim', 'Göllheim', 'Eisenberg', 'Bolanden', 'Morschheim', 'Stetten'],
  licensePlates: ['KIB', 'ROK'],
  painPoint: 'Gerade in Kirchheimbolanden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KIB oder ROK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kirchhellen: {
  intro: 'In Kirchhellen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Kirchhellen', 'Grafenwald', 'Feldhausen', 'Holthausen', 'Overhagen', 'Hardinghausen', 'Bottrop-Nord'],
  licensePlates: ['BOT'],
  painPoint: 'Gerade in Kirchhellen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BOT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kirchzarten: {
  intro: 'In Kirchzarten möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Kirchzarten', 'Burg', 'Zarten', 'Dietenbach', 'Oberried', 'Buchenbach', 'Stegen'],
  licensePlates: ['FR'],
  painPoint: 'Gerade in Kirchzarten kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kirn: {
  intro: 'In Kirn möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Kirn', 'Kirn-Sulzbach', 'Hochstetten-Dhaun', 'Hennweiler', 'Oberhausen', 'Simmertal', 'Meckenbach'],
  licensePlates: ['KH'],
  painPoint: 'Gerade in Kirn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kitzingen: {
  intro: 'In Kitzingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wartezeiten oder Behördengänge.',
  districts: ['Kitzingen', 'Sickershausen', 'Hohenfeld', 'Hoheim', 'Etwashausen', 'Repperndorf', 'Mainbernheim'],
  licensePlates: ['KT'],
  painPoint: 'Gerade in Kitzingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kleve: {
  intro: 'In Kleve möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Kellen', 'Materborn', 'Rindern', 'Donsbrüggen', 'Reichswalde', 'Griethausen'],
  licensePlates: ['KLE', 'GEL'],
  painPoint: 'Gerade in Kleve kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KLE oder GEL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'kleve-stadt': {
  intro: 'In der Stadt Kleve möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege zur Zulassungsstelle.',
  districts: ['Innenstadt', 'Kellen', 'Materborn', 'Rindern', 'Donsbrüggen', 'Reichswalde', 'Schenkenschanz'],
  licensePlates: ['KLE', 'GEL'],
  painPoint: 'Gerade in Kleve kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KLE oder GEL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

koblenz: {
  intro: 'In Koblenz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Altstadt', 'Ehrenbreitstein', 'Lützel', 'Metternich', 'Karthause', 'Rauental', 'Asterstein'],
  licensePlates: ['KO'],
  painPoint: 'Gerade in Koblenz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

koegen: {
  intro: 'In Kögen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Kögen', 'Köngen', 'Wendlingen', 'Unterensingen', 'Oberboihingen', 'Wernau', 'Deizisau'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade in Kögen und Umgebung kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

koengen: {
  intro: 'In Köngen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Köngen', 'Wendlingen', 'Unterensingen', 'Oberboihingen', 'Deizisau', 'Wernau', 'Plochingen'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade in Köngen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

koenigs-wusterhausen: {
  intro: 'In Königs Wusterhausen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Königs Wusterhausen', 'Deutsch Wusterhausen', 'Zernsdorf', 'Kablow', 'Niederlehme', 'Senzig', 'Wernsdorf'],
  licensePlates: ['LDS', 'KW', 'LC', 'LN'],
  painPoint: 'Gerade in Königs Wusterhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LDS, KW, LC oder LN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

koenigsbach-stein: {
  intro: 'In Königsbach-Stein möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge.',
  districts: ['Königsbach', 'Stein', 'Eisingen', 'Kämpfelbach', 'Ispringen', 'Keltern', 'Remchingen'],
  licensePlates: ['PF', 'ENZ'],
  painPoint: 'Gerade in Königsbach-Stein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PF oder ENZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

konstanz: {
  intro: 'In Konstanz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Altstadt', 'Petershausen', 'Paradies', 'Fürstenberg', 'Wollmatingen', 'Allmannsdorf', 'Litzelstetten'],
  licensePlates: ['KN', 'BÜS', 'STO'],
  painPoint: 'Gerade in Konstanz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KN, BÜS oder STO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

korbach: {
  intro: 'In Korbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Korbach', 'Meineringhausen', 'Nordenbeck', 'Rhena', 'Lengefeld', 'Berndorf', 'Helmscheid'],
  licensePlates: ['KB', 'WA'],
  painPoint: 'Gerade in Korbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KB oder WA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

koethen: {
  intro: 'In Köthen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Köthen', 'Arensdorf', 'Baasdorf', 'Dohndorf', 'Löbnitz', 'Merzien', 'Wülknitz'],
  licensePlates: ['ABI', 'AZE', 'BTF', 'KÖT'],
  painPoint: 'Gerade in Köthen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ABI, AZE, BTF oder KÖT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kraichtal: {
  intro: 'In Kraichtal möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Gochsheim', 'Menzingen', 'Münzesheim', 'Oberacker', 'Bahnbrücken', 'Neuenbürg', 'Unteröwisheim'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Kraichtal kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

krefeld: {
  intro: 'In Krefeld möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Innenstadt', 'Uerdingen', 'Fischeln', 'Oppum', 'Bockum', 'Traar', 'Hüls'],
  licensePlates: ['KR'],
  painPoint: 'Gerade in Krefeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kronach: {
  intro: 'In Kronach möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Kronach', 'Friesen', 'Gehülz', 'Neuses', 'Seelach', 'Ziegelerden', 'Dörfles'],
  licensePlates: ['KC', 'SAN'],
  painPoint: 'Gerade in Kronach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KC oder SAN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

krumbach: {
  intro: 'In Krumbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege zur Zulassungsstelle.',
  districts: ['Krumbach', 'Billenhausen', 'Edenhausen', 'Hürben', 'Niederraunau', 'Attenhausen', 'Hohenraunau'],
  licensePlates: ['GZ', 'KRU'],
  painPoint: 'Gerade in Krumbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GZ oder KRU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kulmbach: {
  intro: 'In Kulmbach möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Kulmbach', 'Blaich', 'Metzdorf', 'Burghaig', 'Mangersreuth', 'Melkendorf', 'Ziegelhütten'],
  licensePlates: ['KU', 'SAN'],
  painPoint: 'Gerade in Kulmbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KU oder SAN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kuenzelsau: {
  intro: 'In Künzelsau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Künzelsau', 'Gaisbach', 'Amrichshausen', 'Belsenberg', 'Kocherstetten', 'Morsbach', 'Nagelsberg'],
  licensePlates: ['KÜN', 'ÖHR'],
  painPoint: 'Gerade in Künzelsau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KÜN oder ÖHR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kusel: {
  intro: 'In Kusel möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Kusel', 'Diedelkopf', 'Bledesbach', 'Rammelsbach', 'Altenglan', 'Ruthweiler', 'Haschbach'],
  licensePlates: ['KUS'],
  painPoint: 'Gerade in Kusel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KUS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kyffhaeuser: {
  intro: 'Im Kyffhäuser-Gebiet möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Behörde.',
  districts: ['Sondershausen', 'Bad Frankenhausen', 'Artern', 'Ebeleben', 'Greußen', 'Heldrungen', 'Roßleben'],
  licensePlates: ['KYF', 'ART', 'SDH'],
  painPoint: 'Gerade im Kyffhäuser-Gebiet kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KYF, ART oder SDH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

kyffhaeuserkreis: {
  intro: 'Im Kyffhäuserkreis möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Sondershausen', 'Bad Frankenhausen', 'Artern', 'Ebeleben', 'Greußen', 'Heldrungen', 'Roßleben'],
  licensePlates: ['KYF', 'ART', 'SDH'],
  painPoint: 'Gerade im Kyffhäuserkreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KYF, ART oder SDH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

kyritz: {
  intro: 'In Kyritz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Kyritz', 'Bork', 'Drewen', 'Gantikow', 'Kötzlin', 'Rehfeld', 'Teetz'],
  licensePlates: ['PR', 'KY', 'NP', 'WK'],
  painPoint: 'Gerade in Kyritz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PR, KY, NP oder WK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lahn-dill: {
  intro: 'Im Lahn-Dill-Kreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Wetzlar', 'Dillenburg', 'Herborn', 'Haiger', 'Solms', 'Braunfels', 'Aßlar'],
  licensePlates: ['LDK', 'DIL', 'WZ'],
  painPoint: 'Gerade im Lahn-Dill-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LDK, DIL oder WZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lahnstein: {
  intro: 'In Lahnstein möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Oberlahnstein', 'Niederlahnstein', 'Friedland', 'Friedrichssegen', 'Hohenrhein', 'Braubach', 'Rhens'],
  licensePlates: ['EMS', 'DIZ', 'GOH'],
  painPoint: 'Gerade in Lahnstein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EMS, DIZ oder GOH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

lahr: {
  intro: 'In Lahr möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Dinglingen', 'Sulz', 'Mietersheim', 'Kippenheimweiler', 'Reichenbach', 'Hugsweier'],
  licensePlates: ['OG', 'BH', 'KEL', 'LR', 'WOL'],
  painPoint: 'Gerade in Lahr kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OG, BH, KEL, LR oder WOL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

laichingen: {
  intro: 'In Laichingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Laichingen', 'Feldstetten', 'Machtolsheim', 'Suppingen', 'Merklingen', 'Nellingen', 'Westerheim'],
  licensePlates: ['UL'],
  painPoint: 'Gerade in Laichingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

lambrecht: {
  intro: 'In Lambrecht möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Lambrecht', 'Grevenhausen', 'Lindenberg', 'Neidenfels', 'Weidenthal', 'Esthal', 'Elmstein'],
  licensePlates: ['DÜW'],
  painPoint: 'Gerade in Lambrecht kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DÜW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landau-an-der-isar': {
  intro: 'In Landau an der Isar möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Landau an der Isar', 'Zeholfing', 'Höcking', 'Mettenhausen', 'Reichersdorf', 'Ganacker', 'Pilsting'],
  licensePlates: ['DGF', 'LAN'],
  painPoint: 'Gerade in Landau an der Isar kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DGF oder LAN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landau-in-der-pfalz': {
  intro: 'In Landau in der Pfalz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Innenstadt', 'Arzheim', 'Dammheim', 'Godramstein', 'Mörlheim', 'Queichheim', 'Wollmesheim'],
  licensePlates: ['LD'],
  painPoint: 'Gerade in Landau in der Pfalz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-aichach-friedberg': {
  intro: 'Im Landkreis Aichach-Friedberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Aichach', 'Friedberg', 'Mering', 'Kissing', 'Dasing', 'Pöttmes', 'Affing'],
  licensePlates: ['AIC', 'FDB'],
  painPoint: 'Gerade im Landkreis Aichach-Friedberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AIC oder FDB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-altoetting': {
  intro: 'Im Landkreis Altötting möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Altötting', 'Burghausen', 'Neuötting', 'Töging am Inn', 'Burgkirchen', 'Garching an der Alz', 'Marktl'],
  licensePlates: ['AÖ'],
  painPoint: 'Gerade im Landkreis Altötting kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-amberg-sulzbach': {
  intro: 'Im Landkreis Amberg-Sulzbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Behörde.',
  districts: ['Sulzbach-Rosenberg', 'Kümmersbruck', 'Auerbach', 'Hahnbach', 'Hirschau', 'Schnaittenbach', 'Vilseck'],
  licensePlates: ['AS'],
  painPoint: 'Gerade im Landkreis Amberg-Sulzbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-ansbach': {
  intro: 'Im Landkreis Ansbach möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Ansbach', 'Dinkelsbühl', 'Feuchtwangen', 'Rothenburg ob der Tauber', 'Herrieden', 'Heilsbronn', 'Wassertrüdingen'],
  licensePlates: ['AN', 'DKB', 'FEU', 'ROT'],
  painPoint: 'Gerade im Landkreis Ansbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AN, DKB, FEU oder ROT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-aschaffenburg': {
  intro: 'Im Landkreis Aschaffenburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Alzenau', 'Goldbach', 'Hösbach', 'Großostheim', 'Kahl am Main', 'Kleinostheim', 'Mainaschaff'],
  licensePlates: ['AB', 'ALZ'],
  painPoint: 'Gerade im Landkreis Aschaffenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AB oder ALZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-augsburg': {
  intro: 'Im Landkreis Augsburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Gersthofen', 'Königsbrunn', 'Neusäß', 'Bobingen', 'Stadtbergen', 'Schwabmünchen', 'Meitingen'],
  licensePlates: ['A', 'SMÜ', 'WER'],
  painPoint: 'Gerade im Landkreis Augsburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen A, SMÜ oder WER abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-bad-kissingen': {
  intro: 'Im Landkreis Bad Kissingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Bad Kissingen', 'Hammelburg', 'Bad Brückenau', 'Münnerstadt', 'Maßbach', 'Oerlenbach', 'Nüdlingen'],
  licensePlates: ['KG', 'BRK', 'HAB'],
  painPoint: 'Gerade im Landkreis Bad Kissingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KG, BRK oder HAB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-bad-toelz-wolfratshausen': {
  intro: 'Im Landkreis Bad Tölz-Wolfratshausen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge.',
  districts: ['Bad Tölz', 'Wolfratshausen', 'Geretsried', 'Lenggries', 'Benediktbeuern', 'Kochel am See', 'Bichl'],
  licensePlates: ['TÖL', 'WOR'],
  painPoint: 'Gerade im Landkreis Bad Tölz-Wolfratshausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TÖL oder WOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-biberach': {
  intro: 'Im Landkreis Biberach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Biberach', 'Laupheim', 'Riedlingen', 'Ochsenhausen', 'Bad Schussenried', 'Erolzheim', 'Schemmerhofen'],
  licensePlates: ['BC'],
  painPoint: 'Gerade im Landkreis Biberach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-boeblingen': {
  intro: 'Im Landkreis Böblingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Böblingen', 'Sindelfingen', 'Leonberg', 'Herrenberg', 'Holzgerlingen', 'Renningen', 'Weil der Stadt'],
  licensePlates: ['BB', 'LEO'],
  painPoint: 'Gerade im Landkreis Böblingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BB oder LEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-breisgau-hochschwarzwald': {
  intro: 'Im Landkreis Breisgau-Hochschwarzwald möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Titisee-Neustadt', 'Müllheim', 'Bad Krozingen', 'Breisach', 'Staufen', 'Neuenburg am Rhein', 'Kirchzarten'],
  licensePlates: ['FR', 'MÜL', 'NEU'],
  painPoint: 'Gerade im Landkreis Breisgau-Hochschwarzwald kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR, MÜL oder NEU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-calw': {
  intro: 'Im Landkreis Calw möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Calw', 'Nagold', 'Bad Wildbad', 'Altensteig', 'Bad Liebenzell', 'Wildberg', 'Neuenbürg'],
  licensePlates: ['CW'],
  painPoint: 'Gerade im Landkreis Calw kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-emmendingen': {
  intro: 'Im Landkreis Emmendingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Emmendingen', 'Waldkirch', 'Herbolzheim', 'Kenzingen', 'Endingen', 'Denzlingen', 'Teningen'],
  licensePlates: ['EM'],
  painPoint: 'Gerade im Landkreis Emmendingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-esslingen': {
  intro: 'Im Landkreis Esslingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Esslingen', 'Nürtingen', 'Kirchheim unter Teck', 'Filderstadt', 'Leinfelden-Echterdingen', 'Ostfildern', 'Plochingen'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade im Landkreis Esslingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-freudenstadt': {
  intro: 'Im Landkreis Freudenstadt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Freudenstadt', 'Horb am Neckar', 'Dornstetten', 'Alpirsbach', 'Baiersbronn', 'Loßburg', 'Pfalzgrafenweiler'],
  licensePlates: ['FDS', 'HOR'],
  painPoint: 'Gerade im Landkreis Freudenstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FDS oder HOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-goeppingen': {
  intro: 'Im Landkreis Göppingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Göppingen', 'Geislingen an der Steige', 'Eislingen', 'Uhingen', 'Ebersbach', 'Süßen', 'Donzdorf'],
  licensePlates: ['GP'],
  painPoint: 'Gerade im Landkreis Göppingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-heidenheim': {
  intro: 'Im Landkreis Heidenheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Heidenheim', 'Giengen an der Brenz', 'Herbrechtingen', 'Niederstotzingen', 'Steinheim am Albuch', 'Sontheim', 'Königsbronn'],
  licensePlates: ['HDH'],
  painPoint: 'Gerade im Landkreis Heidenheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HDH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-heilbronn': {
  intro: 'Im Landkreis Heilbronn möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder Wartezeit einzuplanen.',
  districts: ['Neckarsulm', 'Eppingen', 'Bad Rappenau', 'Lauffen am Neckar', 'Brackenheim', 'Weinsberg', 'Leingarten'],
  licensePlates: ['HN'],
  painPoint: 'Gerade im Landkreis Heilbronn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-karlsruhe': {
  intro: 'Im Landkreis Karlsruhe möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Bruchsal', 'Bretten', 'Ettlingen', 'Waghäusel', 'Stutensee', 'Rheinstetten', 'Philippsburg'],
  licensePlates: ['KA', 'BR'],
  painPoint: 'Gerade im Landkreis Karlsruhe kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA oder BR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-konstanz': {
  intro: 'Im Landkreis Konstanz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Konstanz', 'Singen', 'Radolfzell', 'Stockach', 'Engen', 'Rielasingen-Worblingen', 'Gottmadingen'],
  licensePlates: ['KN', 'BÜS', 'STO'],
  painPoint: 'Gerade im Landkreis Konstanz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KN, BÜS oder STO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-loerrach': {
  intro: 'Im Landkreis Lörrach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Lörrach', 'Weil am Rhein', 'Rheinfelden', 'Schopfheim', 'Kandern', 'Grenzach-Wyhlen', 'Steinen'],
  licensePlates: ['LÖ'],
  painPoint: 'Gerade im Landkreis Lörrach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-ludwigsburg': {
  intro: 'Im Landkreis Ludwigsburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Ludwigsburg', 'Bietigheim-Bissingen', 'Kornwestheim', 'Vaihingen an der Enz', 'Ditzingen', 'Remseck', 'Marbach'],
  licensePlates: ['LB', 'VAI'],
  painPoint: 'Gerade im Landkreis Ludwigsburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LB oder VAI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-rastatt': {
  intro: 'Im Landkreis Rastatt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Rastatt', 'Gaggenau', 'Bühl', 'Gernsbach', 'Kuppenheim', 'Ötigheim', 'Bietigheim'],
  licensePlates: ['RA', 'BH'],
  painPoint: 'Gerade im Landkreis Rastatt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RA oder BH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-ravensburg': {
  intro: 'Im Landkreis Ravensburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Ravensburg', 'Weingarten', 'Wangen im Allgäu', 'Leutkirch', 'Bad Waldsee', 'Isny', 'Aulendorf'],
  licensePlates: ['RV', 'WG'],
  painPoint: 'Gerade im Landkreis Ravensburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RV oder WG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-reutlingen': {
  intro: 'Im Landkreis Reutlingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Reutlingen', 'Metzingen', 'Münsingen', 'Pfullingen', 'Eningen', 'Bad Urach', 'Engstingen'],
  licensePlates: ['RT'],
  painPoint: 'Gerade im Landkreis Reutlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-rottweil': {
  intro: 'Im Landkreis Rottweil möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Rottweil', 'Schramberg', 'Oberndorf am Neckar', 'Sulz am Neckar', 'Dornhan', 'Dunningen', 'Zimmern ob Rottweil'],
  licensePlates: ['RW'],
  painPoint: 'Gerade im Landkreis Rottweil kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-schwaebisch-hall': {
  intro: 'Im Landkreis Schwäbisch Hall möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Schwäbisch Hall', 'Crailsheim', 'Gaildorf', 'Ilshofen', 'Blaufelden', 'Gerabronn', 'Kirchberg an der Jagst'],
  licensePlates: ['SHA', 'BK', 'CR'],
  painPoint: 'Gerade im Landkreis Schwäbisch Hall kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHA, BK oder CR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-sigmaringen': {
  intro: 'Im Landkreis Sigmaringen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Sigmaringen', 'Bad Saulgau', 'Mengen', 'Pfullendorf', 'Meßkirch', 'Gammertingen', 'Ostrach'],
  licensePlates: ['SIG', 'SLG'],
  painPoint: 'Gerade im Landkreis Sigmaringen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SIG oder SLG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-tuebingen': {
  intro: 'Im Landkreis Tübingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Tübingen', 'Rottenburg am Neckar', 'Mössingen', 'Ammerbuch', 'Dußlingen', 'Nehren', 'Ofterdingen'],
  licensePlates: ['TÜ'],
  painPoint: 'Gerade im Landkreis Tübingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-tuttlingen': {
  intro: 'Im Landkreis Tuttlingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wartezeiten oder Behördengänge.',
  districts: ['Tuttlingen', 'Spaichingen', 'Trossingen', 'Mühlheim an der Donau', 'Fridingen', 'Immendingen', 'Aldingen'],
  licensePlates: ['TUT'],
  painPoint: 'Gerade im Landkreis Tuttlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TUT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'landkreis-waldshut': {
  intro: 'Im Landkreis Waldshut möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Waldshut-Tiengen', 'Bad Säckingen', 'Laufenburg', 'Wehr', 'Bonndorf', 'Stühlingen', 'Klettgau'],
  licensePlates: ['WT', 'SÄK'],
  painPoint: 'Gerade im Landkreis Waldshut kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WT oder SÄK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

landsberg: {
  intro: 'In Landsberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder Wartezeiten einzuplanen.',
  districts: ['Landsberg am Lech', 'Pitzling', 'Erpfting', 'Ellighofen', 'Reisch', 'Kaufering', 'Pürgen'],
  licensePlates: ['LL'],
  painPoint: 'Gerade in Landsberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

landstuhl: {
  intro: 'In Landstuhl möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Landstuhl', 'Atzel', 'Melkerei', 'Ramstein', 'Kindsbach', 'Hauptstuhl', 'Mittelbrunn'],
  licensePlates: ['KL'],
  painPoint: 'Gerade in Landstuhl kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

langenau: {
  intro: 'In Langenau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Langenau', 'Albeck', 'Göttingen', 'Hörvelsingen', 'Witthau', 'Elchingen', 'Rammingen'],
  licensePlates: ['UL'],
  painPoint: 'Gerade in Langenau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

lauf: {
  intro: 'In Lauf möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Lauf an der Pegnitz', 'Beerbach', 'Heuchling', 'Neunhof', 'Simonshofen', 'Schönberg', 'Dehnberg'],
  licensePlates: ['LAU', 'ESB', 'HEB', 'N', 'PEG'],
  painPoint: 'Gerade in Lauf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LAU, ESB, HEB, N oder PEG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

lauffen: {
  intro: 'In Lauffen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Lauffen am Neckar', 'Dorf', 'Stadt', 'Neckarwestheim', 'Talheim', 'Nordheim', 'Ilsfeld'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Lauffen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'lauffen-stadt': {
  intro: 'In Lauffen Stadt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge.',
  districts: ['Lauffen Stadt', 'Lauffen Dorf', 'Neckarwestheim', 'Nordheim', 'Talheim', 'Ilsfeld', 'Kirchheim am Neckar'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Lauffen Stadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

laupheim: {
  intro: 'In Laupheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Laupheim', 'Baustetten', 'Bihlafingen', 'Obersulmetingen', 'Untersulmetingen', 'Baltringen', 'Mietingen'],
  licensePlates: ['BC'],
  painPoint: 'Gerade in Laupheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lauterbach: {
  intro: 'In Lauterbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Lauterbach', 'Blitzenrod', 'Frischborn', 'Maar', 'Reuters', 'Sickendorf', 'Wallenrod'],
  licensePlates: ['VB'],
  painPoint: 'Gerade in Lauterbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

leer: {
  intro: 'In Leer möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder Wartezeit einzuplanen.',
  districts: ['Leer', 'Heisfelde', 'Loga', 'Logabirum', 'Bingum', 'Nüttermoor', 'Leerort'],
  licensePlates: ['LER'],
  painPoint: 'Gerade in Leer kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LER abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

leinfelden: {
  intro: 'In Leinfelden möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Leinfelden', 'Echterdingen', 'Musberg', 'Stetten', 'Oberaichen', 'Unteraichen', 'Fasanenhof'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade in Leinfelden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

leingarten: {
  intro: 'In Leingarten möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Großgartach', 'Schluchtern', 'Leingarten', 'Nordheim', 'Schwaigern', 'Heilbronn-Klingenberg', 'Böckingen'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Leingarten kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

leipzig: {
  intro: 'In Leipzig möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Zentrum', 'Plagwitz', 'Connewitz', 'Gohlis', 'Lindenau', 'Reudnitz', 'Stötteritz'],
  licensePlates: ['L'],
  painPoint: 'Gerade in Leipzig kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen L abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lemgo: {
  intro: 'In Lemgo möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Lemgo', 'Brake', 'Lieme', 'Entrup', 'Leese', 'Lüerdissen', 'Voßheide'],
  licensePlates: ['LIP'],
  painPoint: 'Gerade in Lemgo kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LIP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lennestadt: {
  intro: 'In Lennestadt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Altenhundem', 'Meggen', 'Grevenbrück', 'Elspe', 'Saalhausen', 'Kirchhundem', 'Maumke'],
  licensePlates: ['OE'],
  painPoint: 'Gerade in Lennestadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

lenting: {
  intro: 'In Lenting möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Lenting', 'Hepberg', 'Wettstetten', 'Gaimersheim', 'Kösching', 'Oberhaunstadt', 'Etting'],
  licensePlates: ['EI'],
  painPoint: 'Gerade in Lenting kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

leonberg: {
  intro: 'In Leonberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Leonberg', 'Eltingen', 'Gebersheim', 'Höfingen', 'Warmbronn', 'Ramtel', 'Silberberg'],
  licensePlates: ['BB', 'LEO'],
  painPoint: 'Gerade in Leonberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BB oder LEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

leopoldshafen: {
  intro: 'In Leopoldshafen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Leopoldshafen', 'Eggenstein', 'Linkenheim', 'Hochstetten', 'Staffort', 'Blankenloch', 'Friedrichstal'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Leopoldshafen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'leutkirch-im-allgaeu': {
  intro: 'In Leutkirch im Allgäu möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Leutkirch', 'Friesenhofen', 'Gebrazhofen', 'Herlazhofen', 'Hofs', 'Reichenhofen', 'Urlau'],
  licensePlates: ['RV', 'WG'],
  painPoint: 'Gerade in Leutkirch im Allgäu kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RV oder WG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

leverkusen: {
  intro: 'In Leverkusen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Wiesdorf', 'Opladen', 'Schlebusch', 'Manfort', 'Rheindorf', 'Küppersteg', 'Quettingen'],
  licensePlates: ['LEV'],
  painPoint: 'Gerade in Leverkusen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LEV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lichtenfels: {
  intro: 'In Lichtenfels möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Lichtenfels', 'Seubelsdorf', 'Schney', 'Reundorf', 'Isling', 'Klosterlangheim', 'Buch am Forst'],
  licensePlates: ['LIF', 'STE'],
  painPoint: 'Gerade in Lichtenfels kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LIF oder STE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

limburg: {
  intro: 'In Limburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Limburg', 'Staffel', 'Dietkirchen', 'Eschhofen', 'Lindenholzhausen', 'Offheim', 'Ahlbach'],
  licensePlates: ['LM', 'WEL'],
  painPoint: 'Gerade in Limburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LM oder WEL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

lindau: {
  intro: 'In Lindau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Insel', 'Aeschach', 'Reutin', 'Hoyren', 'Zech', 'Bad Schachen', 'Oberreitnau'],
  licensePlates: ['LI'],
  painPoint: 'Gerade in Lindau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lingen: {
  intro: 'In Lingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Lingen', 'Laxten', 'Darme', 'Baccum', 'Bramsche', 'Holthausen', 'Schepsdorf'],
  licensePlates: ['EL'],
  painPoint: 'Gerade in Lingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'linkenheim-hochstetten': {
  intro: 'In Linkenheim-Hochstetten möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Behörde fahren zu müssen.',
  districts: ['Linkenheim', 'Hochstetten', 'Leopoldshafen', 'Eggenstein', 'Graben-Neudorf', 'Dettenheim', 'Friedrichstal'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Linkenheim-Hochstetten kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

linsengericht: {
  intro: 'In Linsengericht möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Altenhaßlau', 'Eidengesäß', 'Geislitz', 'Großenhausen', 'Lützelhausen', 'Gelnhausen', 'Freigericht'],
  licensePlates: ['MKK', 'GN', 'SLÜ'],
  painPoint: 'Gerade in Linsengericht kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MKK, GN oder SLÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lippe: {
  intro: 'Im Kreis Lippe möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Detmold', 'Lemgo', 'Bad Salzuflen', 'Lage', 'Blomberg', 'Horn-Bad Meinberg', 'Oerlinghausen'],
  licensePlates: ['LIP'],
  painPoint: 'Gerade im Kreis Lippe kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LIP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lippstadt: {
  intro: 'In Lippstadt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder Wartezeiten einzuplanen.',
  districts: ['Kernstadt', 'Cappel', 'Bad Waldliesborn', 'Lipperode', 'Eickelborn', 'Benninghausen', 'Esbeck'],
  licensePlates: ['SO', 'LP'],
  painPoint: 'Gerade in Lippstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SO oder LP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

loebau: {
  intro: 'In Löbau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Löbau', 'Ebersdorf', 'Kittlitz', 'Oppeln', 'Rosenhain', 'Großdehsa', 'Georgewitz'],
  licensePlates: ['GR', 'LÖB', 'ZI', 'NOL', 'WSW'],
  painPoint: 'Gerade in Löbau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GR, LÖB, ZI, NOL oder WSW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lohr: {
  intro: 'In Lohr möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Lohr am Main', 'Sackenbach', 'Sendelbach', 'Wombach', 'Rodenbach', 'Steinbach', 'Pflochsbach'],
  licensePlates: ['MSP', 'GEM', 'LOH', 'MAR'],
  painPoint: 'Gerade in Lohr kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSP, GEM, LOH oder MAR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

loerrach: {
  intro: 'In Lörrach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Stetten', 'Tumringen', 'Haagen', 'Hauingen', 'Brombach', 'Tüllingen'],
  licensePlates: ['LÖ'],
  painPoint: 'Gerade in Lörrach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

luebbecke: {
  intro: 'In Lübbecke möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Lübbecke', 'Blasheim', 'Gehlenbeck', 'Eilhausen', 'Nettelstedt', 'Obermehnen', 'Stockhausen'],
  licensePlates: ['MI'],
  painPoint: 'Gerade in Lübbecke kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

luebben: {
  intro: 'In Lübben möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Lübben', 'Steinkirchen', 'Treppendorf', 'Neuendorf', 'Hartmannsdorf', 'Radensdorf', 'Lubolz'],
  licensePlates: ['LDS', 'KW', 'LC', 'LN'],
  painPoint: 'Gerade in Lübben kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LDS, KW, LC oder LN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

luebeck: {
  intro: 'In Lübeck möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'St. Lorenz', 'St. Jürgen', 'Moisling', 'Buntekuh', 'Travemünde', 'Kücknitz'],
  licensePlates: ['HL'],
  painPoint: 'Gerade in Lübeck kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'luechow-dannenberg': {
  intro: 'Im Landkreis Lüchow-Dannenberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Lüchow', 'Dannenberg', 'Hitzacker', 'Wustrow', 'Gartow', 'Clenze', 'Waddeweitz'],
  licensePlates: ['DAN'],
  painPoint: 'Gerade im Landkreis Lüchow-Dannenberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DAN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

luckau: {
  intro: 'In Luckau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Luckau', 'Cahnsdorf', 'Duben', 'Gießmannsdorf', 'Görlsdorf', 'Karche-Zaacko', 'Uckro'],
  licensePlates: ['LDS', 'KW', 'LC', 'LN'],
  painPoint: 'Gerade in Luckau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LDS, KW, LC oder LN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

luckenwalde: {
  intro: 'In Luckenwalde möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Luckenwalde', 'Frankenfelde', 'Kolkzenburg', 'Jüterbog', 'Trebbin', 'Nuthe-Urstromtal', 'Woltersdorf'],
  licensePlates: ['TF', 'LUK', 'ZS'],
  painPoint: 'Gerade in Luckenwalde kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TF, LUK oder ZS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

luedenscheid: {
  intro: 'In Lüdenscheid möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder Wartezeiten einzuplanen.',
  districts: ['Zentrum', 'Brügge', 'Gevelndorf', 'Oeneking', 'Wehberg', 'Buckesfeld', 'Wettringhof'],
  licensePlates: ['MK', 'LS'],
  painPoint: 'Gerade in Lüdenscheid kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MK oder LS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

luedinghausen: {
  intro: 'In Lüdinghausen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Lüdinghausen', 'Seppenrade', 'Bechtrup', 'Tüllinghoff', 'Ondrup', 'Ascheberg', 'Senden'],
  licensePlates: ['COE', 'LH'],
  painPoint: 'Gerade in Lüdinghausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen COE oder LH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

ludwigsburg: {
  intro: 'In Ludwigsburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Mitte', 'Eglosheim', 'Hoheneck', 'Oßweil', 'Pflugfelden', 'Poppenweiler', 'Neckarweihingen'],
  licensePlates: ['LB', 'VAI'],
  painPoint: 'Gerade in Ludwigsburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LB oder VAI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

ludwigshafen: {
  intro: 'In Ludwigshafen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Mitte', 'Oggersheim', 'Friesenheim', 'Mundenheim', 'Oppau', 'Rheingönheim', 'Gartenstadt'],
  licensePlates: ['LU'],
  painPoint: 'Gerade in Ludwigshafen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ludwigshafen-am-rhein': {
  intro: 'In Ludwigshafen am Rhein möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Mitte', 'Oggersheim', 'Friesenheim', 'Mundenheim', 'Oppau', 'Rheingönheim', 'Maudach'],
  licensePlates: ['LU'],
  painPoint: 'Gerade in Ludwigshafen am Rhein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ludwigslust-parchim': {
  intro: 'Im Landkreis Ludwigslust-Parchim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Behörde.',
  districts: ['Ludwigslust', 'Parchim', 'Hagenow', 'Boizenburg', 'Lübz', 'Sternberg', 'Grabow'],
  licensePlates: ['LUP', 'HGN', 'LBZ', 'LWL', 'PCH', 'STB'],
  painPoint: 'Gerade im Landkreis Ludwigslust-Parchim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LUP, HGN, LBZ, LWL, PCH oder STB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

lueneburg: {
  intro: 'In Lüneburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Altstadt', 'Kaltenmoor', 'Oedeme', 'Rettmer', 'Häcklingen', 'Goseburg', 'Ebensberg'],
  licensePlates: ['LG'],
  painPoint: 'Gerade in Lüneburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

luenen: {
  intro: 'In Lünen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Mitte', 'Brambauer', 'Horstmar', 'Alstedde', 'Nordlünen', 'Gahmen', 'Wethmar'],
  licensePlates: ['UN', 'LÜN'],
  painPoint: 'Gerade in Lünen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UN oder LÜN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

main-spessart: {
  intro: 'Im Landkreis Main-Spessart möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Karlstadt', 'Lohr am Main', 'Marktheidenfeld', 'Gemünden am Main', 'Arnstein', 'Rieneck', 'Zellingen'],
  licensePlates: ['MSP', 'GEM', 'LOH', 'MAR'],
  painPoint: 'Gerade im Landkreis Main-Spessart kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSP, GEM, LOH oder MAR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

main-tauber: {
  intro: 'Im Main-Tauber-Kreis möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Tauberbischofsheim', 'Bad Mergentheim', 'Wertheim', 'Lauda-Königshofen', 'Weikersheim', 'Boxberg', 'Creglingen'],
  licensePlates: ['TBB', 'MGH'],
  painPoint: 'Gerade im Main-Tauber-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TBB oder MGH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

main-tauber-kreis: {
  intro: 'Im Main-Tauber-Kreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Tauberbischofsheim', 'Bad Mergentheim', 'Wertheim', 'Lauda-Königshofen', 'Weikersheim', 'Külsheim', 'Niederstetten'],
  licensePlates: ['TBB', 'MGH'],
  painPoint: 'Gerade im Main-Tauber-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TBB oder MGH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

mainburg: {
  intro: 'In Mainburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Mainburg', 'Sandelzhausen', 'Ebrantshausen', 'Meilenhofen', 'Oberempfenbach', 'Steinbach', 'Lindkirchen'],
  licensePlates: ['KEH', 'MAI'],
  painPoint: 'Gerade in Mainburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KEH oder MAI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

mainz: {
  intro: 'In Mainz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Altstadt', 'Neustadt', 'Gonsenheim', 'Bretzenheim', 'Mombach', 'Hechtsheim', 'Finthen'],
  licensePlates: ['MZ'],
  painPoint: 'Gerade in Mainz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

mainz-bingen: {
  intro: 'Im Landkreis Mainz-Bingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Ingelheim am Rhein', 'Bingen am Rhein', 'Nieder-Olm', 'Budenheim', 'Oppenheim', 'Nierstein', 'Bodenheim'],
  licensePlates: ['MZ', 'BIN'],
  painPoint: 'Gerade im Landkreis Mainz-Bingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MZ oder BIN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

malsch: {
  intro: 'In Malsch möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Malsch', 'Sulzbach', 'Völkersbach', 'Waldprechtsweier', 'Ettlingen', 'Rheinstetten', 'Muggensturm'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Malsch kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

mannheim: {
  intro: 'In Mannheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Neckarstadt', 'Lindenhof', 'Feudenheim', 'Käfertal', 'Sandhofen', 'Rheinau'],
  licensePlates: ['MA'],
  painPoint: 'Gerade in Mannheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

marburg: {
  intro: 'In Marburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Innenstadt', 'Weidenhausen', 'Cappel', 'Marbach', 'Ockershausen', 'Wehrda', 'Gisselberg'],
  licensePlates: ['MR', 'BID'],
  painPoint: 'Gerade in Marburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MR oder BID abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

march: {
  intro: 'In March möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Hugstetten', 'Buchheim', 'Holzhausen', 'Neuershausen', 'Umkirch', 'Gottenheim', 'Bötzingen'],
  licensePlates: ['FR'],
  painPoint: 'Gerade in March kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

marienberg: {
  intro: 'In Marienberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege zur Zulassungsstelle.',
  districts: ['Marienberg', 'Gebirge', 'Gelobtland', 'Lauta', 'Pobershau', 'Rübenau', 'Zöblitz'],
  licensePlates: ['ERZ', 'ANA', 'ASZ', 'AU', 'MAB', 'MEK', 'STL', 'SZB', 'ZP'],
  painPoint: 'Gerade in Marienberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ERZ, ANA, ASZ, AU, MAB, MEK, STL, SZB oder ZP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

markdorf: {
  intro: 'In Markdorf möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Markdorf', 'Ittendorf', 'Riedheim', 'Möggenweiler', 'Hepbach', 'Kluftern', 'Bermatingen'],
  licensePlates: ['FN', 'TT', 'ÜB'],
  painPoint: 'Gerade in Markdorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FN, TT oder ÜB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

maerkischer-kreis: {
  intro: 'Im Märkischen Kreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Lüdenscheid', 'Iserlohn', 'Menden', 'Hemer', 'Plettenberg', 'Altena', 'Werdohl'],
  licensePlates: ['MK', 'IS', 'LS'],
  painPoint: 'Gerade im Märkischen Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MK, IS oder LS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

marktheidenfeld: {
  intro: 'In Marktheidenfeld möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Marktheidenfeld', 'Altfeld', 'Glasofen', 'Marienbrunn', 'Michelrieth', 'Zimmern', 'Karbach'],
  licensePlates: ['MSP', 'GEM', 'LOH', 'MAR'],
  painPoint: 'Gerade in Marktheidenfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSP, GEM, LOH oder MAR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

marktoberdorf: {
  intro: 'In Marktoberdorf möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Marktoberdorf', 'Bertoldshofen', 'Geisenried', 'Leuterschach', 'Rieder', 'Thalhofen', 'Sulzschneid'],
  licensePlates: ['OAL', 'FÜS', 'MOD'],
  painPoint: 'Gerade in Marktoberdorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OAL, FÜS oder MOD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

marl: {
  intro: 'In Marl möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Marl-Mitte', 'Hüls', 'Brassert', 'Drewer', 'Polsum', 'Sinsen', 'Lenkerbeck'],
  licensePlates: ['RE', 'CAS', 'GLA'],
  painPoint: 'Gerade in Marl kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RE, CAS oder GLA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

mayen: {
  intro: 'In Mayen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder unnötige Wege.',
  districts: ['Mayen', 'Alzheim', 'Hausen', 'Kürrenberg', 'Nitztal', 'Polch', 'Mendig'],
  licensePlates: ['MYK', 'MY'],
  painPoint: 'Gerade in Mayen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MYK oder MY abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

mayen-koblenz: {
  intro: 'Im Landkreis Mayen-Koblenz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Mayen', 'Andernach', 'Bendorf', 'Mendig', 'Polch', 'Mülheim-Kärlich', 'Vallendar'],
  licensePlates: ['MYK', 'MY'],
  painPoint: 'Gerade im Landkreis Mayen-Koblenz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MYK oder MY abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

meckenbeuren: {
  intro: 'In Meckenbeuren möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Meckenbeuren', 'Brochenzell', 'Kehlen', 'Liebenau', 'Buch', 'Reute', 'Tettnang'],
  licensePlates: ['FN', 'TT', 'ÜB'],
  painPoint: 'Gerade in Meckenbeuren kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FN, TT oder ÜB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

meckenheim: {
  intro: 'In Meckenheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Alt-Meckenheim', 'Merl', 'Lüftelberg', 'Ersdorf', 'Altendorf', 'Rheinbach', 'Wachtberg'],
  licensePlates: ['SU'],
  painPoint: 'Gerade in Meckenheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

mecklenburgische-seenplatte: {
  intro: 'Im Landkreis Mecklenburgische Seenplatte möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege durch die Region.',
  districts: ['Neubrandenburg', 'Waren', 'Neustrelitz', 'Demmin', 'Malchin', 'Röbel', 'Altentreptow'],
  licensePlates: ['MSE', 'AT', 'DM', 'MC', 'MÜR', 'NZ', 'RM', 'WRN'],
  painPoint: 'Gerade im Landkreis Mecklenburgische Seenplatte kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSE, AT, DM, MC, MÜR, NZ, RM oder WRN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

meerbusch: {
  intro: 'In Meerbusch möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Büderich', 'Osterath', 'Lank-Latum', 'Strümp', 'Nierst', 'Ossum-Bösinghoven', 'Langst-Kierst'],
  licensePlates: ['NE', 'GV'],
  painPoint: 'Gerade in Meerbusch kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NE oder GV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

meiningen: {
  intro: 'In Meiningen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Meiningen', 'Dreißigacker', 'Herpf', 'Walldorf', 'Helba', 'Sülzfeld', 'Wasungen'],
  licensePlates: ['SM', 'MGN'],
  painPoint: 'Gerade in Meiningen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SM oder MGN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

meissen: {
  intro: 'In Meißen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Altstadt', 'Cölln', 'Niederfähre', 'Triebischtal', 'Zaschendorf', 'Spaar', 'Siebeneichen'],
  licensePlates: ['MEI', 'GRH', 'RG', 'RIE'],
  painPoint: 'Gerade in Meißen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MEI, GRH, RG oder RIE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

melle: {
  intro: 'In Melle möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Melle-Mitte', 'Buer', 'Riemsloh', 'Wellingholzhausen', 'Neuenkirchen', 'Oldendorf', 'Bruchmühlen'],
  licensePlates: ['OS', 'BSB', 'MEL', 'WTL'],
  painPoint: 'Gerade in Melle kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OS, BSB, MEL oder WTL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

mellrichstadt: {
  intro: 'In Mellrichstadt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Mellrichstadt', 'Frickenhausen', 'Eußenhausen', 'Mühlfeld', 'Roßrieth', 'Sondheim', 'Stockheim'],
  licensePlates: ['NES', 'KÖN', 'MET'],
  painPoint: 'Gerade in Mellrichstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NES, KÖN oder MET abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

melsungen: {
  intro: 'In Melsungen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Melsungen', 'Röhrenfurth', 'Obermelsungen', 'Kehrenbach', 'Kirchhof', 'Günsterode', 'Felsberg'],
  licensePlates: ['HR', 'FZ', 'MEG', 'ZIG'],
  painPoint: 'Gerade in Melsungen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HR, FZ, MEG oder ZIG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

memmingen: {
  intro: 'In Memmingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Amendingen', 'Dickenreishausen', 'Eisenburg', 'Steinheim', 'Buxach', 'Volkratshofen'],
  licensePlates: ['MM'],
  painPoint: 'Gerade in Memmingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

memmingen-amendingen: {
  intro: 'In Memmingen-Amendingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Amendingen', 'Memmingen-Innenstadt', 'Steinheim', 'Eisenburg', 'Buxach', 'Volkratshofen', 'Dickenreishausen'],
  licensePlates: ['MM'],
  painPoint: 'Gerade in Memmingen-Amendingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

meppen: {
  intro: 'In Meppen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Meppen', 'Esterfeld', 'Neustadt', 'Nödike', 'Hemsen', 'Schwefingen', 'Versen'],
  licensePlates: ['EL'],
  painPoint: 'Gerade in Meppen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

merseburg: {
  intro: 'In Merseburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin oder Wartezeiten einzuplanen.',
  districts: ['Merseburg', 'Meuschau', 'Beuna', 'Geusa', 'Blösien', 'Trebnitz', 'Frankleben'],
  licensePlates: ['SK', 'MER', 'MQ', 'QFT'],
  painPoint: 'Gerade in Merseburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SK, MER, MQ oder QFT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

merzig: {
  intro: 'In Merzig möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Merzig', 'Besseringen', 'Brotdorf', 'Fitten', 'Harlingen', 'Hilbringen', 'Schwemlingen'],
  licensePlates: ['MZG'],
  painPoint: 'Gerade in Merzig kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MZG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

merzig-wadern: {
  intro: 'Im Landkreis Merzig-Wadern möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Merzig', 'Wadern', 'Losheim am See', 'Mettlach', 'Perl', 'Beckingen', 'Weiskirchen'],
  licensePlates: ['MZG'],
  painPoint: 'Gerade im Landkreis Merzig-Wadern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MZG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

meschede: {
  intro: 'In Meschede möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Meschede', 'Freienohl', 'Wennemen', 'Eversberg', 'Calle', 'Berge', 'Remblinghausen'],
  licensePlates: ['HSK', 'ARN', 'BRI', 'MES'],
  painPoint: 'Gerade in Meschede kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HSK, ARN, BRI oder MES abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

mettmann: {
  intro: 'Im Kreis Mettmann möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Mettmann', 'Ratingen', 'Velbert', 'Hilden', 'Langenfeld', 'Erkrath', 'Monheim am Rhein'],
  licensePlates: ['ME'],
  painPoint: 'Gerade im Kreis Mettmann kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ME abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

metzingen: {
  intro: 'In Metzingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Metzingen', 'Neuhausen', 'Glems', 'Riederich', 'Grafenberg', 'Dettingen an der Erms', 'Bad Urach'],
  licensePlates: ['RT'],
  painPoint: 'Gerade in Metzingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

miesbach: {
  intro: 'In Miesbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Miesbach', 'Parsberg', 'Wallenburg', 'Wies', 'Hausham', 'Schliersee', 'Irschenberg'],
  licensePlates: ['MB'],
  painPoint: 'Gerade in Miesbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

miltenberg: {
  intro: 'Im Landkreis Miltenberg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Miltenberg', 'Obernburg', 'Erlenbach', 'Elsenfeld', 'Klingenberg', 'Amorbach', 'Bürgstadt'],
  licensePlates: ['MIL', 'OBB'],
  painPoint: 'Gerade im Landkreis Miltenberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MIL oder OBB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

mindelheim: {
  intro: 'In Mindelheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Mindelheim', 'Nassenbeuren', 'Gernstall', 'Heimenegg', 'Unterauerbach', 'Westernach', 'Unggenried'],
  licensePlates: ['MN'],
  painPoint: 'Gerade in Mindelheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

minden: {
  intro: 'In Minden möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Bärenkämpen', 'Dützen', 'Hahlen', 'Kutenhausen', 'Leteln', 'Todtenhausen'],
  licensePlates: ['MI'],
  painPoint: 'Gerade in Minden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

minden-luebbecke: {
  intro: 'Im Kreis Minden-Lübbecke möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Minden', 'Lübbecke', 'Bad Oeynhausen', 'Porta Westfalica', 'Espelkamp', 'Petershagen', 'Stemwede'],
  licensePlates: ['MI'],
  painPoint: 'Gerade im Kreis Minden-Lübbecke kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

mittelsachsen: {
  intro: 'Im Landkreis Mittelsachsen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege durch die Region.',
  districts: ['Freiberg', 'Döbeln', 'Mittweida', 'Hainichen', 'Flöha', 'Brand-Erbisdorf', 'Frankenberg'],
  licensePlates: ['FG', 'BED', 'DL', 'FLÖ', 'HC', 'MW', 'RL'],
  painPoint: 'Gerade im Landkreis Mittelsachsen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FG, BED, DL, FLÖ, HC, MW oder RL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

mittweida: {
  intro: 'In Mittweida möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Mittweida', 'Ringethal', 'Frankenau', 'Lauenhain', 'Tanneberg', 'Altmittweida', 'Kriebstein'],
  licensePlates: ['FG', 'BED', 'DL', 'FLÖ', 'HC', 'MW', 'RL'],
  painPoint: 'Gerade in Mittweida kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FG, BED, DL, FLÖ, HC, MW oder RL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

moers: {
  intro: 'In Moers möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Moers-Mitte', 'Asberg', 'Kapellen', 'Meerbeck', 'Repelen', 'Rheinkamp', 'Schwafheim'],
  licensePlates: ['WES', 'DIN', 'MO'],
  painPoint: 'Gerade in Moers kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WES, DIN oder MO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

moenchengladbach: {
  intro: 'In Mönchengladbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Rheydt', 'Eicken', 'Wickrath', 'Odenkirchen', 'Hardt', 'Giesenkirchen', 'Neuwerk'],
  licensePlates: ['MG'],
  painPoint: 'Gerade in Mönchengladbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

monschau: {
  intro: 'In Monschau möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Monschau', 'Imgenbroich', 'Konzen', 'Mützenich', 'Kalterherberg', 'Höfen', 'Rohren'],
  licensePlates: ['AC', 'MON'],
  painPoint: 'Gerade in Monschau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AC oder MON abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

montabaur: {
  intro: 'In Montabaur möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Montabaur', 'Elgendorf', 'Eschelbach', 'Ettersdorf', 'Horressen', 'Wirzenborn', 'Bladernheim'],
  licensePlates: ['WW'],
  painPoint: 'Gerade in Montabaur kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

moosburg: {
  intro: 'In Moosburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle fahren zu müssen.',
  districts: ['Moosburg an der Isar', 'Pfrombach', 'Aich', 'Thonstetten', 'Niederambach', 'Oberambach', 'Volkmannsdorferau'],
  licensePlates: ['FS'],
  painPoint: 'Gerade in Moosburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

morbach: {
  intro: 'In Morbach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Morbach', 'Gonzerath', 'Gutenthal', 'Hinzerath', 'Hundheim', 'Morscheid-Riedenburg', 'Weiperath'],
  licensePlates: ['WIL', 'BKS'],
  painPoint: 'Gerade in Morbach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WIL oder BKS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

muehlacker: {
  intro: 'In Mühlacker möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Mühlacker', 'Dürrmenz', 'Enzberg', 'Lienzingen', 'Lomersheim', 'Mühlhausen', 'Großglattbach'],
  licensePlates: ['PF'],
  painPoint: 'Gerade in Mühlacker kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'muehldorf-am-inn': {
  intro: 'In Mühldorf am Inn möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Mühldorf am Inn', 'Altmühldorf', 'Mößling', 'Hart', 'Mettenheim', 'Erharting', 'Polling'],
  licensePlates: ['MÜ'],
  painPoint: 'Gerade in Mühldorf am Inn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

muehlhausen: {
  intro: 'In Mühlhausen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Mühlhausen', 'Felchta', 'Görmar', 'Saalfeld', 'Windeberg', 'Höngeda', 'Seebach'],
  licensePlates: ['UH', 'LSZ', 'MHL'],
  painPoint: 'Gerade in Mühlhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UH, LSZ oder MHL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'muehlheim-am-main': {
  intro: 'In Mühlheim am Main möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Mühlheim', 'Dietesheim', 'Lämmerspiel', 'Offenbach-Bieber', 'Obertshausen', 'Heusenstamm', 'Maintal'],
  licensePlates: ['OF'],
  painPoint: 'Gerade in Mühlheim am Main kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'muelheim-an-der-ruhr': {
  intro: 'In Mülheim an der Ruhr möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Stadtmitte', 'Speldorf', 'Broich', 'Saarn', 'Heißen', 'Styrum', 'Dümpten'],
  licensePlates: ['MH'],
  painPoint: 'Gerade in Mülheim an der Ruhr kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

muellheim: {
  intro: 'In Müllheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Müllheim', 'Britzingen', 'Dattingen', 'Feldberg', 'Hügelheim', 'Niederweiler', 'Zunzingen'],
  licensePlates: ['FR', 'MÜL', 'NEU'],
  painPoint: 'Gerade in Müllheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR, MÜL oder NEU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

muenchen: {
  intro: 'In München möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder quer durch die Stadt zur Zulassungsstelle zu fahren.',
  districts: ['Schwabing', 'Sendling', 'Pasing', 'Moosach', 'Giesing', 'Laim', 'Bogenhausen'],
  licensePlates: ['M'],
  painPoint: 'Gerade in München kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Münchener Kennzeichen M abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

muensingen: {
  intro: 'In Münsingen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Münsingen', 'Auingen', 'Bichishausen', 'Buttenhausen', 'Dottingen', 'Gundelfingen', 'Hundesingen'],
  licensePlates: ['RT'],
  painPoint: 'Gerade in Münsingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

muenster: {
  intro: 'In Münster möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder Behördengänge.',
  districts: ['Altstadt', 'Gievenbeck', 'Hiltrup', 'Kinderhaus', 'Wolbeck', 'Roxel', 'Handorf'],
  licensePlates: ['MS'],
  painPoint: 'Gerade in Münster kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

mueritz: {
  intro: 'In der Müritz-Region möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Waren', 'Röbel', 'Malchow', 'Klink', 'Rechlin', 'Penzlin', 'Neustrelitz'],
  licensePlates: ['MSE', 'MÜR', 'WRN', 'NZ'],
  painPoint: 'Gerade in der Müritz-Region kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSE, MÜR, WRN oder NZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

nabburg: {
  intro: 'In Nabburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle fahren oder lange Wartezeiten einplanen zu müssen.',
  districts: ['Nabburg', 'Diendorf', 'Perschen', 'Brudersdorf', 'Neusath', 'Etzelhof', 'Schwarzenfeld'],
  licensePlates: ['SAD', 'NAB', 'BUL', 'NEN', 'OVI', 'ROD'],
  painPoint: 'Gerade in Nabburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SAD, NAB, BUL, NEN, OVI oder ROD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

nagold: {
  intro: 'In Nagold möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Nagold', 'Hochdorf', 'Iselshausen', 'Mindersbach', 'Pfrondorf', 'Schietingen', 'Vollmaringen'],
  licensePlates: ['CW'],
  painPoint: 'Gerade in Nagold kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

nauen: {
  intro: 'In Nauen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Nauen', 'Berge', 'Kienberg', 'Lietzow', 'Markee', 'Ribbeck', 'Wachow'],
  licensePlates: ['HVL', 'NAU', 'RN'],
  painPoint: 'Gerade in Nauen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HVL, NAU oder RN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

naumburg: {
  intro: 'In Naumburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Naumburg', 'Bad Kösen', 'Grochlitz', 'Henne', 'Flemmingen', 'Roßbach', 'Eulau'],
  licensePlates: ['BLK', 'HHM', 'NEB', 'NMB', 'WSF', 'ZZ'],
  painPoint: 'Gerade in Naumburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BLK, HHM, NEB, NMB, WSF oder ZZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neckar-odenwald-kreis: {
  intro: 'Im Neckar-Odenwald-Kreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege durch den Landkreis.',
  districts: ['Mosbach', 'Buchen', 'Adelsheim', 'Walldürn', 'Hardheim', 'Osterburken', 'Elztal'],
  licensePlates: ['MOS', 'BCH'],
  painPoint: 'Gerade im Neckar-Odenwald-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MOS oder BCH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neckarsulm: {
  intro: 'In Neckarsulm möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Neckarsulm', 'Amorbach', 'Dahenfeld', 'Obereisesheim', 'Heilbronn', 'Bad Friedrichshall', 'Erlenbach'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Neckarsulm kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

neresheim: {
  intro: 'In Neresheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Neresheim', 'Dorfmerkingen', 'Elchingen', 'Kösingen', 'Ohmenheim', 'Schweindorf', 'Stetten'],
  licensePlates: ['AA', 'GD'],
  painPoint: 'Gerade in Neresheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AA oder GD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neu-ulm: {
  intro: 'In Neu-Ulm möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Neu-Ulm', 'Ludwigsfeld', 'Offenhausen', 'Pfuhl', 'Reutti', 'Burlafingen', 'Gerlenhofen'],
  licensePlates: ['NU', 'ILL'],
  painPoint: 'Gerade in Neu-Ulm kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NU oder ILL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neubrandenburg: {
  intro: 'In Neubrandenburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Datzeberg', 'Reitbahnviertel', 'Oststadt', 'Südstadt', 'Ihlenfelder Vorstadt', 'Lindenberg'],
  licensePlates: ['MSE', 'NB', 'AT', 'DM', 'MC', 'MÜR', 'NZ', 'RM', 'WRN'],
  painPoint: 'Gerade in Neubrandenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSE, NB, AT, DM, MC, MÜR, NZ, RM oder WRN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neuburg: {
  intro: 'In Neuburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Neuburg an der Donau', 'Bittenbrunn', 'Feldkirchen', 'Joshofen', 'Ried', 'Bergen', 'Heinrichsheim'],
  licensePlates: ['ND', 'SOB'],
  painPoint: 'Gerade in Neuburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ND oder SOB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

neuburg-schrobenhausen: {
  intro: 'Im Landkreis Neuburg-Schrobenhausen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Neuburg an der Donau', 'Schrobenhausen', 'Burgheim', 'Rennertshofen', 'Karlshuld', 'Karlskron', 'Ehekirchen'],
  licensePlates: ['ND', 'SOB'],
  painPoint: 'Gerade im Landkreis Neuburg-Schrobenhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ND oder SOB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neuenbuerg: {
  intro: 'In Neuenbürg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Neuenbürg', 'Arnbach', 'Dennach', 'Waldrennach', 'Birkenfeld', 'Straubenhardt', 'Engelsbrand'],
  licensePlates: ['PF'],
  painPoint: 'Gerade in Neuenbürg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

neuenburg-am-rhein: {
  intro: 'In Neuenburg am Rhein möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Neuenburg am Rhein', 'Grißheim', 'Steinenstadt', 'Zienken', 'Müllheim', 'Buggingen', 'Auggen'],
  licensePlates: ['FR', 'MÜL', 'NEU'],
  painPoint: 'Gerade in Neuenburg am Rhein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR, MÜL oder NEU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neuenstadt-am-kocher: {
  intro: 'In Neuenstadt am Kocher möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Neuenstadt am Kocher', 'Bürg', 'Cleversulzbach', 'Kochertürn', 'Stein am Kocher', 'Gochsen', 'Hardthausen'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Neuenstadt am Kocher kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

neuhausen-auf-den-fildern-nuertingen: {
  intro: 'In Neuhausen auf den Fildern und Nürtingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Neuhausen auf den Fildern', 'Nürtingen', 'Oberensingen', 'Hardt', 'Zizishausen', 'Neckarhausen', 'Raidwangen'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade im Raum Neuhausen auf den Fildern und Nürtingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neumarkt-in-der-oberpfalz: {
  intro: 'In Neumarkt in der Oberpfalz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Neumarkt', 'Pölling', 'Stauf', 'Woffenbach', 'Holzheim', 'Hasenheide', 'Pelchenhofen'],
  licensePlates: ['NM', 'PAR'],
  painPoint: 'Gerade in Neumarkt in der Oberpfalz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NM oder PAR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

neumuenster: {
  intro: 'In Neumünster möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Tungendorf', 'Faldera', 'Gadeland', 'Einfeld', 'Wittorf', 'Böcklersiedlung'],
  licensePlates: ['NMS'],
  painPoint: 'Gerade in Neumünster kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NMS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neunkirchen: {
  intro: 'In Neunkirchen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Neunkirchen', 'Wiebelskirchen', 'Furpach', 'Hangard', 'Heinitz', 'Münchwies', 'Wellesweiler'],
  licensePlates: ['NK'],
  painPoint: 'Gerade in Neunkirchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

neuruppin: {
  intro: 'In Neuruppin möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Neuruppin', 'Alt Ruppin', 'Gildenhall', 'Treskow', 'Wuthenow', 'Bechlin', 'Krangen'],
  licensePlates: ['OPR', 'KY', 'NP', 'WK'],
  painPoint: 'Gerade in Neuruppin kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OPR, KY, NP oder WK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neustadt-an-der-aisch: {
  intro: 'In Neustadt an der Aisch möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Neustadt an der Aisch', 'Birkenfeld', 'Diebach', 'Herrnneuses', 'Kleinerlbach', 'Unternesselbach', 'Schauerheim'],
  licensePlates: ['NEA', 'SEF', 'UFF'],
  painPoint: 'Gerade in Neustadt an der Aisch kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NEA, SEF oder UFF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

neustadt-an-der-waldnaab: {
  intro: 'In Neustadt an der Waldnaab möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Neustadt an der Waldnaab', 'Mühlberg', 'Störnstein', 'Altenstadt', 'Theisseil', 'Windischeschenbach', 'Parkstein'],
  licensePlates: ['NEW', 'ESB', 'VOH'],
  painPoint: 'Gerade in Neustadt an der Waldnaab kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NEW, ESB oder VOH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neustadt-an-der-weinstrasse: {
  intro: 'In Neustadt an der Weinstraße möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Hambach', 'Gimmeldingen', 'Lachen-Speyerdorf', 'Diedesfeld', 'Mußbach', 'Königsbach'],
  licensePlates: ['NW'],
  painPoint: 'Gerade in Neustadt an der Weinstraße kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

neustrelitz: {
  intro: 'In Neustrelitz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Neustrelitz', 'Altstrelitz', 'Kiefernheide', 'Zierke', 'Klein Trebbow', 'Fürstensee', 'Userin'],
  licensePlates: ['MSE', 'NZ', 'MÜR', 'WRN'],
  painPoint: 'Gerade in Neustrelitz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSE, NZ, MÜR oder WRN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

neuwied: {
  intro: 'In Neuwied möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Innenstadt', 'Heddesdorf', 'Engers', 'Heimbach-Weis', 'Irlich', 'Niederbieber', 'Oberbieber'],
  licensePlates: ['NR'],
  painPoint: 'Gerade in Neuwied kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

niebuell: {
  intro: 'In Niebüll möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Niebüll', 'Deezbüll', 'Langstoft', 'Gath', 'Risum-Lindholm', 'Leck', 'Süderlügum'],
  licensePlates: ['NF'],
  painPoint: 'Gerade in Niebüll kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

niefern-oeschelbronn: {
  intro: 'In Niefern-Öschelbronn möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Niefern', 'Öschelbronn', 'Enzberg', 'Mühlacker', 'Kieselbronn', 'Eutingen', 'Wurmberg'],
  licensePlates: ['PF'],
  painPoint: 'Gerade in Niefern-Öschelbronn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

nienburg: {
  intro: 'In Nienburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Nienburg', 'Langendamm', 'Erichshagen', 'Holtorf', 'Schaumburg', 'Husum', 'Marklohe'],
  licensePlates: ['NI'],
  painPoint: 'Gerade in Nienburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

norden: {
  intro: 'In Norden möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Norden', 'Norddeich', 'Süderneuland', 'Leybuchtpolder', 'Westermarsch', 'Ostermarsch', 'Tidofeld'],
  licensePlates: ['AUR', 'NOR'],
  painPoint: 'Gerade in Norden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AUR oder NOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

norderstedt: {
  intro: 'In Norderstedt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Garstedt', 'Harksheide', 'Friedrichsgabe', 'Glashütte', 'Norderstedt-Mitte', 'Quickborn', 'Henstedt-Ulzburg'],
  licensePlates: ['SE'],
  painPoint: 'Gerade in Norderstedt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

nordhausen: {
  intro: 'In Nordhausen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Nordhausen', 'Salza', 'Niedersalza', 'Bielen', 'Sundhausen', 'Steinbrücken', 'Herreden'],
  licensePlates: ['NDH'],
  painPoint: 'Gerade in Nordhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NDH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

noerdlingen: {
  intro: 'In Nördlingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Nördlingen', 'Baldingen', 'Dürrenzimmern', 'Grosselfingen', 'Heroldingen', 'Kleinerdlingen', 'Löpsingen'],
  licensePlates: ['DON', 'NÖ'],
  painPoint: 'Gerade in Nördlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen DON oder NÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

nordrhein-westfalen: {
  intro: 'In Nordrhein-Westfalen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege, Termine oder Wartezeiten.',
  districts: ['Köln', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum', 'Münster'],
  licensePlates: ['K', 'D', 'DO', 'E', 'DU', 'BO', 'MS'],
  painPoint: 'Gerade in Nordrhein-Westfalen kosten Termine, Anfahrt und Wartezeit je nach Stadt oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug in Nordrhein-Westfalen abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

nordsachsen: {
  intro: 'Im Landkreis Nordsachsen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege durch den Landkreis.',
  districts: ['Torgau', 'Delitzsch', 'Eilenburg', 'Oschatz', 'Schkeuditz', 'Taucha', 'Bad Düben'],
  licensePlates: ['TDO', 'DZ', 'EB', 'OZ', 'TG'],
  painPoint: 'Gerade im Landkreis Nordsachsen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TDO, DZ, EB, OZ oder TG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

nordwestmecklenburg: {
  intro: 'Im Landkreis Nordwestmecklenburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Wismar', 'Grevesmühlen', 'Gadebusch', 'Neukloster', 'Schönberg', 'Dassow', 'Klütz'],
  licensePlates: ['NWM', 'GDB', 'GVM', 'WIS'],
  painPoint: 'Gerade im Landkreis Nordwestmecklenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NWM, GDB, GVM oder WIS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

northeim: {
  intro: 'In Northeim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder Wartezeiten.',
  districts: ['Northeim', 'Hammenstedt', 'Hillerse', 'Höckelheim', 'Langenholtensen', 'Sudheim', 'Edesheim'],
  licensePlates: ['NOM', 'EIN', 'GAN'],
  painPoint: 'Gerade in Northeim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NOM, EIN oder GAN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

nuernberg: {
  intro: 'In Nürnberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder lange Wartezeiten einzuplanen.',
  districts: ['Mitte', 'Gostenhof', 'Langwasser', 'Südstadt', 'St. Johannis', 'Mögeldorf', 'Ziegelstein'],
  licensePlates: ['N'],
  painPoint: 'Gerade in Nürnberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Nürnberger Kennzeichen N abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oberallgaeu': {
  intro: 'Im Oberallgäu möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege durch den Landkreis oder unnötige Wartezeiten.',
  districts: ['Sonthofen', 'Immenstadt', 'Oberstdorf', 'Waltenhofen', 'Blaichach', 'Fischen', 'Bad Hindelang'],
  licensePlates: ['OA', 'SF'],
  painPoint: 'Gerade im Oberallgäu kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OA oder SF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oberbergischer-kreis': {
  intro: 'Im Oberbergischen Kreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Gummersbach', 'Wiehl', 'Wipperfürth', 'Waldbröl', 'Engelskirchen', 'Bergneustadt', 'Marienheide'],
  licensePlates: ['GM', 'WIP'],
  painPoint: 'Gerade im Oberbergischen Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GM oder WIP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oberhausen': {
  intro: 'In Oberhausen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren oder lange Wartezeiten einzuplanen.',
  districts: ['Alt-Oberhausen', 'Sterkrade', 'Osterfeld', 'Schmachtendorf', 'Alstaden', 'Lirich', 'Buschhausen'],
  licensePlates: ['OB'],
  painPoint: 'Gerade in Oberhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Oberhausener Kennzeichen OB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oberhavel': {
  intro: 'Im Landkreis Oberhavel möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege durch den Landkreis oder unnötige Wartezeiten.',
  districts: ['Oranienburg', 'Hennigsdorf', 'Velten', 'Zehdenick', 'Gransee', 'Fürstenberg', 'Kremmen'],
  licensePlates: ['OHV', 'OR', 'GR'],
  painPoint: 'Gerade im Landkreis Oberhavel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OHV, OR oder GR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oberspreewald-lausitz': {
  intro: 'Im Landkreis Oberspreewald-Lausitz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Senftenberg', 'Lübbenau', 'Lauchhammer', 'Großräschen', 'Vetschau', 'Schwarzheide', 'Calau'],
  licensePlates: ['OSL', 'CA', 'SFB'],
  painPoint: 'Gerade im Landkreis Oberspreewald-Lausitz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OSL, CA oder SFB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'obersulm': {
  intro: 'In Obersulm möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Behördengänge oder lange Wartezeiten.',
  districts: ['Affaltrach', 'Eschenau', 'Sülzbach', 'Willsbach', 'Eichelberg', 'Weiler', 'Löwenstein'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Obersulm kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oberviechtach': {
  intro: 'In Oberviechtach möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Oberviechtach', 'Pirkhof', 'Lind', 'Obermurach', 'Teunz', 'Niedermurach', 'Winklarn'],
  licensePlates: ['SAD', 'NAB', 'BUL', 'NEN', 'OVI', 'ROD'],
  painPoint: 'Gerade in Oberviechtach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SAD, NAB, BUL, NEN, OVI oder ROD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ochsenfurt': {
  intro: 'In Ochsenfurt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle zu fahren oder lange Wartezeiten.',
  districts: ['Ochsenfurt', 'Kleinochsenfurt', 'Goßmannsdorf', 'Hopferstadt', 'Hohestadt', 'Tückelhausen', 'Zeubelried'],
  licensePlates: ['WÜ', 'OCH'],
  painPoint: 'Gerade in Ochsenfurt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WÜ oder OCH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ochsenhausen': {
  intro: 'In Ochsenhausen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Ochsenhausen', 'Reinstetten', 'Mittelbuch', 'Hattenburg', 'Edenbachen', 'Erolzheim', 'Erlenmoos'],
  licensePlates: ['BC'],
  painPoint: 'Gerade in Ochsenhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oder-spree': {
  intro: 'Im Landkreis Oder-Spree möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege durch den Landkreis oder unnötige Wartezeiten.',
  districts: ['Fürstenwalde', 'Eisenhüttenstadt', 'Beeskow', 'Erkner', 'Storkow', 'Schöneiche', 'Woltersdorf'],
  licensePlates: ['LOS', 'BSK', 'EH', 'FW'],
  painPoint: 'Gerade im Landkreis Oder-Spree kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LOS, BSK, EH oder FW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oldenburg': {
  intro: 'In Oldenburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Eversten', 'Kreyenbrück', 'Donnerschwee', 'Nadorst', 'Bloherfelde', 'Osternburg'],
  licensePlates: ['OL'],
  painPoint: 'Gerade in Oldenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Oldenburger Kennzeichen OL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'olpe': {
  intro: 'In Olpe möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder lange Wartezeiten.',
  districts: ['Olpe', 'Dahl', 'Rhode', 'Rüblinghausen', 'Saßmicke', 'Sondern', 'Stade'],
  licensePlates: ['OE'],
  painPoint: 'Gerade in Olpe kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oppenheim': {
  intro: 'In Oppenheim möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Oppenheim', 'Nierstein', 'Dienheim', 'Dexheim', 'Guntersblum', 'Nackenheim', 'Bodenheim'],
  licensePlates: ['MZ', 'BIN'],
  painPoint: 'Gerade in Oppenheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MZ oder BIN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oranienburg': {
  intro: 'In Oranienburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Oranienburg', 'Lehnitz', 'Sachsenhausen', 'Schmachtenhagen', 'Friedrichsthal', 'Zehlendorf', 'Malz'],
  licensePlates: ['OHV', 'OR'],
  painPoint: 'Gerade in Oranienburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OHV oder OR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ortenaukreis': {
  intro: 'Im Ortenaukreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege durch den Landkreis oder unnötige Wartezeiten.',
  districts: ['Offenburg', 'Lahr', 'Kehl', 'Achern', 'Oberkirch', 'Hausach', 'Wolfach'],
  licensePlates: ['OG', 'BH', 'KEL', 'LR', 'WOL'],
  painPoint: 'Gerade im Ortenaukreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OG, BH, KEL, LR oder WOL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oschatz': {
  intro: 'In Oschatz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin oder lange Wartezeiten einzuplanen.',
  districts: ['Oschatz', 'Altoschatz', 'Mannschatz', 'Merkwitz', 'Schmorkau', 'Thalheim', 'Zschöllau'],
  licensePlates: ['TDO', 'DZ', 'EB', 'OZ', 'TG'],
  painPoint: 'Gerade in Oschatz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TDO, DZ, EB, OZ oder TG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oschersleben': {
  intro: 'In Oschersleben möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Oschersleben', 'Hadmersleben', 'Hornhausen', 'Klein Oschersleben', 'Neindorf', 'Peseckendorf', 'Schermcke'],
  licensePlates: ['BK', 'BÖ', 'HDL', 'OC', 'WMS', 'WZL'],
  painPoint: 'Gerade in Oschersleben kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BK, BÖ, HDL, OC, WMS oder WZL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'osnabrueck': {
  intro: 'In Osnabrück möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Innenstadt', 'Wüste', 'Schinkel', 'Eversburg', 'Haste', 'Voxtrup', 'Hellern'],
  licensePlates: ['OS'],
  painPoint: 'Gerade in Osnabrück kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Osnabrücker Kennzeichen OS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ostalbkreis': {
  intro: 'Im Ostalbkreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege durch den Landkreis oder unnötige Wartezeiten.',
  districts: ['Aalen', 'Schwäbisch Gmünd', 'Ellwangen', 'Bopfingen', 'Heubach', 'Lorch', 'Neresheim'],
  licensePlates: ['AA', 'GD'],
  painPoint: 'Gerade im Ostalbkreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AA oder GD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'osterburg': {
  intro: 'In Osterburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten.',
  districts: ['Osterburg', 'Erxleben', 'Flessau', 'Krevese', 'Krumke', 'Meseberg', 'Rossau'],
  licensePlates: ['SDL', 'HV', 'OBG'],
  painPoint: 'Gerade in Osterburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SDL, HV oder OBG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'osterholz': {
  intro: 'Im Landkreis Osterholz möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Osterholz-Scharmbeck', 'Ritterhude', 'Lilienthal', 'Schwanewede', 'Worpswede', 'Hambergen', 'Grasberg'],
  licensePlates: ['OHZ'],
  painPoint: 'Gerade im Landkreis Osterholz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OHZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'osterode-am-harz': {
  intro: 'In Osterode am Harz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Osterode am Harz', 'Dorste', 'Förste', 'Lasfelde', 'Lerbach', 'Riefensbeek-Kamschlacken', 'Schwiegershausen'],
  licensePlates: ['GÖ', 'DUD', 'HMÜ', 'OHA'],
  painPoint: 'Gerade in Osterode am Harz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GÖ, DUD, HMÜ oder OHA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ostfildern': {
  intro: 'In Ostfildern möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Nellingen', 'Ruit', 'Kemnat', 'Scharnhausen', 'Parksiedlung', 'Scharnhauser Park', 'Esslingen'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade in Ostfildern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ostholstein': {
  intro: 'Im Kreis Ostholstein möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege durch den Kreis oder unnötige Wartezeiten.',
  districts: ['Eutin', 'Oldenburg in Holstein', 'Fehmarn', 'Neustadt in Holstein', 'Heiligenhafen', 'Timmendorfer Strand', 'Bad Schwartau'],
  licensePlates: ['OH'],
  painPoint: 'Gerade im Kreis Ostholstein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ostprignitz-ruppin': {
  intro: 'Im Landkreis Ostprignitz-Ruppin möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Neuruppin', 'Kyritz', 'Wittstock', 'Rheinsberg', 'Fehrbellin', 'Heiligengrabe', 'Wusterhausen'],
  licensePlates: ['OPR', 'KY', 'NP', 'WK'],
  painPoint: 'Gerade im Landkreis Ostprignitz-Ruppin kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OPR, KY, NP oder WK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ottweiler': {
  intro: 'In Ottweiler möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne unnötige Wege oder lange Wartezeiten.',
  districts: ['Ottweiler', 'Fürth', 'Lautenbach', 'Mainzweiler', 'Steinbach', 'Neunkirchen', 'Schiffweiler'],
  licensePlates: ['NK', 'OTW'],
  painPoint: 'Gerade in Ottweiler kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NK oder OTW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oehringen': {
  intro: 'In Öhringen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Öhringen', 'Baumerlenbach', 'Büttelbronn', 'Cappel', 'Eckartsweiler', 'Michelbach am Wald', 'Verrenberg'],
  licensePlates: ['KÜN', 'ÖHR'],
  painPoint: 'Gerade in Öhringen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KÜN oder ÖHR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oestringen': {
  intro: 'In Östringen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle zu fahren oder lange Wartezeiten.',
  districts: ['Östringen', 'Odenheim', 'Eichelberg', 'Tiefenbach', 'Ubstadt-Weiher', 'Kronau', 'Bad Schönborn'],
  licensePlates: ['KA', 'BR'],
  painPoint: 'Gerade in Östringen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA oder BR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'paderborn': {
  intro: 'In Paderborn möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Schloß Neuhaus', 'Elsen', 'Wewer', 'Sande', 'Marienloh', 'Dahl'],
  licensePlates: ['PB', 'BÜR'],
  painPoint: 'Gerade in Paderborn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PB oder BÜR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'parchim': {
  intro: 'In Parchim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Parchim', 'Damm', 'Slate', 'Neuhof', 'Pampin', 'Rom', 'Spornitz'],
  licensePlates: ['LUP', 'PCH'],
  painPoint: 'Gerade in Parchim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LUP oder PCH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'parsberg': {
  intro: 'In Parsberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Parsberg', 'Lupburg', 'Hohenfels', 'Seubersdorf', 'Velburg', 'Breitenbrunn', 'Dietfurt'],
  licensePlates: ['NM', 'PAR'],
  painPoint: 'Gerade in Parsberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NM oder PAR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pasewalk': {
  intro: 'In Pasewalk möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Pasewalk', 'Torgelow', 'Eggesin', 'Ueckermünde', 'Strasburg', 'Löcknitz', 'Jatznick'],
  licensePlates: ['VG', 'PW', 'UER', 'ANK', 'GW', 'WLG'],
  painPoint: 'Gerade in Pasewalk kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VG, PW, UER, ANK, GW oder WLG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'passau': {
  intro: 'In Passau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Altstadt', 'Innstadt', 'Haidenhof', 'Grubweg', 'Heining', 'Hacklberg', 'Neustift'],
  licensePlates: ['PA'],
  painPoint: 'Gerade in Passau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Passauer Kennzeichen PA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'peine': {
  intro: 'In Peine möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne erst einen Termin zu suchen oder lange Wartezeiten einzuplanen.',
  districts: ['Peine', 'Vöhrum', 'Stederdorf', 'Duttenstedt', 'Essinghausen', 'Rosenthal', 'Woltorf'],
  licensePlates: ['PE'],
  painPoint: 'Gerade in Peine kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'perleberg': {
  intro: 'In Perleberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Perleberg', 'Wittenberge', 'Karstädt', 'Bad Wilsnack', 'Groß Pankow', 'Plattenburg', 'Weisen'],
  licensePlates: ['PR'],
  painPoint: 'Gerade in Perleberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pfaffenhofen': {
  intro: 'In Pfaffenhofen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Pfaffenhofen an der Ilm', 'Reichertshausen', 'Hettenshausen', 'Ilmmünster', 'Wolnzach', 'Scheyern', 'Rohrbach'],
  licensePlates: ['PAF'],
  painPoint: 'Gerade in Pfaffenhofen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PAF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pfarrkirchen': {
  intro: 'In Pfarrkirchen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Pfarrkirchen', 'Eggenfelden', 'Simbach am Inn', 'Triftern', 'Bad Birnbach', 'Massing', 'Arnstorf'],
  licensePlates: ['PAN', 'EG', 'GRA', 'VIB'],
  painPoint: 'Gerade in Pfarrkirchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PAN, EG, GRA oder VIB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pforzheim': {
  intro: 'In Pforzheim möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Innenstadt', 'Brötzingen', 'Dillweißenstein', 'Eutingen', 'Huchenfeld', 'Würm', 'Büchenbronn'],
  licensePlates: ['PF'],
  painPoint: 'Gerade in Pforzheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Pforzheimer Kennzeichen PF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pfullendorf': {
  intro: 'In Pfullendorf möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Pfullendorf', 'Aach-Linz', 'Denkingen', 'Großstadelhofen', 'Mottschieß', 'Otterswang', 'Zell am Andelsbach'],
  licensePlates: ['SIG', 'SLG'],
  painPoint: 'Gerade in Pfullendorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SIG oder SLG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'philippsburg': {
  intro: 'In Philippsburg möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne extra zur Zulassungsstelle zu fahren oder lange Wartezeiten.',
  districts: ['Philippsburg', 'Huttenheim', 'Rheinsheim', 'Oberhausen-Rheinhausen', 'Waghäusel', 'Graben-Neudorf', 'Dettenheim'],
  licensePlates: ['KA', 'BR'],
  painPoint: 'Gerade in Philippsburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA oder BR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pinneberg': {
  intro: 'In Pinneberg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Pinneberg', 'Elmshorn', 'Wedel', 'Schenefeld', 'Quickborn', 'Uetersen', 'Tornesch'],
  licensePlates: ['PI'],
  painPoint: 'Gerade im Raum Pinneberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pirmasens': {
  intro: 'In Pirmasens möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wartezeiten oder unnötige Behördengänge.',
  districts: ['Innenstadt', 'Erlenbrunn', 'Fehrbach', 'Hengsberg', 'Niedersimten', 'Ruhbank', 'Winzeln'],
  licensePlates: ['PS'],
  painPoint: 'Gerade in Pirmasens kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Pirmasenser Kennzeichen PS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pirna': {
  intro: 'In Pirna möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Pirna', 'Copitz', 'Sonnenstein', 'Zehista', 'Graupa', 'Mockethal', 'Liebethal'],
  licensePlates: ['PIR', 'DW', 'FTL', 'SEB'],
  painPoint: 'Gerade in Pirna kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PIR, DW, FTL oder SEB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'plauen': {
  intro: 'In Plauen möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Innenstadt', 'Haselbrunn', 'Neundorf', 'Chrieschwitz', 'Reusa', 'Südvorstadt', 'Jößnitz'],
  licensePlates: ['V', 'AE', 'OVL', 'PL', 'RC'],
  painPoint: 'Gerade in Plauen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen V, AE, OVL, PL oder RC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'plochingen-weilheim-an-der-teck': {
  intro: 'In Plochingen und Weilheim an der Teck möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Plochingen', 'Weilheim an der Teck', 'Wernau', 'Deizisau', 'Altbach', 'Kirchheim unter Teck', 'Notzingen'],
  licensePlates: ['ES', 'NT'],
  painPoint: 'Gerade im Raum Plochingen und Weilheim an der Teck kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ES oder NT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ploen': {
  intro: 'Im Kreis Plön möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Plön', 'Preetz', 'Schönberg', 'Lütjenburg', 'Heikendorf', 'Laboe', 'Wankendorf'],
  licensePlates: ['PLÖ'],
  painPoint: 'Gerade im Kreis Plön kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PLÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pocking': {
  intro: 'In Pocking möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Pocking', 'Hartkirchen', 'Indling', 'Schönburg', 'Eggersham', 'Bad Füssing', 'Rotthalmünster'],
  licensePlates: ['PA'],
  painPoint: 'Gerade in Pocking kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'poessneck': {
  intro: 'In Pößneck möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Pößneck', 'Krölpa', 'Oppurg', 'Neustadt an der Orla', 'Triptis', 'Ranis', 'Ziegenrück'],
  licensePlates: ['SOK', 'LC', 'PN', 'SCZ'],
  painPoint: 'Gerade in Pößneck kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SOK, LC, PN oder SCZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'potsdam': {
  intro: 'In Potsdam möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder lange Wartezeiten einzuplanen.',
  districts: ['Innenstadt', 'Babelsberg', 'Bornstedt', 'Golm', 'Eiche', 'Waldstadt', 'Drewitz'],
  licensePlates: ['P'],
  painPoint: 'Gerade in Potsdam kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Potsdamer Kennzeichen P abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'potsdam-mittelmark': {
  intro: 'Im Landkreis Potsdam-Mittelmark möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege durch den Landkreis oder unnötige Wartezeiten.',
  districts: ['Bad Belzig', 'Werder', 'Teltow', 'Beelitz', 'Michendorf', 'Kleinmachnow', 'Stahnsdorf'],
  licensePlates: ['PM', 'BEL'],
  painPoint: 'Gerade im Landkreis Potsdam-Mittelmark kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PM oder BEL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'prenzlau': {
  intro: 'In Prenzlau möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Prenzlau', 'Dedelow', 'Blindow', 'Güstow', 'Schönwerder', 'Gramzow', 'Nordwestuckermark'],
  licensePlates: ['UM', 'ANG', 'PZ', 'SDT', 'TP'],
  painPoint: 'Gerade in Prenzlau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UM, ANG, PZ, SDT oder TP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'prignitz': {
  intro: 'Im Landkreis Prignitz möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege durch den Landkreis oder unnötige Wartezeiten.',
  districts: ['Perleberg', 'Wittenberge', 'Pritzwalk', 'Bad Wilsnack', 'Karstädt', 'Groß Pankow', 'Lenzen'],
  licensePlates: ['PR'],
  painPoint: 'Gerade im Landkreis Prignitz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pritzwalk': {
  intro: 'In Pritzwalk möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Pritzwalk', 'Alt Krüssow', 'Beveringen', 'Falkenhagen', 'Giesensdorf', 'Sadenbeck', 'Schönhagen'],
  licensePlates: ['PR'],
  painPoint: 'Gerade in Pritzwalk kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'pruem': {
  intro: 'In Prüm möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Prüm', 'Bleialf', 'Schönecken', 'Pronsfeld', 'Auw bei Prüm', 'Waxweiler', 'Olzheim'],
  licensePlates: ['BIT', 'PRÜ'],
  painPoint: 'Gerade in Prüm kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BIT oder PRÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'quedlinburg': {
  intro: 'In Quedlinburg möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne lange Wege oder unnötige Wartezeiten einzuplanen.',
  districts: ['Quedlinburg', 'Gernrode', 'Bad Suderode', 'Ditfurt', 'Thale', 'Ballenstedt', 'Harzgerode'],
  licensePlates: ['HZ', 'HBS', 'QLB', 'WR'],
  painPoint: 'Gerade in Quedlinburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HZ, HBS, QLB oder WR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'querfurt': {
  intro: 'In Querfurt möchten viele Fahrzeughalter ihr Auto schnell abmelden, ohne lange Wege oder unnötige Wartezeiten.',
  districts: ['Querfurt', 'Lodersleben', 'Gatterstädt', 'Leimbach', 'Obhausen', 'Barnstädt', 'Schraplau'],
  licensePlates: ['SK', 'MER', 'MQ', 'QFT'],
  painPoint: 'Gerade in Querfurt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SK, MER, MQ oder QFT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rastatt': {
  intro: 'In Rastatt möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne erst einen Termin zu suchen oder zur Zulassungsstelle zu fahren.',
  districts: ['Rastatt', 'Gaggenau', 'Bühl', 'Gernsbach', 'Kuppenheim', 'Bietigheim', 'Durmersheim'],
  licensePlates: ['RA', 'BH', 'BAD'],
  painPoint: 'Gerade in Rastatt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RA, BH oder BAD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Besonders bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel ist der digitale Ablauf eine bequeme Lösung.',
},

'rathenow': {
  intro: 'In Rathenow möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Rathenow', 'Premnitz', 'Milower Land', 'Nennhausen', 'Stechow-Ferchesar', 'Kotzen', 'Havelaue'],
  licensePlates: ['HVL', 'RN', 'NAU'],
  painPoint: 'Gerade in Rathenow kosten Wege, Termine und Wartezeit oft mehr Zeit als nötig.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HVL, RN oder NAU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Weg ist besonders praktisch, wenn die Abmeldung schnell und klar erledigt werden soll.',
},

'ravensburg': {
  intro: 'In Ravensburg möchten viele Fahrzeughalter ihr Auto bequem abmelden, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Ravensburg', 'Weingarten', 'Baienfurt', 'Baindt', 'Bodnegg', 'Grünkraut', 'Wangen im Allgäu'],
  licensePlates: ['RV', 'SLG', 'WG'],
  painPoint: 'Gerade in Ravensburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RV, SLG oder WG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Für Verkauf, Stilllegung oder Fahrzeugwechsel ist die Online-Abmeldung oft der einfachere Weg.',
},

'recklinghausen': {
  intro: 'In Recklinghausen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Recklinghausen', 'Marl', 'Dorsten', 'Herten', 'Oer-Erkenschwick', 'Castrop-Rauxel', 'Datteln'],
  licensePlates: ['RE', 'CAS', 'GLA'],
  painPoint: 'Gerade im Kreis Recklinghausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RE, CAS oder GLA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die digitale Abmeldung hilft besonders bei Fahrzeugverkauf, Stilllegung oder kurzfristigem Fahrzeugwechsel.',
},

'regen': {
  intro: 'In Regen möchten viele Fahrzeughalter die Auto-Abmeldung schnell und ohne unnötigen Behördengang erledigen.',
  districts: ['Regen', 'Zwiesel', 'Viechtach', 'Bodenmais', 'Bayerisch Eisenstein', 'Teisnach', 'Ruhmannsfelden'],
  licensePlates: ['REG', 'VIT'],
  painPoint: 'Gerade im Landkreis Regen kosten Wege, Termine und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen REG oder VIT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch, wenn das Fahrzeug verkauft, stillgelegt oder gewechselt wird.',
},

'regensburg': {
  intro: 'In Regensburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne einen zusätzlichen Termin einzuplanen.',
  districts: ['Regensburg', 'Neutraubling', 'Lappersdorf', 'Pentling', 'Wenzenbach', 'Regenstauf', 'Obertraubling'],
  licensePlates: ['R', 'BUL', 'KÖZ', 'MAL', 'ROD'],
  painPoint: 'Gerade in Regensburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen R, BUL, KÖZ, MAL oder ROD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist eine einfache Lösung bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rehau': {
  intro: 'In Rehau möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Rehau', 'Oberkotzau', 'Schwarzenbach an der Saale', 'Selb', 'Hof', 'Regnitzlosau', 'Schönwald'],
  licensePlates: ['HO', 'REH', 'MÜB', 'NAI'],
  painPoint: 'Gerade in Rehau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HO, REH, MÜB oder NAI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Weg ist besonders praktisch, wenn die Abmeldung schnell und klar erledigt werden soll.',
},

'remchingen': {
  intro: 'In Remchingen möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Remchingen', 'Wilferdingen', 'Singen', 'Nöttingen', 'Königsbach-Stein', 'Keltern', 'Pfinztal'],
  licensePlates: ['PF', 'ENZ'],
  painPoint: 'Gerade in Remchingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PF oder ENZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung hilft besonders bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rems-murr-kreis': {
  intro: 'Im Rems-Murr-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördentermin erledigen.',
  districts: ['Waiblingen', 'Backnang', 'Schorndorf', 'Winnenden', 'Fellbach', 'Weinstadt', 'Murrhardt'],
  licensePlates: ['WN', 'BK'],
  painPoint: 'Gerade im Rems-Murr-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WN oder BK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'remscheid': {
  intro: 'In Remscheid möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Remscheid', 'Lennep', 'Lüttringhausen', 'Hasten', 'Honsberg', 'Bliedinghausen', 'Innenstadt'],
  licensePlates: ['RS'],
  painPoint: 'Gerade in Remscheid kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rendsburg': {
  intro: 'In Rendsburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Rendsburg', 'Büdelsdorf', 'Fockbek', 'Schacht-Audorf', 'Osterrönfeld', 'Nortorf', 'Eckernförde'],
  licensePlates: ['RD', 'ECK'],
  painPoint: 'Gerade in Rendsburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RD oder ECK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist eine bequeme Lösung bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'renningen': {
  intro: 'In Renningen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Renningen', 'Malmsheim', 'Leonberg', 'Rutesheim', 'Weil der Stadt', 'Magstadt', 'Sindelfingen'],
  licensePlates: ['BB', 'LEO'],
  painPoint: 'Gerade in Renningen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BB oder LEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch, wenn das Fahrzeug verkauft, stillgelegt oder gewechselt wird.',
},

'reutlingen': {
  intro: 'In Reutlingen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Termin erledigen.',
  districts: ['Reutlingen', 'Pfullingen', 'Metzingen', 'Eningen unter Achalm', 'Wannweil', 'Münsingen', 'Bad Urach'],
  licensePlates: ['RT', 'MÜN'],
  painPoint: 'Gerade in Reutlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RT oder MÜN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rheda-wiedenbrueck': {
  intro: 'In Rheda-Wiedenbrück möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Rheda', 'Wiedenbrück', 'Lintel', 'St. Vit', 'Batenhorst', 'Gütersloh', 'Herzebrock-Clarholz'],
  licensePlates: ['GT', 'WD'],
  painPoint: 'Gerade in Rheda-Wiedenbrück kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GT oder WD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rhein-erft-kreis': {
  intro: 'Im Rhein-Erft-Kreis möchten viele Fahrzeughalter die Auto-Abmeldung schnell erledigen, ohne extra einen Termin einzuplanen.',
  districts: ['Bergheim', 'Kerpen', 'Hürth', 'Brühl', 'Frechen', 'Pulheim', 'Erftstadt'],
  licensePlates: ['BM'],
  painPoint: 'Gerade im Rhein-Erft-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rhein-hunsrueck-kreis': {
  intro: 'Im Rhein-Hunsrück-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Simmern', 'Boppard', 'Kastellaun', 'Kirchberg', 'Rheinböllen', 'Emmelshausen', 'Sankt Goar'],
  licensePlates: ['SIM', 'GOA'],
  painPoint: 'Gerade im Rhein-Hunsrück-Kreis kosten Wege, Termine und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SIM oder GOA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist eine bequeme Lösung bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rhein-lahn-kreis': {
  intro: 'Im Rhein-Lahn-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Bad Ems', 'Lahnstein', 'Diez', 'Nassau', 'Braubach', 'Katzenelnbogen', 'Sankt Goarshausen'],
  licensePlates: ['EMS', 'DIZ', 'GOH'],
  painPoint: 'Gerade im Rhein-Lahn-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EMS, DIZ oder GOH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Weg ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rhein-neckar-kreis': {
  intro: 'Im Rhein-Neckar-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördentermin erledigen.',
  districts: ['Heidelberg', 'Sinsheim', 'Weinheim', 'Schwetzingen', 'Wiesloch', 'Leimen', 'Hockenheim'],
  licensePlates: ['HD', 'SNH'],
  painPoint: 'Gerade im Rhein-Neckar-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HD oder SNH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rhein-pfalz-kreis': {
  intro: 'Im Rhein-Pfalz-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Ludwigshafen', 'Schifferstadt', 'Mutterstadt', 'Maxdorf', 'Dannstadt-Schauernheim', 'Bobenheim-Roxheim', 'Altrip'],
  licensePlates: ['RP'],
  painPoint: 'Gerade im Rhein-Pfalz-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rhein-sieg-kreis': {
  intro: 'Im Rhein-Sieg-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Siegburg', 'Troisdorf', 'Sankt Augustin', 'Hennef', 'Bornheim', 'Rheinbach', 'Lohmar'],
  licensePlates: ['SU'],
  painPoint: 'Gerade im Rhein-Sieg-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist eine bequeme Lösung bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rheine': {
  intro: 'In Rheine möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne lange Wartezeiten erledigen.',
  districts: ['Rheine', 'Mesum', 'Elte', 'Hauenhorst', 'Gellendorf', 'Neuenkirchen', 'Wettringen'],
  licensePlates: ['ST', 'BF', 'TE'],
  painPoint: 'Gerade in Rheine kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ST, BF oder TE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rheinfelden': {
  intro: 'In Rheinfelden möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne unnötige Wege oder Wartezeiten.',
  districts: ['Rheinfelden', 'Herten', 'Karsau', 'Minseln', 'Nollingen', 'Warmbach', 'Lörrach'],
  licensePlates: ['LÖ'],
  painPoint: 'Gerade in Rheinfelden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rheinland-pfalz': {
  intro: 'In Rheinland-Pfalz möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Behördengänge erledigen.',
  districts: ['Mainz', 'Ludwigshafen', 'Koblenz', 'Trier', 'Kaiserslautern', 'Worms', 'Speyer'],
  licensePlates: ['MZ', 'LU', 'KO', 'TR', 'KL', 'WO', 'SP'],
  painPoint: 'Gerade in Rheinland-Pfalz kosten Termine, Anfahrt und Wartezeit je nach Stadt oder Landkreis oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug in Rheinland-Pfalz abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rheinstetten': {
  intro: 'In Rheinstetten möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Rheinstetten', 'Mörsch', 'Forchheim', 'Neuburgweier', 'Karlsruhe', 'Ettlingen', 'Durmersheim'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Rheinstetten kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist eine einfache Lösung bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rhoen-grabfeld': {
  intro: 'Im Landkreis Rhön-Grabfeld möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Bad Neustadt an der Saale', 'Bad Königshofen', 'Mellrichstadt', 'Bischofsheim', 'Ostheim', 'Fladungen', 'Saal an der Saale'],
  licensePlates: ['NES', 'MET', 'KÖN'],
  painPoint: 'Gerade im Landkreis Rhön-Grabfeld kosten Wege, Termine und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NES, MET oder KÖN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ribnitz-damgarten': {
  intro: 'In Ribnitz-Damgarten möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Ribnitz-Damgarten', 'Graal-Müritz', 'Marlow', 'Ahrenshagen-Daskow', 'Gelbensande', 'Dierhagen', 'Wustrow'],
  licensePlates: ['VR', 'RDG', 'NVP', 'RÜG'],
  painPoint: 'Gerade in Ribnitz-Damgarten kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VR, RDG, NVP oder RÜG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'riedlingen': {
  intro: 'In Riedlingen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Riedlingen', 'Dürmentingen', 'Langenenslingen', 'Uttenweiler', 'Ertingen', 'Zwiefalten', 'Bad Buchau'],
  licensePlates: ['BC'],
  painPoint: 'Gerade in Riedlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'riesa': {
  intro: 'In Riesa möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Riesa', 'Gröditz', 'Strehla', 'Zeithain', 'Nünchritz', 'Oschatz', 'Meißen'],
  licensePlates: ['MEI', 'RIE', 'GRH', 'RG'],
  painPoint: 'Gerade in Riesa kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MEI, RIE, GRH oder RG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rietberg': {
  intro: 'In Rietberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Rietberg', 'Neuenkirchen', 'Mastholte', 'Westerwiehe', 'Varensell', 'Bokel', 'Gütersloh'],
  licensePlates: ['GT'],
  painPoint: 'Gerade in Rietberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rinteln': {
  intro: 'In Rinteln möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Rinteln', 'Exten', 'Krankenhagen', 'Todenmann', 'Deckbergen', 'Steinbergen', 'Bückeburg'],
  licensePlates: ['SHG', 'RI'],
  painPoint: 'Gerade in Rinteln kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHG oder RI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist eine bequeme Lösung bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rockenhausen': {
  intro: 'In Rockenhausen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Rockenhausen', 'Winnweiler', 'Kirchheimbolanden', 'Alsenz', 'Obermoschel', 'Dannenfels', 'Göllheim'],
  licensePlates: ['KIB', 'ROK'],
  painPoint: 'Gerade in Rockenhausen kosten Wege, Termine und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KIB oder ROK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'roding': {
  intro: 'In Roding möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Roding', 'Cham', 'Bad Kötzting', 'Furth im Wald', 'Waldmünchen', 'Traitsching', 'Schorndorf'],
  licensePlates: ['CHA', 'ROD', 'KÖZ', 'WÜM'],
  painPoint: 'Gerade in Roding kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CHA, ROD, KÖZ oder WÜM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rosenheim': {
  intro: 'In Rosenheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Rosenheim', 'Kolbermoor', 'Bad Aibling', 'Prien am Chiemsee', 'Wasserburg am Inn', 'Raubling', 'Stephanskirchen'],
  licensePlates: ['RO', 'AIB', 'WS'],
  painPoint: 'Gerade in Rosenheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RO, AIB oder WS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rostock': {
  intro: 'In Rostock möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin einzuplanen.',
  districts: ['Rostock', 'Warnemünde', 'Reutershagen', 'Dierkow', 'Toitenwinkel', 'Lütten Klein', 'Evershagen'],
  licensePlates: ['HRO', 'LRO', 'DBR', 'GÜ', 'ROS'],
  painPoint: 'Gerade in Rostock kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HRO, LRO, DBR, GÜ oder ROS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist eine einfache Lösung bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rotenburg-wuemme': {
  intro: 'In Rotenburg an der Wümme möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Rotenburg an der Wümme', 'Bremervörde', 'Zeven', 'Visselhövede', 'Sottrum', 'Scheeßel', 'Selsingen'],
  licensePlates: ['ROW', 'BRV'],
  painPoint: 'Gerade in Rotenburg an der Wümme kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ROW oder BRV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rotenburg-an-der-fulda': {
  intro: 'In Rotenburg an der Fulda möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Rotenburg an der Fulda', 'Bebra', 'Bad Hersfeld', 'Alheim', 'Ludwigsau', 'Wildeck', 'Cornberg'],
  licensePlates: ['HEF', 'ROF'],
  painPoint: 'Gerade in Rotenburg an der Fulda kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HEF oder ROF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rotenburg-an-der-wuemme': {
  intro: 'In Rotenburg an der Wümme möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördentermin erledigen.',
  districts: ['Rotenburg an der Wümme', 'Bremervörde', 'Zeven', 'Visselhövede', 'Sottrum', 'Scheeßel', 'Selsingen'],
  licensePlates: ['ROW', 'BRV'],
  painPoint: 'Gerade in Rotenburg an der Wümme kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ROW oder BRV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Weg ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'roth': {
  intro: 'In Roth möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Roth', 'Hilpoltstein', 'Georgensgmünd', 'Allersberg', 'Wendelstein', 'Spalt', 'Schwabach'],
  licensePlates: ['RH', 'HIP'],
  painPoint: 'Gerade in Roth kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RH oder HIP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rothenburg-ob-der-tauber': {
  intro: 'In Rothenburg ob der Tauber möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Rothenburg ob der Tauber', 'Schillingsfürst', 'Gebsattel', 'Insingen', 'Neusitz', 'Diebach', 'Ansbach'],
  licensePlates: ['AN', 'ROT', 'DKB', 'FEU'],
  painPoint: 'Gerade in Rothenburg ob der Tauber kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AN, ROT, DKB oder FEU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rottweil': {
  intro: 'In Rottweil möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin einzuplanen.',
  districts: ['Rottweil', 'Schramberg', 'Oberndorf am Neckar', 'Sulz am Neckar', 'Dornhan', 'Dunningen', 'Villingendorf'],
  licensePlates: ['RW', 'HOR'],
  painPoint: 'Gerade in Rottweil kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RW oder HOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ruedesheim': {
  intro: 'In Rüdesheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Rüdesheim am Rhein', 'Assmannshausen', 'Aulhausen', 'Presberg', 'Geisenheim', 'Eltville', 'Lorch'],
  licensePlates: ['RÜD', 'SWA'],
  painPoint: 'Gerade in Rüdesheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RÜD oder SWA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ruesselsheim': {
  intro: 'In Rüsselsheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Rüsselsheim', 'Bauschheim', 'Königstädten', 'Haßloch', 'Raunheim', 'Kelsterbach', 'Groß-Gerau'],
  licensePlates: ['GG'],
  painPoint: 'Gerade in Rüsselsheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist eine bequeme Lösung bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'rutesheim': {
  intro: 'In Rutesheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Rutesheim', 'Perouse', 'Renningen', 'Leonberg', 'Weil der Stadt', 'Ditzingen', 'Gerlingen'],
  licensePlates: ['BB', 'LEO'],
  painPoint: 'Gerade in Rutesheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BB oder LEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'saale-holzland-kreis': {
  intro: 'Im Saale-Holzland-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Eisenberg', 'Hermsdorf', 'Stadtroda', 'Kahla', 'Bad Klosterlausnitz', 'Camburg', 'Dornburg'],
  licensePlates: ['SHK', 'EIS', 'SRO'],
  painPoint: 'Gerade im Saale-Holzland-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHK, EIS oder SRO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'saale-orla-kreis': {
  intro: 'Im Saale-Orla-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Schleiz', 'Pößneck', 'Bad Lobenstein', 'Neustadt an der Orla', 'Triptis', 'Tanna', 'Gefell'],
  licensePlates: ['SOK', 'PN', 'SCZ'],
  painPoint: 'Gerade im Saale-Orla-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SOK, PN oder SCZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'saalekreis': {
  intro: 'Im Saalekreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Merseburg', 'Querfurt', 'Leuna', 'Mücheln', 'Bad Dürrenberg', 'Braunsbedra', 'Landsberg'],
  licensePlates: ['SK', 'MER', 'MQ', 'QFT'],
  painPoint: 'Gerade im Saalekreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SK, MER, MQ oder QFT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung spart Zeit und ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'saalfeld-rudolstadt': {
  intro: 'Im Landkreis Saalfeld-Rudolstadt möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Saalfeld', 'Rudolstadt', 'Bad Blankenburg', 'Königsee', 'Leutenberg', 'Remda-Teichel', 'Kaulsdorf'],
  licensePlates: ['SLF', 'RU'],
  painPoint: 'Gerade im Landkreis Saalfeld-Rudolstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SLF oder RU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Weg ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'saarburg': {
  intro: 'In Saarburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Saarburg', 'Konz', 'Wincheringen', 'Palzem', 'Freudenburg', 'Trassem', 'Tawern'],
  licensePlates: ['TR', 'SAB'],
  painPoint: 'Gerade in Saarburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TR oder SAB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'saarlouis': {
  intro: 'In Saarlouis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördentermin erledigen.',
  districts: ['Saarlouis', 'Dillingen', 'Wadgassen', 'Überherrn', 'Schwalbach', 'Bous', 'Ensdorf'],
  licensePlates: ['SLS'],
  painPoint: 'Gerade in Saarlouis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SLS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'salem': {
  intro: 'In Salem möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin einzuplanen.',
  districts: ['Salem', 'Mimmenhausen', 'Neufrach', 'Mittelstenweiler', 'Oberstenweiler', 'Überlingen', 'Markdorf'],
  licensePlates: ['FN', 'TT'],
  painPoint: 'Gerade in Salem kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FN oder TT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'salzgitter': {
  intro: 'In Salzgitter möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Lebenstedt', 'Bad', 'Thiede', 'Gebhardshagen', 'Hallendorf', 'Ringelheim', 'Fredenberg'],
  licensePlates: ['SZ'],
  painPoint: 'Gerade in Salzgitter kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'salzlandkreis': {
  intro: 'Im Salzlandkreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Bernburg', 'Aschersleben', 'Staßfurt', 'Schönebeck', 'Calbe', 'Egeln', 'Nienburg'],
  licensePlates: ['SLK', 'ASL', 'BBG', 'SBK', 'SFT'],
  painPoint: 'Gerade im Salzlandkreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SLK, ASL, BBG, SBK oder SFT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'salzwedel': {
  intro: 'In Salzwedel möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Salzwedel', 'Gardelegen', 'Klötze', 'Kalbe', 'Arendsee', 'Diesdorf', 'Beetzendorf'],
  licensePlates: ['SAW', 'GA', 'KLZ'],
  painPoint: 'Gerade in Salzwedel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SAW, GA oder KLZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sangerhausen': {
  intro: 'In Sangerhausen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Sangerhausen', 'Allstedt', 'Mansfeld', 'Südharz', 'Eisleben', 'Kelbra', 'Wallhausen'],
  licensePlates: ['MSH', 'SGH', 'EIL', 'HET'],
  painPoint: 'Gerade in Sangerhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSH, SGH, EIL oder HET abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sankt-goar': {
  intro: 'In Sankt Goar möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Sankt Goar', 'Oberwesel', 'Boppard', 'Emmelshausen', 'Karbach', 'Urbar', 'Rheinböllen'],
  licensePlates: ['SIM', 'GOA'],
  painPoint: 'Gerade in Sankt Goar kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SIM oder GOA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sankt-wendel': {
  intro: 'In Sankt Wendel möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördentermin erledigen.',
  districts: ['Sankt Wendel', 'Nohfelden', 'Nonnweiler', 'Tholey', 'Marpingen', 'Freisen', 'Oberthal'],
  licensePlates: ['WND'],
  painPoint: 'Gerade in Sankt Wendel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WND abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schaumburg': {
  intro: 'Im Landkreis Schaumburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Stadthagen', 'Rinteln', 'Bückeburg', 'Obernkirchen', 'Bad Nenndorf', 'Lindhorst', 'Nienstädt'],
  licensePlates: ['SHG', 'RI'],
  painPoint: 'Gerade im Landkreis Schaumburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHG oder RI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'scheinfeld': {
  intro: 'In Scheinfeld möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Scheinfeld', 'Markt Bibart', 'Uffenheim', 'Neustadt an der Aisch', 'Burghaslach', 'Sugenheim', 'Oberscheinfeld'],
  licensePlates: ['NEA', 'SEF', 'UFF'],
  painPoint: 'Gerade in Scheinfeld kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NEA, SEF oder UFF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Weg ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schleiden': {
  intro: 'In Schleiden möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Schleiden', 'Gemünd', 'Hellenthal', 'Kall', 'Mechernich', 'Blankenheim', 'Nettersheim'],
  licensePlates: ['EU', 'SLE'],
  painPoint: 'Gerade in Schleiden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EU oder SLE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schleiz': {
  intro: 'In Schleiz möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Schleiz', 'Tanna', 'Gefell', 'Hirschberg', 'Pößneck', 'Bad Lobenstein', 'Saalburg-Ebersdorf'],
  licensePlates: ['SOK', 'SCZ'],
  painPoint: 'Gerade in Schleiz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SOK oder SCZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schleswig': {
  intro: 'In Schleswig möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Schleswig', 'Kropp', 'Busdorf', 'Fahrdorf', 'Böklund', 'Tarp', 'Süderbrarup'],
  licensePlates: ['SL'],
  painPoint: 'Gerade in Schleswig kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schleswig-flensburg': {
  intro: 'Im Kreis Schleswig-Flensburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Schleswig', 'Flensburg', 'Kappeln', 'Satrup', 'Tarp', 'Süderbrarup', 'Kropp'],
  licensePlates: ['SL'],
  painPoint: 'Gerade im Kreis Schleswig-Flensburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schluechtern': {
  intro: 'In Schlüchtern möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin einzuplanen.',
  districts: ['Schlüchtern', 'Steinau an der Straße', 'Sinntal', 'Bad Soden-Salmünster', 'Flieden', 'Kalbach', 'Fulda'],
  licensePlates: ['MKK', 'SLÜ', 'HU', 'GN'],
  painPoint: 'Gerade in Schlüchtern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MKK, SLÜ, HU oder GN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schmalkalden': {
  intro: 'In Schmalkalden möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Schmalkalden', 'Meiningen', 'Zella-Mehlis', 'Brotterode-Trusetal', 'Steinbach-Hallenberg', 'Wasungen', 'Floh-Seligenthal'],
  licensePlates: ['SM', 'MGN'],
  painPoint: 'Gerade in Schmalkalden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SM oder MGN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schmoelln': {
  intro: 'In Schmölln möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Schmölln', 'Altenburg', 'Gößnitz', 'Meuselwitz', 'Nobitz', 'Lucka', 'Ponitz'],
  licensePlates: ['ABG', 'SLN'],
  painPoint: 'Gerade in Schmölln kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ABG oder SLN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schoemberg': {
  intro: 'In Schömberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Schömberg', 'Bad Liebenzell', 'Bad Wildbad', 'Calw', 'Neuenbürg', 'Oberreichenbach', 'Unterreichenbach'],
  licensePlates: ['CW'],
  painPoint: 'Gerade in Schömberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schongau': {
  intro: 'In Schongau möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Schongau', 'Peiting', 'Peißenberg', 'Weilheim', 'Hohenpeißenberg', 'Burggen', 'Bernbeuren'],
  licensePlates: ['WM', 'SOG'],
  painPoint: 'Gerade in Schongau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WM oder SOG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schopfheim': {
  intro: 'In Schopfheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Schopfheim', 'Maulburg', 'Hausen im Wiesental', 'Steinen', 'Zell im Wiesental', 'Rheinfelden', 'Lörrach'],
  licensePlates: ['LÖ'],
  painPoint: 'Gerade in Schopfheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schorndorf': {
  intro: 'In Schorndorf möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Schorndorf', 'Weiler', 'Haubersbronn', 'Miedelsbach', 'Schlichten', 'Urbach', 'Winterbach'],
  licensePlates: ['WN', 'BK'],
  painPoint: 'Gerade in Schorndorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WN oder BK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schrobenhausen': {
  intro: 'In Schrobenhausen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Schrobenhausen', 'Mühlried', 'Hörzhausen', 'Steingriff', 'Waidhofen', 'Aresing', 'Berg im Gau'],
  licensePlates: ['ND', 'SOB'],
  painPoint: 'Gerade in Schrobenhausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ND oder SOB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwabach': {
  intro: 'In Schwabach möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Schwabach', 'Wolkersdorf', 'Penzendorf', 'Limbach', 'Unterreichenbach', 'Roth', 'Wendelstein'],
  licensePlates: ['SC'],
  painPoint: 'Gerade in Schwabach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwaebisch-gmuend': {
  intro: 'In Schwäbisch Gmünd möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Schwäbisch Gmünd', 'Bettringen', 'Herlikofen', 'Lindach', 'Rechberg', 'Straßdorf', 'Wetzgau'],
  licensePlates: ['AA', 'GD'],
  painPoint: 'Gerade in Schwäbisch Gmünd kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AA oder GD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwaebisch-hall': {
  intro: 'In Schwäbisch Hall möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Schwäbisch Hall', 'Crailsheim', 'Gaildorf', 'Ilshofen', 'Mainhardt', 'Michelfeld', 'Rosengarten'],
  licensePlates: ['SHA', 'BK', 'CR'],
  painPoint: 'Gerade in Schwäbisch Hall kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHA, BK oder CR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwabmuenchen': {
  intro: 'In Schwabmünchen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Schwabmünchen', 'Bobingen', 'Königsbrunn', 'Großaitingen', 'Graben', 'Langerringen', 'Untermeitingen'],
  licensePlates: ['A', 'SMÜ', 'WER'],
  painPoint: 'Gerade in Schwabmünchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen A, SMÜ oder WER abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwaigern': {
  intro: 'In Schwaigern möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Schwaigern', 'Stetten am Heuchelberg', 'Massenbach', 'Niederhofen', 'Leingarten', 'Brackenheim', 'Eppingen'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Schwaigern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwalm-eder-kreis': {
  intro: 'Im Schwalm-Eder-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Homberg', 'Fritzlar', 'Melsungen', 'Schwalmstadt', 'Borken', 'Gudensberg', 'Felsberg'],
  licensePlates: ['HR', 'FZ', 'MEG', 'ZIG'],
  painPoint: 'Gerade im Schwalm-Eder-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HR, FZ, MEG oder ZIG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwalmstadt': {
  intro: 'In Schwalmstadt möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Treysa', 'Ziegenhain', 'Ascherode', 'Florshain', 'Michelsberg', 'Niedergrenzebach', 'Trutzhain'],
  licensePlates: ['HR', 'ZIG'],
  painPoint: 'Gerade in Schwalmstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HR oder ZIG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwandorf': {
  intro: 'In Schwandorf möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Termin erledigen.',
  districts: ['Schwandorf', 'Burglengenfeld', 'Nabburg', 'Neunburg vorm Wald', 'Oberviechtach', 'Nittenau', 'Maxhütte-Haidhof'],
  licensePlates: ['SAD', 'NAB', 'OVI', 'RÖT'],
  painPoint: 'Gerade in Schwandorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SAD, NAB, OVI oder RÖT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwarzwald-baar-kreis': {
  intro: 'Im Schwarzwald-Baar-Kreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Villingen-Schwenningen', 'Donaueschingen', 'St. Georgen', 'Furtwangen', 'Bad Dürrheim', 'Blumberg', 'Bräunlingen'],
  licensePlates: ['VS', 'DS', 'VIL'],
  painPoint: 'Gerade im Schwarzwald-Baar-Kreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VS, DS oder VIL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schweinfurt': {
  intro: 'In Schweinfurt möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Schweinfurt', 'Schonungen', 'Gochsheim', 'Sennfeld', 'Dittelbrunn', 'Niederwerrn', 'Geldersheim'],
  licensePlates: ['SW', 'GEO'],
  painPoint: 'Gerade in Schweinfurt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SW oder GEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwelm': {
  intro: 'In Schwelm möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Schwelm', 'Gevelsberg', 'Ennepetal', 'Wetter', 'Sprockhövel', 'Hattingen', 'Witten'],
  licensePlates: ['EN'],
  painPoint: 'Gerade in Schwelm kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'schwerin': {
  intro: 'In Schwerin möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin einzuplanen.',
  districts: ['Schwerin', 'Mueßer Holz', 'Lankow', 'Krebsförden', 'Großer Dreesch', 'Paulsstadt', 'Warnitz'],
  licensePlates: ['SN'],
  painPoint: 'Gerade in Schwerin kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sebnitz': {
  intro: 'In Sebnitz möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Sebnitz', 'Bad Schandau', 'Neustadt in Sachsen', 'Hohnstein', 'Stolpen', 'Pirna', 'Königstein'],
  licensePlates: ['PIR', 'SEB', 'DW', 'FTL'],
  painPoint: 'Gerade in Sebnitz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PIR, SEB, DW oder FTL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'segeberg': {
  intro: 'Im Kreis Segeberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Bad Segeberg', 'Norderstedt', 'Kaltenkirchen', 'Henstedt-Ulzburg', 'Wahlstedt', 'Nahe', 'Leezen'],
  licensePlates: ['SE'],
  painPoint: 'Gerade im Kreis Segeberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'selb': {
  intro: 'In Selb möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Selb', 'Schönwald', 'Rehau', 'Marktredwitz', 'Kirchenlamitz', 'Weißenstadt', 'Wunsiedel'],
  licensePlates: ['WUN', 'SEB', 'REH'],
  painPoint: 'Gerade in Selb kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WUN, SEB oder REH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'seligenstadt': {
  intro: 'In Seligenstadt möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördentermin erledigen.',
  districts: ['Seligenstadt', 'Froschhausen', 'Klein-Welzheim', 'Mainhausen', 'Hainburg', 'Rodgau', 'Obertshausen'],
  licensePlates: ['OF'],
  painPoint: 'Gerade in Seligenstadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'senftenberg': {
  intro: 'In Senftenberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Senftenberg', 'Großräschen', 'Lauchhammer', 'Schwarzheide', 'Ruhland', 'Ortrand', 'Hohenbocka'],
  licensePlates: ['OSL', 'SFB', 'CA'],
  painPoint: 'Gerade in Senftenberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OSL, SFB oder CA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'siegburg': {
  intro: 'In Siegburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Siegburg', 'Kaldauen', 'Deichhaus', 'Wolsdorf', 'Braschoß', 'Troisdorf', 'Sankt Augustin'],
  licensePlates: ['SU'],
  painPoint: 'Gerade in Siegburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'siegen': {
  intro: 'In Siegen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Siegen', 'Weidenau', 'Geisweid', 'Eiserfeld', 'Kaan-Marienborn', 'Niederschelden', 'Netphen'],
  licensePlates: ['SI', 'BLB'],
  painPoint: 'Gerade in Siegen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SI oder BLB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'siegen-wittgenstein': {
  intro: 'Im Kreis Siegen-Wittgenstein möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Siegen', 'Kreuztal', 'Netphen', 'Bad Berleburg', 'Bad Laasphe', 'Freudenberg', 'Hilchenbach'],
  licensePlates: ['SI', 'BLB'],
  painPoint: 'Gerade im Kreis Siegen-Wittgenstein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SI oder BLB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sigmaringen': {
  intro: 'In Sigmaringen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin einzuplanen.',
  districts: ['Sigmaringen', 'Bad Saulgau', 'Pfullendorf', 'Mengen', 'Meßkirch', 'Gammertingen', 'Herbertingen'],
  licensePlates: ['SIG', 'SLG'],
  painPoint: 'Gerade in Sigmaringen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SIG oder SLG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'simmern': {
  intro: 'In Simmern möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Simmern', 'Rheinböllen', 'Kirchberg', 'Kastellaun', 'Boppard', 'Emmelshausen', 'Sohren'],
  licensePlates: ['SIM', 'GOA'],
  painPoint: 'Gerade in Simmern kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SIM oder GOA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sindelfingen': {
  intro: 'In Sindelfingen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Sindelfingen', 'Maichingen', 'Darmsheim', 'Böblingen', 'Magstadt', 'Grafenau', 'Renningen'],
  licensePlates: ['BB', 'LEO'],
  painPoint: 'Gerade in Sindelfingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BB oder LEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'singen': {
  intro: 'In Singen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Singen', 'Radolfzell', 'Rielasingen-Worblingen', 'Engen', 'Gottmadingen', 'Hilzingen', 'Steißlingen'],
  licensePlates: ['KN', 'BÜS', 'STO'],
  painPoint: 'Gerade in Singen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KN, BÜS oder STO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'soest': {
  intro: 'In Soest möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Soest', 'Werl', 'Lippstadt', 'Warstein', 'Geseke', 'Erwitte', 'Bad Sassendorf'],
  licensePlates: ['SO', 'LP'],
  painPoint: 'Gerade in Soest kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SO oder LP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'solingen': {
  intro: 'In Solingen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Solingen-Mitte', 'Ohligs', 'Wald', 'Gräfrath', 'Höhscheid', 'Burg', 'Aufderhöhe'],
  licensePlates: ['SG'],
  painPoint: 'Gerade in Solingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'soltau': {
  intro: 'In Soltau möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Soltau', 'Munster', 'Schneverdingen', 'Bispingen', 'Wietzendorf', 'Neuenkirchen', 'Fallingbostel'],
  licensePlates: ['HK', 'SFA'],
  painPoint: 'Gerade in Soltau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HK oder SFA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'soemmerda': {
  intro: 'In Sömmerda möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Sömmerda', 'Kölleda', 'Weißensee', 'Buttstädt', 'Rastenberg', 'Straußfurt', 'Gebesee'],
  licensePlates: ['SÖM'],
  painPoint: 'Gerade in Sömmerda kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SÖM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sondershausen': {
  intro: 'In Sondershausen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Sondershausen', 'Bad Frankenhausen', 'Ebeleben', 'Greußen', 'Clingen', 'Großenehrich', 'Heringen'],
  licensePlates: ['KYF', 'ART', 'SDH'],
  painPoint: 'Gerade in Sondershausen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KYF, ART oder SDH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sonneberg': {
  intro: 'In Sonneberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Sonneberg', 'Neuhaus am Rennweg', 'Schalkau', 'Steinach', 'Lauscha', 'Föritztal', 'Goldisthal'],
  licensePlates: ['SON', 'NH'],
  painPoint: 'Gerade in Sonneberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SON oder NH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sonthofen': {
  intro: 'In Sonthofen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Sonthofen', 'Immenstadt', 'Oberstdorf', 'Fischen', 'Blaichach', 'Burgberg', 'Bad Hindelang'],
  licensePlates: ['OA'],
  painPoint: 'Gerade in Sonthofen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'speyer': {
  intro: 'In Speyer möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Speyer', 'Nord', 'Süd', 'West', 'Rinkenbergerhof', 'Dudenhofen', 'Römerberg'],
  licensePlates: ['SP'],
  painPoint: 'Gerade in Speyer kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'spree-neisse': {
  intro: 'Im Landkreis Spree-Neiße möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Forst', 'Guben', 'Spremberg', 'Döbern', 'Peitz', 'Burg', 'Welzow'],
  licensePlates: ['SPN', 'FOR', 'GUB', 'SPB'],
  painPoint: 'Gerade im Landkreis Spree-Neiße kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SPN, FOR, GUB oder SPB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'stade': {
  intro: 'In Stade möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Stade', 'Buxtehude', 'Harsefeld', 'Drochtersen', 'Horneburg', 'Jork', 'Fredenbeck'],
  licensePlates: ['STD'],
  painPoint: 'Gerade in Stade kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen STD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'stadthagen': {
  intro: 'In Stadthagen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Stadthagen', 'Obernkirchen', 'Nienstädt', 'Lindhorst', 'Bückeburg', 'Rinteln', 'Bad Nenndorf'],
  licensePlates: ['SHG', 'RI'],
  painPoint: 'Gerade in Stadthagen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHG oder RI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'starnberg': {
  intro: 'In Starnberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Starnberg', 'Gauting', 'Gilching', 'Herrsching', 'Tutzing', 'Pöcking', 'Feldafing'],
  licensePlates: ['STA', 'WOR'],
  painPoint: 'Gerade in Starnberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen STA oder WOR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'staufen-im-breisgau': {
  intro: 'In Staufen im Breisgau möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Staufen', 'Grunern', 'Wettelbrunn', 'Bad Krozingen', 'Münstertal', 'Heitersheim', 'Ehrenkirchen'],
  licensePlates: ['FR', 'MÜL'],
  painPoint: 'Gerade in Staufen im Breisgau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR oder MÜL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'steinburg': {
  intro: 'Im Kreis Steinburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Itzehoe', 'Glückstadt', 'Kellinghusen', 'Wilster', 'Horst', 'Wacken', 'Hohenlockstedt'],
  licensePlates: ['IZ'],
  painPoint: 'Gerade im Kreis Steinburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen IZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'steinen': {
  intro: 'In Steinen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Steinen', 'Höllstein', 'Hüsingen', 'Endenburg', 'Weitenau', 'Schopfheim', 'Lörrach'],
  licensePlates: ['LÖ'],
  painPoint: 'Gerade in Steinen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'steinfurt': {
  intro: 'Im Kreis Steinfurt möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Steinfurt', 'Rheine', 'Ibbenbüren', 'Emsdetten', 'Greven', 'Lengerich', 'Ochtrup'],
  licensePlates: ['ST', 'BF', 'TE'],
  painPoint: 'Gerade im Kreis Steinfurt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ST, BF oder TE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'stendal': {
  intro: 'In Stendal möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Stendal', 'Tangermünde', 'Havelberg', 'Osterburg', 'Seehausen', 'Arneburg', 'Bismark'],
  licensePlates: ['SDL', 'HV', 'OEB'],
  painPoint: 'Gerade in Stendal kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SDL, HV oder OEB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'stockach': {
  intro: 'In Stockach möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Stockach', 'Wahlwies', 'Espasingen', 'Zizenhausen', 'Hoppetenzell', 'Orsingen-Nenzingen', 'Bodman-Ludwigshafen'],
  licensePlates: ['KN', 'STO'],
  painPoint: 'Gerade in Stockach kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KN oder STO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'stollberg': {
  intro: 'In Stollberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Stollberg', 'Oelsnitz', 'Lugau', 'Niederdorf', 'Thalheim', 'Auerbach', 'Zwönitz'],
  licensePlates: ['ERZ', 'STL', 'ANA', 'ASZ', 'AU'],
  painPoint: 'Gerade in Stollberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ERZ, STL, ANA, ASZ oder AU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'stormarn': {
  intro: 'Im Kreis Stormarn möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Bad Oldesloe', 'Ahrensburg', 'Reinbek', 'Glinde', 'Bargteheide', 'Trittau', 'Reinfeld'],
  licensePlates: ['OD'],
  painPoint: 'Gerade im Kreis Stormarn kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen OD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'stralsund': {
  intro: 'In Stralsund möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin einzuplanen.',
  districts: ['Stralsund', 'Grünhufe', 'Knieper', 'Franken', 'Tribseer', 'Devin', 'Altefähr'],
  licensePlates: ['HST', 'VR', 'RÜG', 'NVP'],
  painPoint: 'Gerade in Stralsund kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HST, VR, RÜG oder NVP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'straubenhardt': {
  intro: 'In Straubenhardt möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Straubenhardt', 'Conweiler', 'Feldrennach', 'Langenalb', 'Ottenhausen', 'Schwann', 'Pfinzweiler'],
  licensePlates: ['PF', 'ENZ'],
  painPoint: 'Gerade in Straubenhardt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PF oder ENZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'straubing': {
  intro: 'In Straubing möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Straubing', 'Ittling', 'Alburg', 'Kagers', 'Haid', 'Hornstorf', 'Sossau'],
  licensePlates: ['SR'],
  painPoint: 'Gerade in Straubing kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'straubing-bogen': {
  intro: 'Im Landkreis Straubing-Bogen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Bogen', 'Mallersdorf-Pfaffenberg', 'Geiselhöring', 'Mitterfels', 'Leiblfing', 'Aiterhofen', 'Parkstetten'],
  licensePlates: ['SR', 'BOG', 'MAL'],
  painPoint: 'Gerade im Landkreis Straubing-Bogen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SR, BOG oder MAL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'strausberg': {
  intro: 'In Strausberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Strausberg', 'Fredersdorf-Vogelsdorf', 'Petershagen-Eggersdorf', 'Rüdersdorf', 'Altlandsberg', 'Rehfelde', 'Hoppegarten'],
  licensePlates: ['MOL', 'FRW', 'SEE', 'SRB'],
  painPoint: 'Gerade in Strausberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MOL, FRW, SEE oder SRB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'stutensee': {
  intro: 'In Stutensee möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen.',
  districts: ['Blankenloch', 'Friedrichstal', 'Spöck', 'Staffort', 'Karlsruhe', 'Eggenstein-Leopoldshafen', 'Weingarten'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Stutensee kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'suhl': {
  intro: 'In Suhl möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Suhl', 'Zella-Mehlis', 'Goldlauter', 'Heinrichs', 'Lautenberg', 'Mäbendorf', 'Dietzhausen'],
  licensePlates: ['SHL'],
  painPoint: 'Gerade in Suhl kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SHL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'sulzbach-rosenberg': {
  intro: 'In Sulzbach-Rosenberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Sulzbach-Rosenberg', 'Amberg', 'Kümmersbruck', 'Poppenricht', 'Hahnbach', 'Illschwang', 'Vilseck'],
  licensePlates: ['AS', 'SUL'],
  painPoint: 'Gerade in Sulzbach-Rosenberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AS oder SUL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'tauberbischofsheim': {
  intro: 'In Tauberbischofsheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Tauberbischofsheim', 'Distelhausen', 'Dittigheim', 'Dittwar', 'Hochhausen', 'Impfingen', 'Werbach'],
  licensePlates: ['TBB', 'MGH'],
  painPoint: 'Gerade in Tauberbischofsheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TBB oder MGH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'tecklenburg': {
  intro: 'In Tecklenburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Tecklenburg', 'Leeden', 'Brochterbeck', 'Ledde', 'Lengerich', 'Ibbenbüren', 'Lienen'],
  licensePlates: ['ST', 'TE', 'BF'],
  painPoint: 'Gerade in Tecklenburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ST, TE oder BF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'teltow-flaeming': {
  intro: 'Im Landkreis Teltow-Fläming möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Luckenwalde', 'Ludwigsfelde', 'Jüterbog', 'Zossen', 'Trebbin', 'Baruth', 'Dahme'],
  licensePlates: ['TF', 'JÜT', 'LUK', 'ZÜ'],
  painPoint: 'Gerade im Landkreis Teltow-Fläming kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TF, JÜT, LUK oder ZÜ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'teningen': {
  intro: 'In Teningen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Teningen', 'Köndringen', 'Nimburg', 'Heimbach', 'Emmendingen', 'Riegel', 'Malterdingen'],
  licensePlates: ['EM'],
  painPoint: 'Gerade in Teningen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'tettnang': {
  intro: 'In Tettnang möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Tettnang', 'Kau', 'Tannau', 'Langnau', 'Meckenbeuren', 'Friedrichshafen', 'Langenargen'],
  licensePlates: ['FN', 'TT'],
  painPoint: 'Gerade in Tettnang kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FN oder TT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'tirschenreuth': {
  intro: 'In Tirschenreuth möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Tirschenreuth', 'Kemnath', 'Mitterteich', 'Waldsassen', 'Erbendorf', 'Bärnau', 'Plößberg'],
  licensePlates: ['TIR', 'KEM'],
  painPoint: 'Gerade in Tirschenreuth kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TIR oder KEM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'titisee-neustadt': {
  intro: 'In Titisee-Neustadt möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Titisee', 'Neustadt', 'Langenordnach', 'Rudenberg', 'Schwärzenbach', 'Hinterzarten', 'Lenzkirch'],
  licensePlates: ['FR', 'NEU'],
  painPoint: 'Gerade in Titisee-Neustadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FR oder NEU abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'torgau': {
  intro: 'In Torgau möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Torgau', 'Beilrode', 'Dreiheide', 'Mockrehna', 'Dommitzsch', 'Belgern-Schildau', 'Oschatz'],
  licensePlates: ['TDO', 'TG', 'OZ', 'DZ', 'EB'],
  painPoint: 'Gerade in Torgau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TDO, TG, OZ, DZ oder EB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'traunstein': {
  intro: 'In Traunstein möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Traunstein', 'Trostberg', 'Traunreut', 'Siegsdorf', 'Waging am See', 'Ruhpolding', 'Chieming'],
  licensePlates: ['TS', 'LF'],
  painPoint: 'Gerade in Traunstein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TS oder LF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'trier': {
  intro: 'In Trier möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Trier-Mitte', 'Trier-Nord', 'Trier-Süd', 'Ehrang', 'Pfalzel', 'Olewig', 'Kürenz'],
  licensePlates: ['TR'],
  painPoint: 'Gerade in Trier kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'trier-saarburg': {
  intro: 'Im Landkreis Trier-Saarburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Konz', 'Saarburg', 'Hermeskeil', 'Schweich', 'Trierweiler', 'Zerf', 'Waldrach'],
  licensePlates: ['TR', 'SAB'],
  painPoint: 'Gerade im Landkreis Trier-Saarburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TR oder SAB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'tuttlingen': {
  intro: 'In Tuttlingen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Tuttlingen', 'Möhringen', 'Nendingen', 'Eßlingen', 'Wurmlingen', 'Mühlheim an der Donau', 'Spaichingen'],
  licensePlates: ['TUT'],
  painPoint: 'Gerade in Tuttlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TUT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'uckermark': {
  intro: 'In der Uckermark möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Prenzlau', 'Schwedt/Oder', 'Templin', 'Angermünde', 'Lychen', 'Brüssow', 'Gartz'],
  licensePlates: ['UM', 'ANG', 'PZ', 'SDT', 'TP'],
  painPoint: 'Gerade in der Uckermark kosten lange Wege, Termine und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UM, ANG, PZ, SDT oder TP abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'uelzen': {
  intro: 'In Uelzen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Uelzen', 'Bad Bevensen', 'Ebstorf', 'Suderburg', 'Bienenbüttel', 'Wrestedt', 'Rosche'],
  licensePlates: ['UE'],
  painPoint: 'Gerade in Uelzen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'uffenheim': {
  intro: 'In Uffenheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Uffenheim', 'Gollhofen', 'Ippesheim', 'Markt Nordheim', 'Simmershofen', 'Weigenheim', 'Bad Windsheim'],
  licensePlates: ['NEA', 'SEF', 'UFF'],
  painPoint: 'Gerade in Uffenheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NEA, SEF oder UFF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ulm': {
  intro: 'In Ulm möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Ulm-Mitte', 'Söflingen', 'Wiblingen', 'Böfingen', 'Eselsberg', 'Lehr', 'Jungingen'],
  licensePlates: ['UL'],
  painPoint: 'Gerade in Ulm kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'unna': {
  intro: 'In Unna möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Unna', 'Königsborn', 'Massen', 'Hemmerde', 'Lünern', 'Fröndenberg', 'Holzwickede'],
  licensePlates: ['UN', 'LH', 'LÜN'],
  painPoint: 'Gerade in Unna kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen UN, LH oder LÜN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'usingen': {
  intro: 'In Usingen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Usingen', 'Eschbach', 'Kransberg', 'Merzhausen', 'Wernborn', 'Wehrheim', 'Neu-Anspach'],
  licensePlates: ['HG', 'USI'],
  painPoint: 'Gerade in Usingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HG oder USI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'uslar': {
  intro: 'In Uslar möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Uslar', 'Bollensen', 'Eschershausen', 'Schoningen', 'Volpriehausen', 'Wiensen', 'Northeim'],
  licensePlates: ['NOM', 'EIN', 'GAN'],
  painPoint: 'Gerade in Uslar kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NOM, EIN oder GAN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'vaihingen-an-der-enz': {
  intro: 'In Vaihingen an der Enz möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Vaihingen an der Enz', 'Enzweihingen', 'Ensingen', 'Horrheim', 'Kleinglattbach', 'Riet', 'Roßwag'],
  licensePlates: ['LB', 'VAI'],
  painPoint: 'Gerade in Vaihingen an der Enz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LB oder VAI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'varel': {
  intro: 'In Varel möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Varel', 'Obenstrohe', 'Büppel', 'Dangast', 'Langendamm', 'Altjührden', 'Neuenwege'],
  licensePlates: ['FRI'],
  painPoint: 'Gerade in Varel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FRI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'vechta': {
  intro: 'In Vechta möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Vechta', 'Langförden', 'Lutten', 'Oythe', 'Calveslage', 'Bakum', 'Goldenstedt'],
  licensePlates: ['VEC'],
  painPoint: 'Gerade in Vechta kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VEC abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'verden': {
  intro: 'In Verden möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Verden', 'Dauelsen', 'Eitze', 'Borstel', 'Hönisch', 'Achim', 'Langwedel'],
  licensePlates: ['VER'],
  painPoint: 'Gerade in Verden kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VER abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'viersen': {
  intro: 'In Viersen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Viersen', 'Dülken', 'Süchteln', 'Boisheim', 'Nettetal', 'Kempen', 'Willich'],
  licensePlates: ['VIE', 'KK'],
  painPoint: 'Gerade in Viersen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VIE oder KK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'villingen-schwenningen': {
  intro: 'In Villingen-Schwenningen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Villingen', 'Schwenningen', 'Mühlhausen', 'Weigheim', 'Marbach', 'Obereschach', 'Pfaffenweiler'],
  licensePlates: ['VS', 'DON'],
  painPoint: 'Gerade in Villingen-Schwenningen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VS oder DON abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'vilsbiburg': {
  intro: 'In Vilsbiburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördengang erledigen.',
  districts: ['Vilsbiburg', 'Geisenhausen', 'Altfraunhofen', 'Bodenkirchen', 'Gerzen', 'Aham', 'Velden'],
  licensePlates: ['LA', 'VIB'],
  painPoint: 'Gerade in Vilsbiburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LA oder VIB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'vilshofen': {
  intro: 'In Vilshofen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Vilshofen', 'Aunkirchen', 'Sandbach', 'Pleinting', 'Zeitlarn', 'Garham', 'Ortenburg'],
  licensePlates: ['PA', 'VOF'],
  painPoint: 'Gerade in Vilshofen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen PA oder VOF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'vogelsbergkreis': {
  intro: 'Im Vogelsbergkreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten einzuplanen.',
  districts: ['Lauterbach', 'Alsfeld', 'Schotten', 'Homberg', 'Mücke', 'Grebenau', 'Herbstein'],
  licensePlates: ['VB', 'ALS', 'LAT'],
  painPoint: 'Gerade im Vogelsbergkreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VB, ALS oder LAT abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'vogtlandkreis': {
  intro: 'Im Vogtlandkreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Plauen', 'Auerbach', 'Reichenbach', 'Oelsnitz', 'Klingenthal', 'Markneukirchen', 'Falkenstein'],
  licensePlates: ['V', 'AE', 'PL', 'RC', 'OVL'],
  painPoint: 'Gerade im Vogtlandkreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen V, AE, PL, RC oder OVL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'vohenstrauss': {
  intro: 'In Vohenstrauß möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Vohenstrauß', 'Pleystein', 'Waidhaus', 'Moosbach', 'Leuchtenberg', 'Tännesberg', 'Waldthurn'],
  licensePlates: ['NEW', 'VOH', 'ESB'],
  painPoint: 'Gerade in Vohenstrauß kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen NEW, VOH oder ESB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'voelklingen': {
  intro: 'In Völklingen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Völklingen', 'Ludweiler', 'Geislautern', 'Wehrden', 'Fürstenhausen', 'Heidstock', 'Luisenthal'],
  licensePlates: ['SB', 'VK'],
  painPoint: 'Gerade in Völklingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen SB oder VK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'vorpommern-greifswald': {
  intro: 'Im Landkreis Vorpommern-Greifswald möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Greifswald', 'Anklam', 'Pasewalk', 'Ueckermünde', 'Wolgast', 'Strasburg', 'Heringsdorf'],
  licensePlates: ['VG', 'ANK', 'GW', 'PW', 'SBG', 'UEM', 'WLG'],
  painPoint: 'Gerade im Landkreis Vorpommern-Greifswald kosten lange Wege, Termine und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VG, ANK, GW, PW, SBG, UEM oder WLG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'vorpommern-ruegen': {
  intro: 'Im Landkreis Vorpommern-Rügen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Stralsund', 'Ribnitz-Damgarten', 'Grimmen', 'Bergen auf Rügen', 'Barth', 'Sassnitz', 'Putbus'],
  licensePlates: ['VR', 'GMN', 'NVP', 'RDG', 'RÜG', 'HST'],
  painPoint: 'Gerade im Landkreis Vorpommern-Rügen kosten lange Wege, Termine und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen VR, GMN, NVP, RDG, RÜG oder HST abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'waghaeusel': {
  intro: 'In Waghäusel möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Waghäusel', 'Kirrlach', 'Wiesental', 'Hambrücken', 'Oberhausen-Rheinhausen', 'Philippsburg', 'Graben-Neudorf'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Waghäusel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'waiblingen': {
  intro: 'In Waiblingen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und bequem erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Waiblingen', 'Beinstein', 'Hegnach', 'Hohenacker', 'Neustadt', 'Bittenfeld', 'Korb'],
  licensePlates: ['WN', 'BK'],
  painPoint: 'Gerade in Waiblingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WN oder BK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'waldbröl': {
  intro: 'In Waldbröl möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Waldbröl', 'Nümbrecht', 'Morsbach', 'Reichshof', 'Wiehl', 'Bielstein', 'Gummersbach'],
  licensePlates: ['GM'],
  painPoint: 'Gerade in Waldbröl kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'waldkirch': {
  intro: 'In Waldkirch möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Waldkirch', 'Kollnau', 'Buchholz', 'Suggental', 'Siensbach', 'Denzlingen', 'Glottertal'],
  licensePlates: ['EM'],
  painPoint: 'Gerade in Waldkirch kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'waldkraiburg': {
  intro: 'In Waldkraiburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Waldkraiburg', 'Mühldorf am Inn', 'Ampfing', 'Aschau am Inn', 'Heldenstein', 'Kraiburg am Inn', 'Töging am Inn'],
  licensePlates: ['MÜ', 'WAS'],
  painPoint: 'Gerade in Waldkraiburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MÜ oder WAS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'waldmuenchen': {
  intro: 'In Waldmünchen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Waldmünchen', 'Cham', 'Furth im Wald', 'Rötz', 'Tiefenbach', 'Treffelstein', 'Schönthal'],
  licensePlates: ['CHA', 'WÜM', 'ROD', 'KÖZ'],
  painPoint: 'Gerade in Waldmünchen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen CHA, WÜM, ROD oder KÖZ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'waldshut-tiengen': {
  intro: 'In Waldshut-Tiengen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördengang erledigen.',
  districts: ['Waldshut', 'Tiengen', 'Tiengen-West', 'Gurtweil', 'Aichen', 'Indlekofen', 'Krenkingen'],
  licensePlates: ['WT', 'SÄK'],
  painPoint: 'Gerade in Waldshut-Tiengen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WT oder SÄK abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'wangen': {
  intro: 'In Wangen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Wangen', 'Niederwangen', 'Neuravensburg', 'Deuchelried', 'Leupolz', 'Schomburg', 'Primisweiler'],
  licensePlates: ['RV', 'WG'],
  painPoint: 'Gerade in Wangen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RV oder WG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'wangen-im-allgaeu': {
  intro: 'In Wangen im Allgäu möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Wangen im Allgäu', 'Niederwangen', 'Neuravensburg', 'Deuchelried', 'Leupolz', 'Schomburg', 'Primisweiler'],
  licensePlates: ['RV', 'WG'],
  painPoint: 'Gerade in Wangen im Allgäu kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RV oder WG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'warburg': {
  intro: 'In Warburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Warburg', 'Scherfede', 'Bonenburg', 'Daseburg', 'Germete', 'Ossendorf', 'Rimbeck'],
  licensePlates: ['HX', 'WAR'],
  painPoint: 'Gerade in Warburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HX oder WAR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'waren-mueritz': {
  intro: 'In Waren an der Müritz möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Waren', 'Papenberg', 'Eldenholz', 'Jägerhof', 'Rügeband', 'Alt Falkenhagen', 'Neu Falkenhagen'],
  licensePlates: ['MSE', 'MÜR', 'DM', 'MST', 'NZ', 'RM'],
  painPoint: 'Gerade in Waren an der Müritz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MSE, MÜR, DM, MST, NZ oder RM abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'warendorf': {
  intro: 'In Warendorf möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Warendorf', 'Freckenhorst', 'Hoetmar', 'Milte', 'Everswinkel', 'Sassenberg', 'Beelen'],
  licensePlates: ['WAF', 'BE'],
  painPoint: 'Gerade in Warendorf kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WAF oder BE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'wasserburg': {
  intro: 'In Wasserburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Wasserburg am Inn', 'Reitmehring', 'Attel', 'Edling', 'Rott am Inn', 'Babensham', 'Eiselfing'],
  licensePlates: ['RO', 'WS'],
  painPoint: 'Gerade in Wasserburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen RO oder WS abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'weiden-in-der-oberpfalz': {
  intro: 'In Weiden in der Oberpfalz möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Weiden', 'Hammerweg', 'Rehbühl', 'Stockerhut', 'Moosbürg', 'Rothenstadt', 'Neunkirchen'],
  licensePlates: ['WEN'],
  painPoint: 'Gerade in Weiden in der Oberpfalz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WEN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'weil-der-stadt': {
  intro: 'In Weil der Stadt möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin einzuplanen.',
  districts: ['Weil der Stadt', 'Merklingen', 'Münklingen', 'Schafhausen', 'Hausen', 'Renningen', 'Magstadt'],
  licensePlates: ['BB', 'LEO'],
  painPoint: 'Gerade in Weil der Stadt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BB oder LEO abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'weilburg': {
  intro: 'In Weilburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördengang erledigen.',
  districts: ['Weilburg', 'Ahausen', 'Drommershausen', 'Hirschhausen', 'Kubach', 'Odersbach', 'Waldhausen'],
  licensePlates: ['LM', 'WEL'],
  painPoint: 'Gerade in Weilburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LM oder WEL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'weilheim': {
  intro: 'In Weilheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Weilheim', 'Marnbach', 'Deutenhausen', 'Unterhausen', 'Polling', 'Wielenbach', 'Peißenberg'],
  licensePlates: ['WM', 'SOG'],
  painPoint: 'Gerade in Weilheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WM oder SOG abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'weilheim-am-rhein': {
  intro: 'In Weil am Rhein möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Weil am Rhein', 'Friedlingen', 'Haltingen', 'Ötlingen', 'Märkt', 'Kleinhüningen-Nähe', 'Alt-Weil'],
  licensePlates: ['LÖ'],
  painPoint: 'Gerade in Weil am Rhein kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen LÖ abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders bequem bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'weimar': {
  intro: 'In Weimar möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Weimar', 'Schöndorf', 'Oberweimar', 'Ehringsdorf', 'Tiefurt', 'Tröbsdorf', 'Gelmeroda'],
  licensePlates: ['WE'],
  painPoint: 'Gerade in Weimar kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen WE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'weimarer-land': {
  intro: 'Im Weimarer Land möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Apolda', 'Bad Berka', 'Blankenhain', 'Kranichfeld', 'Magdala', 'Buttelstedt', 'Mellingen'],
  licensePlates: ['AP', 'APD'],
  painPoint: 'Gerade im Weimarer Land kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen AP oder APD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'weinheim': {
  intro: 'In Weinheim möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Weinheim', 'Lützelsachsen', 'Hohensachsen', 'Sulzbach', 'Rippenweier', 'Oberflockenbach', 'Ritschweier'],
  licensePlates: ['HD'],
  painPoint: 'Gerade in Weinheim kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'weinsberg': {
  intro: 'In Weinsberg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Weinsberg', 'Gellmersbach', 'Grantschen', 'Wimmental', 'Ellhofen', 'Lehrensteinsfeld', 'Obersulm'],
  licensePlates: ['HN'],
  painPoint: 'Gerade in Weinsberg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HN abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zeitz': {
  intro: 'In Zeitz möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Zeitz', 'Theißen', 'Kayna', 'Würchwitz', 'Nonnewitz', 'Tröglitz', 'Droyßig'],
  licensePlates: ['BLK', 'ZZ', 'NEB', 'NMB', 'WSF'],
  painPoint: 'Gerade in Zeitz kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BLK, ZZ, NEB, NMB oder WSF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zerbst': {
  intro: 'In Zerbst möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördengang erledigen.',
  districts: ['Zerbst', 'Ankuhn', 'Bias', 'Jütrichau', 'Lindau', 'Steutz', 'Walternienburg'],
  licensePlates: ['ABI', 'AZE', 'BTF', 'KÖT', 'ZE'],
  painPoint: 'Gerade in Zerbst kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ABI, AZE, BTF, KÖT oder ZE abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zeven': {
  intro: 'In Zeven möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Zeven', 'Aspe', 'Badenstedt', 'Brauel', 'Brüttendorf', 'Oldendorf', 'Heeslingen'],
  licensePlates: ['ROW', 'BRV'],
  painPoint: 'Gerade in Zeven kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ROW oder BRV abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zittau': {
  intro: 'In Zittau möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Zittau', 'Pethau', 'Eichgraben', 'Hirschfelde', 'Dittelsdorf', 'Schlegel', 'Olbersdorf'],
  licensePlates: ['GR', 'ZI', 'LÖB', 'NOL', 'NY', 'WSW'],
  painPoint: 'Gerade in Zittau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen GR, ZI, LÖB, NOL, NY oder WSW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zollernalbkreis': {
  intro: 'Im Zollernalbkreis möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Balingen', 'Albstadt', 'Hechingen', 'Burladingen', 'Meßstetten', 'Rosenfeld', 'Schömberg'],
  licensePlates: ['BL', 'HECH'],
  painPoint: 'Gerade im Zollernalbkreis kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen BL oder HECH abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zossen': {
  intro: 'In Zossen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Zossen', 'Wünsdorf', 'Dabendorf', 'Glienick', 'Kallinchen', 'Nächst Neuendorf', 'Schünow'],
  licensePlates: ['TF'],
  painPoint: 'Gerade in Zossen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen TF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zulassungsservice-erfurt': {
  intro: 'In Erfurt möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Behördentermin einzuplanen.',
  districts: ['Erfurt', 'Altstadt', 'Andreasvorstadt', 'Daberstedt', 'Ilversgehofen', 'Melchendorf', 'Gispersleben'],
  licensePlates: ['EF'],
  painPoint: 'Gerade in Erfurt kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen EF abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zulassungsservice-halle-saale': {
  intro: 'In Halle (Saale) möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Halle', 'Innenstadt', 'Neustadt', 'Giebichenstein', 'Südstadt', 'Trotha', 'Dölau'],
  licensePlates: ['HAL'],
  painPoint: 'Gerade in Halle (Saale) kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen HAL abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zulassungsservice-hannover': {
  intro: 'In Hannover möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Hannover', 'List', 'Linden', 'Südstadt', 'Bothfeld', 'Döhren', 'Ricklingen'],
  licensePlates: ['H'],
  painPoint: 'Gerade in Hannover kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen H abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zulassungsservice-kiel': {
  intro: 'In Kiel möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne zusätzlichen Behördengang erledigen.',
  districts: ['Kiel', 'Gaarden', 'Wik', 'Mettenhof', 'Suchsdorf', 'Elmschenhagen', 'Russee'],
  licensePlates: ['KI'],
  painPoint: 'Gerade in Kiel kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KI abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zulassungsservice-magdeburg': {
  intro: 'In Magdeburg möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wartezeiten oder zusätzliche Wege.',
  districts: ['Magdeburg', 'Stadtfeld', 'Buckau', 'Sudenburg', 'Reform', 'Olvenstedt', 'Cracau'],
  licensePlates: ['MD'],
  painPoint: 'Gerade in Magdeburg kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen MD abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zulassungsservice-stuttgart': {
  intro: 'In Stuttgart möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Stuttgart-Mitte', 'Bad Cannstatt', 'Feuerbach', 'Vaihingen', 'Zuffenhausen', 'Möhringen', 'Degerloch'],
  licensePlates: ['S'],
  painPoint: 'Gerade in Stuttgart kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen S abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Verkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zweibruecken': {
  intro: 'In Zweibrücken möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Zweibrücken', 'Bubenhausen', 'Ernstweiler', 'Ixheim', 'Mörsbach', 'Niederauerbach', 'Rimschweiler'],
  licensePlates: ['ZW'],
  painPoint: 'Gerade in Zweibrücken kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen ZW abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'zwickau': {
  intro: 'In Zwickau möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne lange Wege oder Wartezeiten.',
  districts: ['Zwickau', 'Pölbitz', 'Marienthal', 'Planitz', 'Eckersbach', 'Cainsdorf', 'Oberhohndorf'],
  licensePlates: ['Z', 'GC', 'HOT', 'WDA'],
  painPoint: 'Gerade in Zwickau kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen Z, GC, HOT oder WDA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oehringen': {
  intro: 'In Öhringen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra einen Termin oder lange Wege einzuplanen.',
  districts: ['Öhringen', 'Cappel', 'Verrenberg', 'Michelbach', 'Ohrnberg', 'Möglingen', 'Schwöllbronn'],
  licensePlates: ['KÜN', 'ÖHR'],
  painPoint: 'Gerade in Öhringen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KÜN oder ÖHR abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders praktisch bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'oestringen': {
  intro: 'In Östringen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell und ohne unnötige Wege erledigen.',
  districts: ['Östringen', 'Odenheim', 'Tiefenbach', 'Eichelberg', 'Waldangelloch', 'Zeutern', 'Ubstadt-Weiher'],
  licensePlates: ['KA'],
  painPoint: 'Gerade in Östringen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen KA abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Der digitale Ablauf ist besonders bequem bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},

'ueberlingen': {
  intro: 'In Überlingen möchten viele Fahrzeughalter ihre Auto-Abmeldung schnell erledigen, ohne extra zur Zulassungsstelle zu fahren.',
  districts: ['Überlingen', 'Nußdorf', 'Deisendorf', 'Bonndorf', 'Lippertsreute', 'Nesselwangen', 'Bambergen'],
  licensePlates: ['FN', 'TT', 'ÜB'],
  painPoint: 'Gerade in Überlingen kosten Termine, Anfahrt und Wartezeit oft unnötig viel Zeit.',
  authorityHint: 'Wer sein Fahrzeug mit Kennzeichen FN, TT oder ÜB abmelden möchte, kann den Vorgang online vorbereiten.',
  conversionText: 'Die Online-Abmeldung ist besonders hilfreich bei Fahrzeugverkauf, Stilllegung oder Fahrzeugwechsel.',
},
