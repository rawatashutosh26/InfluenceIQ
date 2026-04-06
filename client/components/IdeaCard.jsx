'use client';
import { useState } from 'react';
import Link from 'next/link';

const riskColors = {
  Low: 'text-green-700 border-green-200 bg-green-50',
  Medium: 'text-amber-700 border-amber-200 bg-amber-50',
  High: 'text-red-700 border-red-200 bg-red-50',
};

export default function IdeaCard({ idea, index, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const score = idea.report?.profitability_score;
  const risk = idea.report?.risk_level;

  async function handleDelete() {
    setDeleting(true);
    await onDelete(idea._id);
    setDeleting(false);
  }

  async function handleCopyTitle() {
    await navigator.clipboard.writeText(idea.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div
      className="rounded-xl border border-amber-200 bg-white p-6 hover:border-orange-300
                 transition-all duration-300 group animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
    >
      {/* Status badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs px-2 py-1 uppercase tracking-wider font-medium ${
            idea.status === 'completed'
              ? 'text-green-700 bg-green-50'
              : idea.status === 'failed'
              ? 'text-red-700 bg-red-50'
              : 'text-amber-700 bg-amber-50'
          }`}
        >
          {idea.status}
        </span>
        <span className="text-xs text-zinc-600">
          {new Date(idea.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-2xl text-zinc-900 leading-tight mb-3 group-hover:text-orange-600 transition-colors">
        {idea.title}
      </h3>
      <p className="text-sm text-zinc-600 mb-4">
        {idea.description.length > 120 ? `${idea.description.slice(0, 120)}...` : idea.description}
      </p>

      {/* Score & Risk */}
      {idea.status === 'completed' && (
        <div className="flex items-center gap-3 mb-6">
          {score !== undefined && (
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 border border-amber-200 flex items-center justify-center">
                <span className="text-xs font-bold text-zinc-900">{score}</span>
              </div>
              <span className="text-xs text-zinc-600">/ 100</span>
            </div>
          )}
          {risk && (
            <span className={`text-xs px-2 py-0.5 border ${riskColors[risk] || ''}`}>
              {risk} Risk
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/ideas/${idea._id}`}
          className="flex-1 text-center text-xs bg-orange-50 border border-orange-200
                     text-orange-700 py-2 hover:bg-orange-600 hover:text-amber-50 transition-colors"
        >
          VIEW REPORT →
        </Link>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs border border-amber-200 text-zinc-600 px-3 py-2 
                       hover:border-orange-300 hover:text-orange-700 transition-colors"
          >
            ✕
          </button>
        ) : (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs border border-orange-600 text-orange-700 px-3 py-2 
                       hover:bg-orange-600 hover:text-amber-50 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Confirm?'}
          </button>
        )}
        <button
          onClick={handleCopyTitle}
          className="text-xs border border-amber-200 text-zinc-600 px-3 py-2 hover:border-orange-300 hover:text-orange-700 transition-colors"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}