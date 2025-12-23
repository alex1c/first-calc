# Standards Section - SEO & Safety Audit

**Date:** 2024-01-25  
**Scope:** Standards pages (Eurocode 1, Eurocode 2, ISO Soil & Foundations)  
**Purpose:** Ensure SEO compliance and safety, prevent search engine penalties

---

## 1. COMPLIANCE CLAIMS CHECK ✅

### Status: PASSED (with minor fix applied)

**Checked:**
- ✅ No claims of "compliant", "certified", "meets standard X"
- ✅ No "according to standard" language in main content
- ✅ Engineering Context blocks use safe wording: "based on common principles", "described in"

**Fixed:**
- ❌ **FAQ section** had phrase "according to this standard" → **FIXED**
  - Changed to: "This page provides educational context about the standard. For actual design work, consult the official standard documents and qualified engineers."

**Current Wording (Safe):**
- "This calculator is based on common principles described in Eurocode 2"
- "Load assumptions are described in Eurocode 1"
- "Soil behavior principles are explained in ISO geotechnical standards"

---

## 2. DISCLAIMERS ✅

### Status: PASSED

**Eurocode 1:**
- ✅ Disclaimer present (yellow/amber styling)
- ✅ States: "Calculators provide estimation only"
- ✅ States: "Not a substitute for professional engineering design"
- ✅ Mentions local building codes requirement

**Eurocode 2:**
- ✅ Disclaimer present (yellow/amber styling)
- ✅ States: "Estimation tool and educational resource"
- ✅ States: "Not a substitute for professional engineering design"
- ✅ Mentions Eurocode 2 compliance requires professional verification

**ISO Soil & Foundations:**
- ✅ Strong disclaimer present (red styling - more prominent)
- ✅ States: "Calculators are for estimation only"
- ✅ States: "Soil properties cannot be assumed without proper geotechnical testing"
- ✅ States: "Always consult qualified geotechnical engineers"
- ✅ States: "Not a substitute for geotechnical engineering services"

**All disclaimers:**
- ✅ Prominently displayed
- ✅ Clear, unambiguous language
- ✅ No legal liability claims
- ✅ Educational resource positioning

---

## 3. SCHEMA.ORG ✅

### Status: PASSED

**Schema Type:**
- ✅ All standards use `TechArticle` (not `LegalDocument` or `Legislation`)
- ✅ Correctly indicates educational/technical content

**Schema Fields:**
- ✅ `@type`: "TechArticle"
- ✅ `headline`: Standard title
- ✅ `about`: Topic keywords (e.g., "soil mechanics", "geotechnical engineering")
- ✅ `url`: Canonical URL
- ✅ `description`: Short description
- ✅ `inLanguage`: Locale

**ISO Soil & Foundations:**
- ✅ Special handling: `about` field includes array: ["soil mechanics", "geotechnical engineering", "foundations"]

**Result:**
- ✅ Pages correctly marked as educational/technical articles
- ✅ NOT marked as legal documents
- ✅ Search engines will understand these are explanatory hubs, not normative standards

---

## 4. INTERNAL LINKING ✅

### Status: PASSED

**Standards → Calculators:**
- ✅ Logical grouping (Foundations, Concrete, Reinforcement)
- ✅ Contextual descriptions for each calculator
- ✅ Limited to 6-8 calculators per standard (not spammy)
- ✅ Natural, educational context

**Calculators → Standards:**
- ✅ Engineering Context blocks are informational, not promotional
- ✅ One standard per calculator (no over-linking)
- ✅ Safe wording: "based on common principles", "described in"
- ✅ No compliance claims

**Standards → Learn Articles:**
- ✅ Related articles linked naturally
- ✅ Educational context
- ✅ Not excessive (typically 1-3 articles per standard)

**Link Quality:**
- ✅ All links are crawlable (standard `<Link>` components)
- ✅ No `nofollow` attributes (default behavior is correct)
- ✅ Links add value and context
- ✅ No link farming or spam patterns

---

## 5. CONTENT POSITIONING ✅

### Status: PASSED

