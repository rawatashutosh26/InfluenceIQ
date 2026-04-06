# InfluenceIQ — AI Startup Idea Validator
---

## Live Demo

- **Link:** : https://influence-iq-ruddy.vercel.app/

---
**Built for Schmooze Media Technical Screening**

> Validate startup ideas instantly using AI. Get structured reports on problem-market fit, customer personas, competitors, tech stack, risk level, and profitability score — all in under 10 seconds.
<img width="1836" height="906" alt="image" src="https://github.com/user-attachments/assets/be37813a-b26c-443f-a611-3c020f308870" />
<img width="1824" height="890" alt="image" src="https://github.com/user-attachments/assets/a6a02909-e1de-408b-8c40-4cdfb31ec53c" />
<img width="1812" height="891" alt="image" src="https://github.com/user-attachments/assets/374812ea-c6cc-4e99-a271-2d6abb10d3d1" />

---

## Why This Idea?

Schmooze Media is an Integrated Communication & Marketing Agency offering Influencer Management and MarTech automation as core services. **InfluenceIQ** solves a real pain point in that space: brands waste 40%+ of influencer budgets on mismatched or fake-follower accounts. This tool provides AI-powered pre-validation — the same due diligence a consultant does in hours, in seconds.

---
<img width="1753" height="1064" alt="image" src="https://github.com/user-attachments/assets/559ce450-e781-4d5c-972a-4d5ac2319543" />
<img width="1718" height="955" alt="image" src="https://github.com/user-attachments/assets/83556a7d-ca83-4042-b3fc-e3c5bf97a356" />

---
## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14, Tailwind CSS          |
| Backend    | Node.js, Express.js               |
| AI         | Gemini + Groq failover |
| Database   | MongoDB Atlas (Mongoose)          |
| PDF Export | jsPDF + jsPDF-AutoTable           |
| Deploy FE  | Vercel                            |
| Deploy BE  | Render                            |

---

## Project Structure

```
influenceiq/
├── client/                   # Next.js frontend
│   ├── app/
│   │   ├── layout.js         # Root layout, nav, fonts
│   │   ├── page.js           # Home: submit idea form
│   │   ├── dashboard/page.js # All saved ideas
│   │   └── ideas/[id]/page.js# Full AI report
│   ├── components/
│   │   ├── IdeaForm.jsx      # Submission form
│   │   ├── IdeaCard.jsx      # Dashboard card
│   │   ├── ReportView.jsx    # Full report renderer
│   │   ├── ScoreMeter.jsx    # Animated circular score
│   │   └── ExportPDF.jsx     # PDF export
│   └── lib/api.js            # All fetch calls
│
└── server/
    └── src/
        ├── index.js                   # Express entry
        ├── routes/ideas.js            # Route definitions
        ├── controllers/ideasController.js  # Logic
        ├── services/aiService.js      # Gemini API
        ├── models/Idea.js             # Mongoose schema
        └── middleware/errorHandler.js
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Google AI Studio API key (Gemini)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/influenceiq.git
cd influenceiq
```

### 2. Setup the Server
```bash
cd server
npm install
cp .env.example .env
```
Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/influenceiq
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-1.5-flash-latest
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.1-8b-instant
CLIENT_URL=http://localhost:3000
```
Start server:
```bash
npm run dev
```

### 3. Setup the Client
```bash
cd ../client
npm install
cp .env.local.example .env.local
```
Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Start frontend:
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## API Endpoints

| Method | Endpoint      | Description                         |
|--------|--------------|-------------------------------------|
| POST   | /ideas        | Submit idea + trigger AI analysis   |
| GET    | /ideas        | List all saved ideas                |
| GET    | /ideas/:id    | Get full report for one idea        |
| DELETE | /ideas/:id    | Delete an idea                      |

### POST /ideas — Request Body
```json
{
  "title": "InfluenceIQ",
  "description": "An AI platform that scores influencer-brand fit before signing..."
}
```

### Response
```json
{
  "_id": "...",
  "title": "InfluenceIQ",
  "description": "...",
  "status": "completed",
  "report": {
    "problem": "Brands waste budget on mismatched influencers...",
    "customer": "Marketing managers at D2C brands...",
    "market": "$21B influencer marketing industry...",
    "competitors": [
      { "name": "HypeAuditor", "differentiation": "Focuses on fraud detection, not brand fit scoring" },
      { "name": "Modash", "differentiation": "Discovery tool without AI-powered ROI prediction" },
      { "name": "Upfluence", "differentiation": "Enterprise-only, no real-time validation for SMBs" }
    ],
    "tech_stack": ["Next.js", "Node.js", "MongoDB", "Gemini API", "Tailwind CSS"],
    "risk_level": "Medium",
    "profitability_score": 78,
    "justification": "Strong market demand with clear monetization..."
  },
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### API Setup Checklist

1. Create a MongoDB Atlas cluster and copy the connection URI into `MONGODB_URI`.
2. Create a Google AI Studio key and set `GEMINI_API_KEY`.
3. Add optional Groq failover (`GROQ_API_KEY`, `GROQ_MODEL`) for quota/rate-limit fallback.
4. Optionally set `GEMINI_MODEL` to your preferred Gemini model.
5. Set `CLIENT_URL` to your frontend URL (for CORS).
6. Set `NEXT_PUBLIC_API_URL` in `client/.env.local` to your backend URL.
7. Start backend (`npm run dev` in `server`) and frontend (`npm run dev` in `client`).

---

## AI Prompt Used

```
You are an expert startup consultant specializing in influencer marketing, 
MarTech, and digital media industries. Analyze the given startup idea and 
return a structured JSON object.

Rules:
- Keep answers concise, realistic, and specific to the marketing/media space.
- 'competitors' must contain exactly 3 objects: { name, differentiation }
- 'tech_stack' must be 4-6 practical technologies for MVP
- 'profitability_score' must be an integer 0-100
- 'risk_level' must be exactly one of: Low, Medium, High
- Return ONLY valid JSON. No markdown, no backticks, no preamble.
```

---

## Deployment

### Frontend → Vercel
```bash
cd client
npx vercel
# Set env: NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com
```

### Backend → Render
1. Create new **Web Service** on render.com
2. Connect GitHub repo, set root to `/server`
3. Build command: `npm install`
4. Start command: `node src/index.js`
5. Add environment variables from `.env`

### Database → MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Create database user
3. Whitelist all IPs (0.0.0.0/0) for Render
4. Copy connection string to `MONGODB_URI`

---

## Architecture Notes 

The app is split into a clean client/server architecture. The Next.js frontend handles all UI with App Router and server/client component separation — form submission and data fetching happen client-side for a snappy experience.

The Express backend follows a layered pattern: routes → controllers → services → models. The AI service is isolated in `aiService.js`, making it trivial to swap Gemini for OpenAI or any other provider. The Mongoose schema stores both the raw idea and the parsed AI report in one document, keeping queries simple.

For AI output reliability, the prompt enforces strict JSON-only responses and the service strips any accidental markdown fences before parsing. If the AI call fails, the idea is still saved with `status: "failed"` rather than throwing a 500 error — this keeps the UX graceful.

PDF export is done entirely client-side with jsPDF (lazy-loaded), so no server resources are used. The report renders programmatically with brand colors and an auto-table for competitors.

The design uses a bold editorial aesthetic with Bebas Neue for display text, a dark ink background, and accent red — intentionally referencing Schmooze Media's brand energy. Every section on the report page uses staggered fade-up animations for a polished feel.
