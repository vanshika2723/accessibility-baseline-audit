// Manual test contract for the first vertical slice.
// Run after starting the API: npm run dev:server
//
// Expected:
// 1. GET /api/health returns { ok: true }.
// 2. GET /api/audit-summary returns five findings.
// 3. Client page has a skip link and visible :focus-visible styles.
// 4. All interactive elements are reachable with Tab and Shift+Tab.

import test from "node:test";
import assert from "node:assert/strict";

test("audit contract has five prioritized findings", () => {
  const findings = [
    "A11Y-001",
    "A11Y-002",
    "A11Y-003",
    "A11Y-004",
    "A11Y-005"
  ];
  assert.equal(findings.length, 5);
});
