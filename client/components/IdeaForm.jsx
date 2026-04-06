'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitIdea } from '../lib/api';

export default function IdeaForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const templates = [
    {
      label: 'Influencer match scoring',
      title: 'Brand-Creator Match Intelligence',
      description:
        'A platform that analyzes creator audience quality, content alignment, and campaign goals to score brand-influencer fit before contracts are signed.',
    },
    {
      label: 'UGC ops assistant',
      title: 'AI UGC Campaign Copilot',
      description:
        'A workflow assistant for D2C teams to brief creators, review submitted content against brand guidelines, and predict ad performance before publishing.',
    },
    {
      label: 'Social listening to leads',
      title: 'Comment-to-Lead Engine',
      description:
        'A tool that scans Instagram and TikTok comments, detects purchase intent, and routes qualified leads to CRM with suggested reply templates.',
    },
  ];

  const titleLength = title.trim().length;
  const descriptionLength = description.trim().length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!titleLength || !descriptionLength) {
      setError('Both fields are required.');
      return;
    }
    if (titleLength < 4 || descriptionLength < 20) {
      setError('Title must be at least 4 characters and description at least 20 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const idea = await submitIdea(title, description);
      router.push(`/ideas/${idea._id}`);
    } catch (err) {
      setError('Something went wrong. Is the server running?');
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-white/70 backdrop-blur p-8 shadow-sm">
      <h2 className="font-display text-3xl text-zinc-900 mb-2 tracking-wide">
        SUBMIT YOUR IDEA
      </h2>
      <p className="text-zinc-600 text-sm mb-8">
        Describe your startup and let AI validate it instantly.
      </p>

      <div className="mb-6">
        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Quick start templates</p>
        <div className="flex flex-wrap gap-2">
          {templates.map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              onClick={() => {
                setTitle(tpl.title);
                setDescription(tpl.description);
                setError('');
              }}
              className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-zinc-700 hover:border-orange-500 hover:text-orange-700 transition-colors"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs text-zinc-600 uppercase tracking-widest mb-2">
            Idea Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. InfluenceIQ — AI Influencer Validator"
            className="w-full rounded-md bg-white border border-amber-200 text-zinc-900 px-4 py-3
                       placeholder:text-zinc-400 focus:outline-none focus:border-orange-500
                       transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-600 uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe the problem you're solving, your target users, and how your product works..."
            className="w-full rounded-md bg-white border border-amber-200 text-zinc-900 px-4 py-3
                       placeholder:text-zinc-400 focus:outline-none focus:border-orange-500
                       transition-colors text-sm resize-none"
          />
          <div className="flex items-center justify-between text-xs text-zinc-600 mt-1">
            <span>{titleLength >= 4 && descriptionLength >= 20 ? 'Ready to validate' : 'Add more detail for better output'}</span>
            <span>{description.length} chars</span>
          </div>
        </div>

        {error && (
          <p className="text-red-700 text-sm border border-red-300 bg-red-50 px-4 py-2 rounded">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-orange-600 text-amber-50 font-display text-xl tracking-widest
                     py-4 hover:bg-orange-700 transition-colors disabled:opacity-50
                     disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-amber-50/30 border-t-amber-50 rounded-full animate-spin" />
              GENERATING REPORT...
            </>
          ) : (
            'VALIDATE IDEA →'
          )}
        </button>
      </form>
    </div>
  );
}