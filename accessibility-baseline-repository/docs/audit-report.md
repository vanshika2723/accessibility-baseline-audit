# Accessibility Baseline & Architecture Audit Report

## 1. Scope

**Target:** Department of Information Technology & Communication (DoIT&C), Government of Rajasthan  
**Official URL:** https://doitc.rajasthan.gov.in/  
**Homepage:** https://doitc.rajasthan.gov.in/index.aspx  
**Audit date:** 24 August 2026

The audit focuses on the public-facing homepage and uses the supplied Lighthouse findings plus a keyboard-only review checklist. The supplied evidence contains five findings. Numeric Lighthouse scores are intentionally omitted because they were not present in the supplied evidence.

## 2. Evidence summary

| ID | Issue | Severity | Priority |
|---|---|---|---|
| A11Y-001 | Viewport zoom is disabled | High | P0 |
| A11Y-002 | Touch targets do not have sufficient size/spacing | High | P0 |
| A11Y-003 | Generic repeated “Read More” links | Medium | P1 |
| A11Y-004 | Heading hierarchy is not sequential | Medium | P1 |
| A11Y-005 | Keyboard navigation requires further review | High | P0 |

## 3. Detailed findings

### A11Y-001 — Viewport zoom is disabled
**Evidence:** Lighthouse reports that `user-scalable` is disabled or `maximum-scale` is less than 5.

**Why it matters:** Users with low vision may rely on browser zoom or magnification. WCAG 2.2 SC 1.4.4 requires text to remain resizable up to 200% without loss of content or functionality.

**Remediation:** Remove `user-scalable=no`; do not restrict browser zoom; validate the page at 200% and at narrow responsive widths.

**Priority:** P0 — accessibility blocker for low-vision users.

### A11Y-002 — Touch targets are too small or too close
**Evidence:** Lighthouse identifies small/closely spaced controls, including language, A+/A-/A text-size controls, search controls, and theme controls.

**Why it matters:** Small targets increase accidental activation and make interfaces harder to operate for users with motor impairments.

**Remediation:** Provide at least 24×24 CSS-pixel targets or sufficient spacing, with larger targets preferred for primary controls.

**Priority:** P0.

### A11Y-003 — Repeated “Read More” links are not descriptive
**Evidence:** Multiple links expose the same accessible name, “Read More,” despite pointing to different content.

**Why it matters:** Screen-reader users navigating by links cannot distinguish the destinations without surrounding context.

**Remediation:** Use names such as “Read more about [topic]” or associate the link programmatically with the card heading.

**Priority:** P1.

### A11Y-004 — Heading hierarchy is not sequential
**Evidence:** Lighthouse reports a heading-order problem and identifies an `h6` heading for “Department of Information Technology & Communication.”

**Why it matters:** Heading levels communicate document structure to assistive technologies and help users navigate long pages.

**Remediation:** Use headings in logical order (`h1 → h2 → h3`) based on structure rather than visual size. Use CSS for appearance.

**Priority:** P1.

### A11Y-005 — Keyboard navigation requires further review
**Evidence:** The audit identifies JavaScript links/custom controls that need keyboard verification, including visible focus and possible keyboard traps.

**Why it matters:** Users who cannot use a mouse must be able to reach and operate every control.

**Remediation:** Replace `javascript:void(0)` navigation with real links or buttons; ensure all controls are focusable, have visible focus, work with Enter/Space as appropriate, and never trap focus.

**Priority:** P0.

## 4. Architecture observations

The target is a mature public-service site with navigation, multilingual support, accessibility controls, search, content cards, and government information/service links. The new foundation separates presentation, API/data access, documentation, evidence, and automated checks so accessibility work can be maintained as an engineering concern rather than a one-off report.

## 5. Recommended implementation order

1. Restore browser zoom and validate 200% resizing.
2. Fix target sizing/spacing and visible keyboard focus.
3. Replace JavaScript-only navigation with semantic controls.
4. Repair heading hierarchy.
5. Make repeated content links uniquely understandable.
6. Add automated accessibility checks to CI.
7. Re-run Lighthouse and the manual keyboard pass before release.

## 6. References

- WCAG 2.2: https://www.w3.org/TR/wcag/
- Resize Text: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- Target Size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- DoIT&C official site: https://doitc.rajasthan.gov.in/
