import { useEffect, useState } from "react";

export default function App() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/audit-summary")
      .then((response) => response.json())
      .then(setSummary)
      .catch(() => setSummary({ error: true }));
  }, []);

  return (
    <main id="main" className="page">
      <header className="hero">
        <p className="eyebrow">Accessibility Baseline</p>
        <h1>Audit Dashboard Foundation</h1>
        <p>
          A small, keyboard-friendly vertical slice for reviewing prioritized
          accessibility findings.
        </p>
      </header>

      <section aria-labelledby="findings-title">
        <h2 id="findings-title">Priority findings</h2>
        {!summary ? (
          <p role="status">Loading audit evidence…</p>
        ) : summary.error ? (
          <p role="alert">Start the server with <code>npm run dev:server</code>.</p>
        ) : (
          <ul className="findings">
            {summary.findings.map((item) => (
              <li key={item.issue_id} className="card">
                <span className={`badge ${item.severity.toLowerCase()}`}>
                  {item.severity}
                </span>
                <h3>{item.issue}</h3>
                <p>{item.evidence}</p>
                <strong>Remediation:</strong>
                <p>{item.remediation}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
