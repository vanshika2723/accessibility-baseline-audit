import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(__dirname, "../../audit/accessibility-audit.csv");

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",").map((h) => h.trim());
  return lines.map((line) => {
    const values = line.match(/(".*?"|[^",]+)(?=,|$)/g)?.map((v) =>
      v.replace(/^"|"$/g, "").replace(/""/g, '"')
    ) ?? [];
    return Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""]));
  });
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/audit-summary", (_req, res) => {
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  res.json({
    target: "DoIT&C, Government of Rajasthan",
    findings: rows,
    counts: {
      total: rows.length,
      high: rows.filter((row) => row.severity === "High").length,
      medium: rows.filter((row) => row.severity === "Medium").length
    }
  });
});

app.listen(4000, () => {
  console.log("Audit API listening on http://localhost:4000");
});
