const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function parseResponse(res, fallbackMessage) {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error || fallbackMessage);
  }
  return payload;
}

export async function submitIdea(title, description) {
  const res = await fetch(`${API}/ideas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  return parseResponse(res, 'Failed to submit idea');
}

export async function fetchIdeas() {
  const res = await fetch(`${API}/ideas`);
  return parseResponse(res, 'Failed to fetch ideas');
}

export async function fetchIdeaById(id) {
  const res = await fetch(`${API}/ideas/${id}`);
  return parseResponse(res, 'Failed to fetch idea');
}

export async function deleteIdea(id) {
  const res = await fetch(`${API}/ideas/${id}`, { method: 'DELETE' });
  return parseResponse(res, 'Failed to delete idea');
}

export async function reanalyzeIdea(id) {
  const res = await fetch(`${API}/ideas/${id}/reanalyze`, { method: 'POST' });
  return parseResponse(res, 'Failed to reanalyze idea');
}