export const mockReports = [
  {
    id: 1,
    weekRange: 'Jun 9 – Jun 15, 2025',
    generatedDate: 'Jun 15, 2025',
    competitorCount: 4,
    summary: 'Initech raised Pro plan pricing by 25%. Acme Corp posted 6 new engineering roles signaling a major product push. Soylent Co sentiment dropped sharply after a support outage.',
    sections: [
      {
        competitor: 'Initech',
        findings: [
          { tag: 'Price Change',  text: 'Pro plan increased from $79/mo to $99/mo. Enterprise tier now requires annual commitment.' },
          { tag: 'New Feature',   text: 'Launched "Smart Alerts" beta — AI-driven threshold notifications for monitored pages.' },
          { tag: 'Job Change',    text: '3 new Sales Development Rep postings in Chicago and Austin, suggesting geographic expansion.' },
        ],
      },
      {
        competitor: 'Acme Corp',
        findings: [
          { tag: 'Job Change',      text: '6 new engineering roles posted this week — 4 backend, 1 ML engineer, 1 DevOps. Largest hiring spike in 6 months.' },
          { tag: 'New Feature',     text: 'Features page updated to include "AI Assistant" section with embedded demo video.' },
          { tag: 'Sentiment Shift', text: 'Reddit sentiment up 12 points following AI feature announcement. 504 upvotes on r/artificial.' },
        ],
      },
      {
        competitor: 'Soylent Co',
        findings: [
          { tag: 'Sentiment Shift', text: 'Sentiment score dropped from 48 to 33 after a 6-hour support outage on Jun 11.' },
          { tag: 'Price Change',    text: 'Starter plan quietly removed from pricing page. Only Pro and Enterprise tiers now listed.' },
        ],
      },
      {
        competitor: 'Globex Inc',
        findings: [
          { tag: 'New Feature', text: 'Published changelog v3.9.0 — new CSV bulk import and Zapier integration announced.' },
          { tag: 'Job Change',  text: '1 new Product Manager role posted, focused on "data pipeline and integrations".' },
        ],
      },
    ],
  },
  {
    id: 2,
    weekRange: 'Jun 2 – Jun 8, 2025',
    generatedDate: 'Jun 8, 2025',
    competitorCount: 3,
    summary: 'Acme Corp updated their about page with two new C-suite hires. Globex Inc shipped a major changelog. Umbrella Ltd sentiment remains consistently positive at 74.',
    sections: [
      {
        competitor: 'Acme Corp',
        findings: [
          { tag: 'Job Change',  text: 'New CTO and VP of Sales added to leadership page. Both hires appear to come from enterprise SaaS backgrounds.' },
          { tag: 'New Feature', text: 'About page redesigned with new company timeline and updated mission statement.' },
        ],
      },
      {
        competitor: 'Globex Inc',
        findings: [
          { tag: 'New Feature',   text: 'Changelog v3.8.0 released — Slack and Microsoft Teams integrations now generally available.' },
          { tag: 'Sentiment Shift', text: 'Positive Reddit thread on r/SaaS comparing Globex favorably to competitors gained 218 upvotes.' },
        ],
      },
      {
        competitor: 'Umbrella Ltd',
        findings: [
          { tag: 'Sentiment Shift', text: 'Sentiment held steady at 74 — highest among tracked competitors for the second consecutive week.' },
          { tag: 'Job Change',      text: 'No new job postings this week. Headcount appears stable.' },
        ],
      },
    ],
  },
  {
    id: 3,
    weekRange: 'May 26 – Jun 1, 2025',
    generatedDate: 'Jun 1, 2025',
    competitorCount: 5,
    summary: 'Vandelay Industries entered monitoring for the first time. Initech shipped v4.0.0 — a complete platform overhaul. Soylent Co removed their Starter plan without announcement.',
    sections: [
      {
        competitor: 'Initech',
        findings: [
          { tag: 'New Feature',  text: 'v4.0.0 released — complete UI overhaul, new pricing engine, multi-user workspaces, and REST API v2.' },
          { tag: 'Price Change', text: 'Pricing page restructured to reflect new workspace-based billing model.' },
        ],
      },
      {
        competitor: 'Vandelay Industries',
        findings: [
          { tag: 'Job Change',      text: 'First monitoring cycle complete. 1 open role detected: Senior Account Executive.' },
          { tag: 'Sentiment Shift', text: 'Initial sentiment baseline established at 55 — neutral. Limited Reddit presence detected.' },
        ],
      },
      {
        competitor: 'Soylent Co',
        findings: [
          { tag: 'Price Change',    text: 'Starter plan ($29/mo) silently removed from pricing page between May 28–30.' },
          { tag: 'Sentiment Shift', text: 'Negative thread on r/startups titled "Switched from Soylent Co" gained 163 upvotes.' },
        ],
      },
    ],
  },
];
