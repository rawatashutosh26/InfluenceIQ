'use client';
import Link from 'next/link';
import IdeaForm from '../components/IdeaForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-16">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glowing orb */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-orange-300/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100/70 px-3 py-1 mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
            <span className="text-xs text-orange-700 tracking-widest uppercase">
              AI-Powered Validation
            </span>
          </div>

          <h1
            className="font-display text-7xl md:text-9xl leading-none mb-6 animate-fade-up delay-1 text-zinc-900"
            style={{ opacity: 0 }}
          >
            VALIDATE
            <br />
            YOUR IDEA
            <br />
            <span className="text-orange-600">IN SECONDS</span>
          </h1>

          <p
            className="text-zinc-600 text-lg max-w-xl mb-12 animate-fade-up delay-2"
            style={{ opacity: 0 }}
          >
            Submit your startup concept. Get a full AI report on problem fit,
            customer persona, market size, competitors, tech stack, and
            profitability — instantly.
          </p>

          {/* Stats row */}
          <div
            className="flex gap-8 mb-16 animate-fade-up delay-3"
            style={{ opacity: 0 }}
          >
            {[
              { val: '8', label: 'Report Fields' },
              { val: '<10s', label: 'Generation Time' },
              { val: '100', label: 'Profitability Scale' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="font-display text-4xl text-zinc-900">{val}</div>
                <div className="text-xs text-zinc-600 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <IdeaForm />
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Structured Evaluation',
              desc: 'Every idea is scored across customer demand, competitive landscape, risk profile, and build feasibility.',
            },
            {
              title: 'Actionable Reports',
              desc: 'Get concise recommendations, practical MVP stacks, and clear profitability signals you can act on immediately.',
            },
            {
              title: 'Team Ready Output',
              desc: 'Export polished PDF reports and share insights with founders, investors, and campaign teams in minutes.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-amber-200 bg-white p-6">
              <h3 className="font-display text-3xl text-zinc-900 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto rounded-2xl border border-orange-200 bg-orange-50 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-orange-700 mb-2">Ready to review existing submissions?</p>
            <h2 className="font-display text-5xl text-zinc-900 leading-none">OPEN YOUR DASHBOARD</h2>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-3 text-amber-50 font-display text-xl tracking-wide hover:bg-orange-700"
          >
            VIEW DASHBOARD →
          </Link>
        </div>
      </section>
    </div>
  );
}