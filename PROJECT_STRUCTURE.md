influenceiq/
├── client/                          # Next.js Frontend
│   ├── app/
│   │   ├── layout.js                # Root layout with fonts & metadata
│   │   ├── page.js                  # Home / Submit idea page
│   │   ├── dashboard/
│   │   │   └── page.js              # Dashboard — all saved ideas
│   │   └── ideas/
│   │       └── [id]/
│   │           └── page.js          # Detail page — full AI report
│   ├── components/
│   │   ├── IdeaForm.jsx             # Submit form component
│   │   ├── IdeaCard.jsx             # Card for dashboard
│   │   ├── ReportView.jsx           # Full report renderer
│   │   ├── ScoreMeter.jsx           # Profitability score visual
│   │   └── ExportPDF.jsx            # PDF export button
│   ├── lib/
│   │   └── api.js                   # API helper functions
│   ├── public/
│   │   └── logo.svg
│   ├── .env.local                   # NEXT_PUBLIC_API_URL
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                          # Express.js Backend
    ├── src/
    │   ├── index.js                 # Entry point
    │   ├── routes/
    │   │   └── ideas.js             # All /ideas routes
    │   ├── controllers/
    │   │   └── ideasController.js   # Business logic
    │   ├── services/
    │   │   └── aiService.js         # Anthropic API integration
    │   ├── models/
    │   │   └── Idea.js              # Mongoose schema
    │   └── middleware/
    │       └── errorHandler.js      # Global error handler
    ├── .env                         # ANTHROPIC_API_KEY, MONGODB_URI
    └── package.json