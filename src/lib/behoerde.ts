import fs from 'fs';
import path from 'path';

type BehoerdeCsvRow = {
  code: string;
  stadt: string;
  bundesland: string;
  behoerde_name: string;
  plz: string;
  ort: string;
  strasse: string;
  telefon: string;
  email: string;
};

export type LokaleBehoerde = {
  code: string;
  stadt: string;
  bundesland: string;
  name: string;
  plz: string;
  ort: string;
  adresse: string;
  telefon: string;
  email: string;
};

const CSV_PATH = path.join(process.cwd(), 'src/data/av1_2026_04_csv.csv');

let cachedRows: BehoerdeCsvRow[] | null = null;

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function loadBehoerden(): BehoerdeCsvRow[] {
  if (cachedRows) return cachedRows;

  const raw = fs.readFileSync(CSV_PATH, 'utf8');

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const [, ...dataLines] = lines;

  cachedRows = dataLines
    .map((line) => {
      const cols = splitCsvLine(line);

      return {
        code: cols[0] ?? '',
        stadt: cols[1] ?? '',
        bundesland: cols[2] ?? '',
        behoerde_name: cols[3] ?? '',
        plz: cols[4] ?? '',
        ort: cols[5] ?? '',
        strasse: cols[6] ?? '',
        telefon: cols[7] ?? '',
        email: cols[8] ?? '',
      };
    })
    .filter((row) => row.stadt || row.ort || row.behoerde_name);

  return cachedRows;
}

function normalizeStrict(value: string = ''): string {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[()]/g, ' ')
    .replace(/[\/_,.;:]+/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeLoose(value: string = ''): string {
  return normalizeStrict(value)
    .replace(/\b(?:landkreis|kreis|lk|lra|stadt|nebenstelle|hauptstelle|zentrale)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compact(value: string = ''): string {
  return normalizeStrict(value).replace(/\s+/g, '');
}

function compactLoose(value: string = ''): string {
  return normalizeLoose(value).replace(/\s+/g, '');
}

function buildNeedles(cityName: string): string[] {
  const values = new Set<string>();

  const strict = normalizeStrict(cityName);
  const loose = normalizeLoose(cityName);
  const strictCompact = compact(cityName);
  const looseCompact = compactLoose(cityName);

  if (strict) values.add(strict);
  if (loose) values.add(loose);
  if (strictCompact) values.add(strictCompact);
  if (looseCompact) values.add(looseCompact);

  return [...values].filter(Boolean);
}

function getRowScore(
  row: BehoerdeCsvRow,
  needles: string[],
  bundesland?: string
): number {
  const candidates = [
    { value: normalizeStrict(row.stadt), exact: 140, partial: 110 },
    { value: normalizeLoose(row.stadt), exact: 138, partial: 108 },
    { value: compact(row.stadt), exact: 136, partial: 106 },
    { value: compactLoose(row.stadt), exact: 134, partial: 104 },

    { value: normalizeStrict(row.ort), exact: 125, partial: 100 },
    { value: normalizeLoose(row.ort), exact: 123, partial: 98 },
    { value: compact(row.ort), exact: 121, partial: 96 },
    { value: compactLoose(row.ort), exact: 119, partial: 94 },

    { value: normalizeStrict(row.behoerde_name), exact: 115, partial: 92 },
    { value: normalizeLoose(row.behoerde_name), exact: 113, partial: 90 },
    { value: compact(row.behoerde_name), exact: 111, partial: 88 },
    { value: compactLoose(row.behoerde_name), exact: 109, partial: 86 },
  ];

  let score = 0;

  for (const needle of needles) {
    for (const candidate of candidates) {
      if (!candidate.value) continue;

      if (candidate.value === needle) {
        score = Math.max(score, candidate.exact);
        continue;
      }

      if (
        candidate.value.includes(needle) ||
        needle.includes(candidate.value)
      ) {
        score = Math.max(score, candidate.partial);
      }
    }
  }

  if (score === 0) return 0;

  if (bundesland && row.bundesland === bundesland) {
    score += 15;
  }

  if (!/nebenstelle/i.test(row.behoerde_name)) {
    score += 4;
  }

  return score;
}

export function getLokaleBehoerde(
  cityName: string,
  bundesland?: string
): LokaleBehoerde | null {
  const rows = loadBehoerden();
  const needles = buildNeedles(cityName);

  const matches = rows
    .map((row) => ({
      row,
      score: getRowScore(row, needles, bundesland),
    }))
    .filter((item) => item.score >= 86)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      const aIsNebenstelle = /nebenstelle/i.test(a.row.behoerde_name);
      const bIsNebenstelle = /nebenstelle/i.test(b.row.behoerde_name);

      if (aIsNebenstelle !== bIsNebenstelle) {
        return Number(aIsNebenstelle) - Number(bIsNebenstelle);
      }

      return a.row.behoerde_name.length - b.row.behoerde_name.length;
    });

  if (!matches.length) return null;

  const best = matches[0].row;

  return {
    code: best.code,
    stadt: best.stadt,
    bundesland: best.bundesland,
    name: best.behoerde_name,
    plz: best.plz,
    ort: best.ort,
    adresse: best.strasse,
    telefon: best.telefon,
    email: best.email,
  };
}
