'use client';
import Link from 'next/link';
import ScoreMeter from './ScoreMeter';
import ExportPDF from './ExportPDF';

const riskConfig = {
  Low:    { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', bar: 'bg-green-500', width: 'w-1/3' },
  Medium: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500', width: 'w-2/3' },
  High:   { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500', width: 'w-full' },
};

function Section({ label, children, delay = 0 }) {
  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
    >
      <p className="text-xs text-orange-700 uppercase tracking-widest mb-2">{label}</p>
      {children}
    </div>
  );
}

export default function ReportView({ idea }) {
  const r = idea.report;
  const risk = riskConfig[r?.risk_level] || riskConfig.Medium;
  const techStack = Array.isArray(r?.tech_stack) ? r.tech_stack : [];
  const competitors = Array.isArray(r?.competitors) ? r.competitors : [];

  async function copySummary() {
    const summary = [
      `Idea: ${idea.title}`,
      `Risk: ${r.risk_level}`,
      `Profitability: ${r.profitability_score}/100`,
      `Problem: ${r.problem}`,
      `Customer: ${r.customer}`,
      `Market: ${r.market}`,
    ].join('\n');
    await navigator.clipboard.writeText(summary);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(idea, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${idea.title.replace(/\s+/g, '_')}_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (idea.status !== 'completed' || !r) {
    return (
      <div className="rounded-xl border border-amber-200 bg-white p-12 text-center">
        <p className="font-display text-3xl text-zinc-300">
          {idea.status === 'failed' ? 'REPORT GENERATION FAILED' : 'REPORT PENDING'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Report header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12 animate-fade-up" style={{ opacity: 0 }}>
        <div className="flex-1">
          <p className="text-xs text-orange-700 uppercase tracking-widest mb-3">Validation Report</p>
          <h1 className="font-display text-5xl md:text-6xl text-zinc-900 leading-none mb-4">
            {idea.title}
          </h1>
          <p className="text-zinc-600 text-sm">
            Generated {new Date(idea.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreMeter score={r.profitability_score} />
          <ExportPDF idea={idea} />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={copySummary}
          className="rounded border border-amber-200 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:border-orange-500 hover:text-orange-700"
        >
          Copy summary
        </button>
        <button
          onClick={copyLink}
          className="rounded border border-amber-200 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:border-orange-500 hover:text-orange-700"
        >
          Copy link
        </button>
        <button
          onClick={downloadJson}
          className="rounded border border-amber-200 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:border-orange-500 hover:text-orange-700"
        >
          Download JSON
        </button>
      </div>

      {/* Risk level bar */}
      <div className={`rounded-md border ${risk.border} ${risk.bg} p-4 mb-8 flex items-center gap-4 animate-fade-up delay-1`} style={{ opacity: 0 }}>
        <span className="text-xs text-zinc-600 uppercase tracking-widest">Risk Level</span>
        <div className="flex-1 h-1 bg-zinc-200">
          <div className={`h-full ${risk.bar} ${risk.width} transition-all duration-1000`} />
        </div>
        <span className={`font-display text-xl ${risk.color}`}>{r.risk_level}</span>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Section label="Problem" delay={0.1}>
          <div className="rounded-md border border-amber-200 bg-white p-5">
            <p className="text-zinc-900 text-sm leading-relaxed">{r.problem}</p>
          </div>
        </Section>

        <Section label="Customer Persona" delay={0.15}>
          <div className="rounded-md border border-amber-200 bg-white p-5">
            <p className="text-zinc-900 text-sm leading-relaxed">{r.customer}</p>
          </div>
        </Section>

        <Section label="Market Overview" delay={0.2}>
          <div className="rounded-md border border-amber-200 bg-white p-5 md:col-span-1">
            <p className="text-zinc-900 text-sm leading-relaxed">{r.market}</p>
          </div>
        </Section>

        <Section label="AI Justification" delay={0.25}>
          <div className="rounded-md border border-orange-200 bg-orange-50 p-5">
            <p className="text-zinc-900 text-sm leading-relaxed">{r.justification}</p>
          </div>
        </Section>
      </div>

      {/* Tech Stack */}
      <Section label="Recommended Tech Stack" delay={0.3}>
        <div className="rounded-md border border-amber-200 bg-white p-5 mb-6">
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="font-display text-lg text-zinc-900 border border-amber-200
                           px-4 py-1 rounded hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                {tech}
              </span>
            ))}
            {techStack.length === 0 && (
              <span className="text-sm text-zinc-500">No tech stack available.</span>
            )}
          </div>
        </div>
      </Section>

      {/* Competitors */}
      <Section label="Competitor Landscape" delay={0.35}>
        <div className="rounded-md border border-amber-200 overflow-hidden mb-8 bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-amber-50 border-b border-amber-200">
                <th className="text-left text-xs text-zinc-600 uppercase tracking-widest px-5 py-3 w-1/3">
                  Competitor
                </th>
                <th className="text-left text-xs text-zinc-600 uppercase tracking-widest px-5 py-3">
                  Differentiation
                </th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, i) => (
                <tr
                  key={i}
                  className="border-b border-amber-100 hover:bg-amber-50 transition-colors"
                >
                  <td className="px-5 py-4 font-display text-lg text-orange-700">{c.name}</td>
                  <td className="px-5 py-4 text-sm text-zinc-600">{c.differentiation}</td>
                </tr>
              ))}
              {competitors.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-5 py-4 text-sm text-zinc-500">
                    No competitor data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-orange-700 transition-colors"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}