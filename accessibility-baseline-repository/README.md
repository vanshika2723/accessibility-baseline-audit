# Accessibility Baseline & Repository Architecture Audit

A submission-ready full-stack foundation created from an accessibility and architecture audit of the **Department of Information Technology & Communication (DoIT&C), Government of Rajasthan** public website.

## Audit target

- Official website: https://doitc.rajasthan.gov.in/
- Homepage audited: https://doitc.rajasthan.gov.in/index.aspx
- Audit basis: supplied Lighthouse findings + keyboard-navigation review notes
- Standard: WCAG 2.2 AA-oriented remediation
- Audit date: 24 August 2026

## Repository goals

1. Preserve the audit evidence.
2. Document five prioritized accessibility/architecture issues.
3. Establish clear client/server/docs/test boundaries.
4. Define the first vertical feature slice.
5. Make the project easy to run locally and publish to GitHub.

## Architecture

```text
accessibility-baseline-repository/
├── audit/
│   └── accessibility-audit.csv
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── server/
│   ├── src/
│   │   └── index.js
│   └── package.json
├── docs/
│   ├── audit-report.md
│   ├── architecture.md
│   ├── keyboard-pass.md
│   └── screenshots/
├── tests/
│   └── accessibility-smoke.test.js
├── .github/workflows/
│   └── ci.yml
├── .gitignore
├── package.json
└── README.md
```

## Local setup

```bash
npm install
npm run dev:server
npm run dev
```

The client runs on Vite's default port and the API runs on `http://localhost:4000`.

## First vertical feature slice

**Accessible Audit Dashboard**

`Client page → GET /api/audit-summary → server → audit CSV → prioritized findings`

The slice demonstrates the intended boundary: UI owns presentation and interaction; server owns data access; audit evidence stays in the audit/docs layer; tests protect the contract.

## Audit highlights

| ID | Finding | Priority |
|---|---|---|
| A11Y-001 | Viewport zoom is disabled | High |
| A11Y-002 | Touch targets are too small/closely spaced | High |
| A11Y-003 | Repeated “Read More” links are not unique | Medium |
| A11Y-004 | Heading hierarchy is not sequential | Medium |
| A11Y-005 | Keyboard navigation needs further review | High |

> Important: the supplied audit evidence did not contain a numeric Lighthouse score, so this repository intentionally does **not invent one**. Run the included Lighthouse command to capture a fresh score and HTML report.

## Official references

- DoIT&C: https://doitc.rajasthan.gov.in/
- WCAG 2.2: https://www.w3.org/TR/wcag/
- GitHub Docs: https://docs.github.com/

## Submission checklist

- [x] Audit report
- [x] Five evidence-backed issues
- [x] Remediation priorities
- [x] Keyboard-only test plan
- [x] Architecture tree
- [x] Client/server/docs/test skeleton
- [x] CI workflow
- [x] Reference screenshot
- [x] Setup instructions
