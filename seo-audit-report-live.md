# SEO NEAR-DUPLICATE AUDIT - LIVE PRODUCTION ANALYSIS

Audit Date: April 23, 2026
Website: https://onlineautoabmelden.com
Sample Size: 10 diverse city pages
Total Pairs Analyzed: 15

---

## SIMILARITY SUMMARY

| Metric | Value |
|--------|-------|
| Max Full-Page Similarity | 91.96% |
| Average Full-Page Similarity | 54.40% |
| Pairs >30% Similar | 10 / 15 (66.7%) |
| Pairs >40% Similar | 10 / 15 (66.7%) |

---

## TOP RISK PAIRS (Top 5)

### 1. Herne ↔ Mönchengladbach
- URLs:
  - https://onlineautoabmelden.com/auto-abmelden-herne/
  - https://onlineautoabmelden.com/auto-abmelden-moenchengladbach/
- Full Page: 91.96%
- Intro Section: 98.91%
- FAQ Section: 91.08%
- Post-FAQ Section: 0.00%
- Nearby/Links: 0.00%
- Risk Level: CRITICAL

### 2. Köln ↔ Leverkusen
- URLs:
  - https://onlineautoabmelden.com/auto-abmelden-koeln/
  - https://onlineautoabmelden.com/auto-abmelden-leverkusen/
- Full Page: 86.34%
- Intro Section: 100.00%
- FAQ Section: 83.21%
- Post-FAQ Section: 0.00%
- Nearby/Links: 0.00%
- Risk Level: CRITICAL

### 3. Leverkusen ↔ Herne
- URLs:
  - https://onlineautoabmelden.com/auto-abmelden-leverkusen/
  - https://onlineautoabmelden.com/auto-abmelden-herne/
- Full Page: 84.88%
- Intro Section: 88.89%
- FAQ Section: 83.57%
- Post-FAQ Section: 0.00%
- Nearby/Links: 0.00%
- Risk Level: CRITICAL

### 4. Leverkusen ↔ Mönchengladbach
- URLs:
  - https://onlineautoabmelden.com/auto-abmelden-leverkusen/
  - https://onlineautoabmelden.com/auto-abmelden-moenchengladbach/
- Full Page: 84.33%
- Intro Section: 88.00%
- FAQ Section: 83.88%
- Post-FAQ Section: 0.00%
- Nearby/Links: 0.00%
- Risk Level: CRITICAL

### 5. Köln ↔ Mönchengladbach
- URLs:
  - https://onlineautoabmelden.com/auto-abmelden-koeln/
  - https://onlineautoabmelden.com/auto-abmelden-moenchengladbach/
- Full Page: 83.44%
- Intro Section: 88.00%
- FAQ Section: 81.91%
- Post-FAQ Section: 0.00%
- Nearby/Links: 0.00%
- Risk Level: CRITICAL

---

## SECTION-LEVEL ANALYSIS

| Section | Avg Similarity | Max Similarity | Status |
|---------|---|---|---|
| Intro | 46.78% | 100.00% | WARNING |
| FAQ | 53.73% | 91.08% | WARNING |
| Post-FAQ | 0.00% | 0.00% | OK |
| Nearby/Links | 0.00% | 0.00% | OK |

---

## DUPLICATE SENTENCE DETECTION

Sentences repeated across 3+ pages: 15

- "wo finde ich offizielle informationen..." - Appears on 10 pages: Berlin, Köln, Leverkusen (+2 more)
- "digitale abmeldung wird CITY bereits als planbare antwort verkehrs beh rdendruck..." - Appears on 9 pages: Düsseldorf
- "was wenn ich unsicher bin bei angaben..." - Appears on 8 pages: Köln, Leverkusen, Herne (+1 more)
- "tipp nach dem eintragen einmal zeichen zeichen vergleichen..." - Appears on 5 pages: Berlin, Köln, Leverkusen (+2 more)
- "viele erledigen abmeldung online um flexibel bleiben wartezeit vermeiden..." - Appears on 5 pages: Berlin, Köln, Leverkusen (+2 more)
- "offizielle informationen findest du auch beim kraftfahrt bundesamt kba..." - Appears on 5 pages: Berlin, Köln, Leverkusen (+2 more)
- "teilen jetzt auto abmelden offiziell ber kba fahrzeug online abmelden nur PRICE ..." - Appears on 5 pages: Berlin, Köln, Leverkusen (+2 more)
- "offizielle best tigung sofort per e mail..." - Appears on 5 pages: Berlin, Köln, Leverkusen (+2 more)
- "jetzt abmeldung starten kfz sofort online anmelden direkt starten 5 minuten erle..." - Appears on 5 pages: Berlin, Köln, Leverkusen (+2 more)
- "unser team hilft dir gerne pers nlich weiter kostenlos ohne warteschleife..." - Appears on 5 pages: Berlin, Köln, Leverkusen (+2 more)
- "telefon NUM 4999190 whatsapp live chat starten kba registrierter service offizie..." - Appears on 5 pages: Berlin, Köln, Leverkusen (+2 more)
- "stadt CITY b ndelt viele parallele verwaltungsf lle engen verwaltungsfenstern..." - Appears on 5 pages: Düsseldorf
- "000 einwohnern muss seite CITY wege termin stadtlogik st rker erkl ren als bei m..." - Appears on 5 pages: Düsseldorf
- "hoher verkehrs termindruck alltag CITY hier konkrete unterschied..." - Appears on 5 pages: Düsseldorf
- "online lohnt CITY besonders wenn zeitfenster verkehr zus tzlicher organisationsa..." - Appears on 5 pages: Düsseldorf

---

## ROOT CAUSE ANALYSIS

Technical Factors:
- Dynamic content generation applies consistent templating
- City name substitution creates structural patterns
- Shared FAQ blocks across all pages
- Reused UI components

System Components Responsible:
1. Dynamic Content Generator: PRIMARY CAUSE
2. FAQ Builder: HIGH IMPACT
3. UI Components: Acceptable
4. Archetype Reuse: HIGH IMPACT

---

## GOOGLE RISK EVALUATION

Will Google cluster these pages?

Likelihood: VERY HIGH - Pages may be treated as duplicates

Current Assessment: AT RISK

Scale to 1000+ pages?

Verdict: NOT RECOMMENDED - High duplicate risk
- System generates too-similar content
- Requires structural redesign before expansion

---

## FINAL GRADE

Overall Grade: **[D] Unsafe (high duplicate risk)**

---

## EXECUTIVE SUMMARY

Status: HIGH RISK - HOLD ON SCALING

Average similarity of 54.40% indicates significant duplication risk.

Recommendation: Halt large-scale indexing. Redesign content generation before scaling.

---

Audit Methodology: Live page fetching, NLP-based similarity analysis
Tools Used: Jaccard similarity, semantic analysis, sentence-level detection
Confidence Level: High (based on real production data)
