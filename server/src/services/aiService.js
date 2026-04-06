const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const ALLOWED_RISK_LEVELS = ['Low', 'Medium', 'High'];

const SYSTEM_PROMPT = `You are an expert startup consultant specializing in influencer marketing, 
MarTech, and digital media industries. Analyze the given startup idea and return a structured 
JSON object. Rules:
- Keep answers concise, realistic, and specific to the marketing/media space.
- 'competitors' must contain exactly 3 objects: { name, differentiation }
- 'tech_stack' must be 4-6 practical technologies for MVP
- 'profitability_score' must be an integer 0-100
- 'risk_level' must be exactly one of: Low, Medium, High
- Return ONLY valid JSON. No markdown, no backticks, no preamble.

Return this exact structure:
{
  "problem": "string",
  "customer": "string", 
  "market": "string",
  "competitors": [{ "name": "string", "differentiation": "string" }],
  "tech_stack": ["string"],
  "risk_level": "Low|Medium|High",
  "profitability_score": number,
  "justification": "string"
}`;

async function generateReport(title, description) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing.');
  }

  const prompt = `${SYSTEM_PROMPT}\n\nInput: ${JSON.stringify({ title, description })}`;
  try {
    const geminiText = await generateWithGemini(prompt);
    return normalizeReport(parseJsonResponse(geminiText));
  } catch (geminiError) {
    if (!shouldTryAlternateProvider(geminiError)) {
      throw geminiError;
    }

    if (!process.env.GROQ_API_KEY) {
      throw geminiError;
    }

    try {
      const groqText = await generateWithGroq(prompt);
      return normalizeReport(parseJsonResponse(groqText));
    } catch (groqError) {
      throw new Error(
        `Primary provider failed (${oneLineError(geminiError)}); alternate provider failed (${oneLineError(groqError)}).`
      );
    }
  }
}

async function generateWithGemini(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelsToTry = [MODEL, 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-2.0-flash'];
  let lastError = null;

  for (const modelName of [...new Set(modelsToTry)]) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      lastError = error;
      const msg = oneLineError(error).toLowerCase();
      const modelNotFound = msg.includes('not found') || msg.includes('404');
      const rateLimited = msg.includes('429') || msg.includes('quota') || msg.includes('too many requests');
      if (!modelNotFound && !rateLimited) {
        throw error;
      }
    }
  }

  throw lastError || new Error('No Gemini model was available for content generation.');
}

async function generateWithGroq(prompt) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices?.[0]?.message?.content?.trim() || '';
}

function parseJsonResponse(text) {
  const clean = String(text).replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

function oneLineError(error) {
  return String(error?.message || error || 'Unknown error').split('\n')[0];
}

function shouldTryAlternateProvider(error) {
  const msg = oneLineError(error).toLowerCase();
  return msg.includes('429') || msg.includes('quota') || msg.includes('too many requests');
}

function normalizeString(value, fallback = 'Not provided') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeReport(report) {
  const competitorsRaw = Array.isArray(report?.competitors) ? report.competitors : [];
  const competitors = competitorsRaw
    .map((item) => ({
      name: normalizeString(item?.name),
      differentiation: normalizeString(item?.differentiation),
    }))
    .slice(0, 3);

  while (competitors.length < 3) {
    competitors.push({
      name: `Competitor ${competitors.length + 1}`,
      differentiation: 'Differentiation not provided',
    });
  }

  const techStackRaw = Array.isArray(report?.tech_stack) ? report.tech_stack : [];
  const tech_stack = techStackRaw
    .map((tech) => normalizeString(tech))
    .filter(Boolean)
    .slice(0, 6);

  const profitability = Number.isFinite(Number(report?.profitability_score))
    ? Math.round(Number(report.profitability_score))
    : 0;

  const normalizedRisk = ALLOWED_RISK_LEVELS.includes(report?.risk_level)
    ? report.risk_level
    : 'Medium';

  return {
    problem: normalizeString(report?.problem),
    customer: normalizeString(report?.customer),
    market: normalizeString(report?.market),
    competitors,
    tech_stack: tech_stack.length ? tech_stack : ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    risk_level: normalizedRisk,
    profitability_score: Math.min(100, Math.max(0, profitability)),
    justification: normalizeString(report?.justification),
  };
}

function generateFallbackReport(title, description, reason = 'AI provider unavailable') {
  const shortReason = String(reason).split('\n')[0].slice(0, 220);
  const lowered = description.toLowerCase();
  const isB2B = /agency|brand|crm|enterprise|team|workflow|saas/.test(lowered);
  const hasInfluencer = /influencer|creator|ugc|social|tiktok|instagram/.test(lowered);
  const risk = isB2B ? 'Medium' : 'High';
  const score = hasInfluencer ? 68 : 55;

  return {
    problem: `The idea "${title}" targets a real workflow pain point but needs tighter scope and strong differentiation to reduce execution risk.`,
    customer: isB2B
      ? 'Marketing teams, brand managers, and agency operators who need measurable campaign outcomes.'
      : 'Early-stage founders and growth teams looking for faster validation of go-to-market assumptions.',
    market: hasInfluencer
      ? 'Influencer and creator tooling is growing quickly, but competition is intense and trust/performance proof is essential.'
      : 'The adjacent martech/automation market is large, but customer acquisition cost and positioning will determine viability.',
    competitors: [
      { name: 'HypeAuditor', differentiation: 'Strong analytics depth, but less tailored to custom validation workflows.' },
      { name: 'Upfluence', differentiation: 'Broad platform capabilities, but heavier for lean teams and MVP use cases.' },
      { name: 'Modash', differentiation: 'Great discovery stack, but limited custom feasibility scoring for new concepts.' },
    ],
    tech_stack: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'REST API'],
    risk_level: risk,
    profitability_score: score,
    justification: `Fallback report generated because live AI analysis is currently unavailable (${shortReason}). Use this as a temporary baseline and rerun analysis when API quota is restored.`,
  };
}

module.exports = { generateReport, normalizeReport, generateFallbackReport };