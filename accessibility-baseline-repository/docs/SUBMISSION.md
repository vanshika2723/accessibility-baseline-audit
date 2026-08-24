# Submission Notes

## What is included

- `audit/accessibility-audit.csv` — supplied five-finding evidence
- `docs/audit-report.md` — complete report with severity and remediation
- `docs/keyboard-pass.md` — keyboard-only audit procedure and evidence plan
- `docs/architecture.md` — boundaries and first vertical slice
- `docs/screenshots/lighthouse-evidence-board.png` — evidence summary image
- `docs/screenshots/doitc-reference-visual.jpg` — visual reference of the DoIT&C/Rajasthan digital-government interface
- `client/` — React/Vite setup-ready client
- `server/` — Express API
- `tests/` — smoke/contract test
- `.github/workflows/ci.yml` — CI skeleton

## Important honesty note

The supplied CSV contains the Lighthouse findings but not a numeric Lighthouse score or exported Lighthouse HTML. The repository therefore does not fabricate a score. Before final submission, run:

```bash
npm install
npm run lighthouse
```

Then add the generated `docs/lighthouse-report.html` to the commit if the assignment specifically requires the raw Lighthouse artifact.

## GitHub publish

After extracting the repository:

```bash
git init
git add .
git commit -m "feat: add accessibility audit and architecture foundation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/accessibility-baseline-audit.git
git push -u origin main
```

Official GitHub guidance: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
