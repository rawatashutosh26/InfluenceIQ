'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchIdeas, deleteIdea } from '../../lib/api';
import IdeaCard from '../../components/IdeaCard';

export default function DashboardPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const perPage = 6;

  async function loadIdeas() {
    try {
      setError('');
      const data = await fetchIdeas();
      setIdeas(data);
    } catch (e) {
      setError(e.message || 'Could not load ideas.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteIdea(id);
      setIdeas((prev) => prev.filter((i) => i._id !== id));
    } catch (e) {
      setError(e.message || 'Could not delete idea.');
    }
  }

  useEffect(() => { loadIdeas(); }, []);

  const filteredIdeas = ideas
    .filter((idea) => (statusFilter === 'all' ? true : idea.status === statusFilter))
    .filter((idea) => {
      const haystack = `${idea.title} ${idea.description}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      const aScore = a.report?.profitability_score ?? -1;
      const bScore = b.report?.profitability_score ?? -1;
      return bScore - aScore;
    });

  const totalPages = Math.max(1, Math.ceil(filteredIdeas.length / perPage));
  const paginatedIdeas = filteredIdeas.slice((page - 1) * perPage, page * perPage);

  const completedCount = ideas.filter((i) => i.status === 'completed').length;
  const pendingCount = ideas.filter((i) => i.status === 'pending').length;
  const failedCount = ideas.filter((i) => i.status === 'failed').length;

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, sortBy]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="min-h-screen px-6 py-16 bg-amber-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 border-b border-amber-200 pb-8">
          <div>
            <p className="text-xs text-orange-700 uppercase tracking-widest mb-2">All Submissions</p>
            <h1 className="font-display text-6xl text-zinc-900">DASHBOARD</h1>
          </div>
          <div className="text-right">
            <div className="font-display text-5xl text-zinc-900">{ideas.length}</div>
            <div className="text-xs text-zinc-600 uppercase tracking-wider">Ideas Submitted</div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat label="Total" value={ideas.length} />
          <Stat label="Completed" value={completedCount} />
          <Stat label="Pending" value={pendingCount} />
          <Stat label="Failed" value={failedCount} />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or description"
            className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-orange-500"
          >
            <option value="newest">Sort: Newest first</option>
            <option value="oldest">Sort: Oldest first</option>
            <option value="score">Sort: Highest profitability</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-48 gap-3">
            <span className="w-5 h-5 border-2 border-zinc-300 border-t-orange-600 rounded-full animate-spin" />
            <span className="text-zinc-600 text-sm">Loading ideas...</span>
          </div>
        )}

        {!loading && ideas.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-white p-16 text-center">
            <div className="font-display text-4xl text-zinc-300 mb-4">NO IDEAS YET</div>
            <p className="text-zinc-600 text-sm mb-6">Submit your first startup idea to get started.</p>
            <Link
              href="/"
              className="inline-block rounded-md bg-orange-600 text-amber-50 font-display text-lg tracking-widest px-8 py-3 hover:bg-orange-700 transition-colors"
            >
              SUBMIT IDEA →
            </Link>
          </div>
        )}

        {!loading && ideas.length > 0 && filteredIdeas.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-white p-10 text-center text-zinc-600">
            No ideas match your filters.
          </div>
        )}

        {!loading && filteredIdeas.length > 0 && (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedIdeas.map((idea, i) => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                index={i}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-zinc-600">
              Showing {paginatedIdeas.length} of {filteredIdeas.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded border border-amber-200 bg-white px-3 py-1 text-xs text-zinc-700 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs text-zinc-600">Page {page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded border border-amber-200 bg-white px-3 py-1 text-xs text-zinc-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-md border border-amber-200 bg-white px-3 py-2">
      <p className="text-xs text-zinc-600 uppercase tracking-wider">{label}</p>
      <p className="font-display text-3xl leading-none text-zinc-900">{value}</p>
    </div>
  );
}