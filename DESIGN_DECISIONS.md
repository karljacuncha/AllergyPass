# AllergyPass - Design Decisions

This document records key architectural and UX decisions made during development, along with the reasoning behind them.

---

## 1. Language & Translation Architecture

### Decision: Direct Communication Over Grammatical Perfection

**What:** AllergyPass uses direct, pronoun-neutral phrasing (e.g., "Allergic to peanuts" rather than "I am allergic to peanuts").

**Why:**

**Emergency Clarity**  
In medical emergencies, the critical information is _what_ the allergy is, not _who_ has it. Direct phrases eliminate ambiguity and get straight to the point.

**Translation Simplicity**  
Pronouns require:

- Verb conjugation changes (Spanish: "Soy alérgico" vs "Ella es alérgica")
- Gender agreement (French adjectives change with gender)
- Different sentence structures across languages
- 4× the translation work (I/he/she/they for each phrase)

This complexity increases translation errors and maintenance burden without improving safety.

**Lightweight Bundle**  
We use dynamic JSON imports (~50KB total) instead of i18n libraries like i18next (~20KB + dependencies). For ~25 translatable strings, a full i18n framework is unnecessary overhead.

**Community Contribution**  
Simple JSON translation files make it easy for non-technical translators to contribute. Adding grammatical complexity would require linguistic expertise for each language.

**Universal Understanding**  
"Allergic to peanuts" works whether you're showing the card for yourself or a family member. Medical staff understand immediately without needing context about relationships.

**Inclusivity**  
Neutral phrasing avoids gendered language entirely, making the app naturally inclusive without requiring pronoun selection or complex gender-agreement logic across 10+ languages.

**Alternative Considered:**  
We considered adding a "Relationship" field (e.g., "Sarah (Daughter)") to provide context without grammatical complexity, but decided this was unnecessary for v1.0. The allergy information itself is what matters in critical situations.

**Future Consideration:**  
If user feedback strongly indicates that pronoun support would significantly improve the experience, we may revisit this for major languages in a future release. However, the current approach prioritizes translation accuracy, maintainability, emergency clarity, and inclusivity over grammatical nuance.

---

## 2. No i18n Library (i18next, FormatJS, etc.)

**What:** We use plain JSON files with dynamic imports instead of a dedicated i18n framework.

**Why:**

**Right-Sizing:**

- We have ~25 UI strings and ~6 phrase templates
- i18next adds ~20KB + plugin overhead
- Our approach: ~50KB total for all 10 languages
- The complexity-to-benefit ratio doesn't justify a framework

**Simplicity:**

```javascript
// Our approach
import(`/translations/${lang}.json`).then((m) => m.default);

// vs i18next setup
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
// ... 20+ lines of configuration
```

**Performance:**

- Dynamic imports = code splitting = smaller initial bundle
- Only load languages user actually needs
- No runtime interpolation engine

**Maintainability:**

- Translation files are just JSON - any developer can edit them
- No framework-specific syntax to learn
- No breaking changes when framework updates
- Easy for community contributors

**What We Lose:**

- Pluralization rules (not needed - we list allergies directly)
- Gender/case declension (see decision #1)
- Nested translations (flat structure is fine for our scale)
- Interpolation with formatting (we use template literals)

**What We Keep:**

- Dynamic language switching
- Lazy loading
- Type safety (via TypeScript if we add it)
- Full control over bundle size

**Future Consideration:**  
If we expand to 50+ languages or add complex features like date/number formatting, we'll revisit. Current threshold: stay manual until it becomes a maintenance burden.

---

## 3. [Placeholder for Future Decisions]

As the project evolves, we'll document additional design decisions here, such as:

- State management choices
- Routing decisions
- PWA strategy
- Component architecture
- Testing approach
- Deployment pipeline
- Feature prioritization
- etc.

---

## Document History

| Version | Date       | Author  | Changes                       |
| ------- | ---------- | ------- | ----------------------------- |
| 1.0     | 2026-02-22 | Initial | Added pronouns/i18n decisions |

---

**Contributing to This Document**

When making significant architectural decisions, please:

1. Document the decision here
2. Explain _why_ it was made (alternatives considered, trade-offs)
3. Note any future conditions that might change the decision
4. Keep it concise but complete
