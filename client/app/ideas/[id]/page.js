'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchIdeaById, reanalyzeIdea } from '../../../lib/api';
import ReportView from '../../../components/ReportView';

export default function IdeaDetailPage({ params }) {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    let isActive = true;
    let pollTimer = null;

    async function load() {
      try {
        const data = await fetchIdeaById(params.id);
        if (!isActive) return;
        setIdea(data);
        setError('');
        if (data.status === 'pending') {
          pollTimer = setTimeout(load, 3500);
        }
      } catch (e) {
        if (isActive) setError(e.message || 'Could not load report.');
      } finally {
        if (isActive) setLoading(false);
      }
    }

    load();
    return () => {
      isActive = false;
      clearTimeout(pollTimer);
    };
  }, [params.id]);

  async function handleReanalyze() {
    try {
      setReanalyzing(true);
      setError('');
      const updated = await reanalyzeIdea(params.id);
      setIdea(updated);
      if (updated.status === 'pending') {
        setLoading(true);
      }
    } catch (e) {
      setError(e.message || 'Could not re-run analysis.');
    } finally {
      setReanalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="w-8 h-8 border-2 border-zinc-300 border-t-orange-600 rounded-full animate-spin block mx-auto mb-4" />
          <p className="text-zinc-600 text-sm">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (!idea || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-4xl text-zinc-300 mb-4">NOT FOUND</div>
          {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
          <Link href="/dashboard" className="text-orange-700 text-sm hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16 bg-amber-50">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-10">
          <Link href="/dashboard" className="hover:text-orange-700 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-zinc-900">{idea.title}</span>
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="rounded-md bg-orange-600 text-amber-50 px-4 py-2 text-sm hover:bg-orange-700 disabled:opacity-50"
          >
            {reanalyzing ? 'Re-running...' : 'Re-run analysis'}
          </button>
          <button
            onClick={() => {
              setLoading(true);
              fetchIdeaById(params.id)
                .then(setIdea)
                .catch((e) => setError(e.message || 'Could not refresh report.'))
                .finally(() => setLoading(false));
            }}
            className="rounded-md border border-amber-200 bg-white px-4 py-2 text-sm text-zinc-700 hover:border-orange-500 hover:text-orange-700"
          >
            Refresh
          </button>
        </div>
        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <ReportView idea={idea} />
      </div>
    </div>
  );
}