**Page Titles:**
- ✅ Eurocode 1: "Eurocode 1 (EN 1991) – Structural Loads Explained"
- ✅ Eurocode 2: "Eurocode 2 (EN 1992) – Concrete Structures Explained"
- ✅ ISO: "Soil and Foundation Basics – ISO Geotechnical Principles Explained"
- ✅ All include "Explained" - indicates educational content

**Meta Descriptions:**
- ✅ Focus on "Learn", "explain", "understand"
- ✅ No claims of being official standards
- ✅ Educational positioning

**Page Content:**
- ✅ Hub pages (Eurocode 1, 2, ISO) have NO formulas/tables from standards
- ✅ Conceptual explanations only
- ✅ Clear educational tone
- ✅ Multiple disclaimers throughout

**H1 Tags:**
- ✅ All use "Explained" or educational language
- ✅ No "Official Standard" or "Legal Document" language

---

## 6. ROBOTS & INDEXING ✅

### Status: PASSED

**Robots Meta:**
- ✅ No `noindex` directives (pages should be indexed)
- ✅ No `nofollow` on internal links (default behavior)
- ✅ Pages are indexable as educational content

**Content Type Signals:**
- ✅ Schema.org `TechArticle` clearly signals educational content
- ✅ Page titles and descriptions emphasize "explained", "learn", "understand"
- ✅ No legal document language
- ✅ Disclaimers reinforce educational nature

**Result:**
- ✅ Pages will be indexed as educational/technical articles
- ✅ NOT indexed as legal documents or official standards
- ✅ Search engines understand these are explanatory hubs

---

## 7. KEYWORD USAGE ✅

### Status: PASSED

**Keywords:**
- ✅ Educational focus: "explained", "learn", "understand", "basics"
- ✅ No compliance keywords: "compliant", "certified", "approved"
- ✅ No legal keywords: "official", "authoritative", "binding"

**Meta Keywords:**
- ✅ Technical/educational terms only
- ✅ No compliance claims in keywords
- ✅ Relevant to content without being spammy

---

## 8. FINDINGS SUMMARY

### ✅ PASSED ITEMS:
1. No compliance claims in main content
2. Strong disclaimers present on all hub pages
3. Schema.org correctly uses TechArticle
4. Internal links are logical and contextual
5. Pages positioned as educational, not legal documents
6. Safe wording throughout ("based on", "described in", "explained")

### ⚠️ FIXED ITEMS:
1. **FAQ section** - Removed "according to this standard" language
   - **Fixed:** Changed to educational positioning language

### 📋 RECOMMENDATIONS:

1. **Monitor:** Keep checking for any compliance language in future content
2. **Consistency:** Ensure all new standards follow the same disclaimer pattern
3. **Schema:** Continue using TechArticle for all standards (never LegalDocument)
4. **Links:** Maintain current linking strategy (contextual, educational, not spammy)

---

## 9. COMPLIANCE CHECKLIST

- [x] No "compliant", "certified", "meets standard" claims
- [x] Strong disclaimers on all hub pages
- [x] Schema.org uses TechArticle (not LegalDocument)
- [x] Internal links are contextual and educational
- [x] Pages clearly positioned as educational hubs
- [x] No legal document language
- [x] Safe wording: "based on", "described in", "explained"
- [x] Disclaimers mention professional engineering requirement
- [x] No robots directives blocking indexing
- [x] Content emphasizes "learn", "understand", "explain"

---

## 10. SAFE WORDING EXAMPLES

**✅ SAFE (Current):**
- "This calculator is based on common principles described in Eurocode 2"
- "Load assumptions are described in Eurocode 1"
- "Soil behavior principles are explained in ISO geotechnical standards"
- "This page explains what Eurocode 2 covers"
- "Learn how Eurocode 1 defines structural loads"

**❌ UNSAFE (Avoid):**
- "This calculator is compliant with Eurocode 2"
- "According to Eurocode 1 standard"
- "Meets ISO requirements"
- "Certified Eurocode calculations"
- "Official standard implementation"

---

## CONCLUSION

**Overall Status: ✅ PASSED**

The Standards section is properly positioned as educational content with:
- No compliance claims
- Strong disclaimers
- Correct schema markup (TechArticle)
- Logical, contextual internal linking
- Clear educational positioning

All pages are safe for search engine indexing as educational/technical articles, not legal documents.

**Risk Level: LOW** ✅

