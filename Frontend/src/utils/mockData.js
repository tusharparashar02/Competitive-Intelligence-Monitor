export const stats = [
  { id: 1, label: 'Total Competitors', value: 12,  color: 'blue',   bg: 'bg-blue-500/10',   icon: 'users'       },
  { id: 2, label: 'Alerts This Week',  value: 8,   color: 'red',    bg: 'bg-red-500/10',    icon: 'bell'        },
  { id: 3, label: 'Reports Generated', value: 24,  color: 'green',  bg: 'bg-green-500/10',  icon: 'file-chart'  },
  { id: 4, label: 'Changes Detected',  value: 37,  color: 'orange', bg: 'bg-orange-500/10', icon: 'zap'         },
];

export const competitors = [
  {
    id: 1,
    name: 'Acme Corp',
    url: 'acmecorp.com',
    lastMonitored: '2 hours ago',
    alertCount: 3,
    sentiment: 'positive',
    sentimentScore: 82,
    sentimentWidth: 'w-[82%]',
  },
  {
    id: 2,
    name: 'Globex Inc',
    url: 'globex.io',
    lastMonitored: '5 hours ago',
    alertCount: 1,
    sentiment: 'neutral',
    sentimentScore: 51,
    sentimentWidth: 'w-[51%]',
  },
  {
    id: 3,
    name: 'Initech',
    url: 'initech.com',
    lastMonitored: '1 day ago',
    alertCount: 5,
    sentiment: 'negative',
    sentimentScore: 28,
    sentimentWidth: 'w-[28%]',
  },
  {
    id: 4,
    name: 'Umbrella Ltd',
    url: 'umbrella.co',
    lastMonitored: '3 hours ago',
    alertCount: 0,
    sentiment: 'positive',
    sentimentScore: 74,
    sentimentWidth: 'w-[74%]',
  },
  {
    id: 5,
    name: 'Soylent Co',
    url: 'soylent.com',
    lastMonitored: '12 hours ago',
    alertCount: 2,
    sentiment: 'negative',
    sentimentScore: 33,
    sentimentWidth: 'w-[33%]',
  },
  {
    id: 6,
    name: 'Vandelay Industries',
    url: 'vandelay.com',
    lastMonitored: '6 hours ago',
    alertCount: 1,
    sentiment: 'neutral',
    sentimentScore: 55,
    sentimentWidth: 'w-[55%]',
  },
];

export const recentAlerts = [
  {
    id: 1,
    competitor: 'Initech',
    type: 'Pricing page updated',
    timeAgo: '18 min ago',
    severity: 'high',
  },
  {
    id: 2,
    competitor: 'Acme Corp',
    type: 'New job posting: Senior Engineer',
    timeAgo: '1 hr ago',
    severity: 'medium',
  },
  {
    id: 3,
    competitor: 'Soylent Co',
    type: 'Negative review spike',
    timeAgo: '3 hrs ago',
    severity: 'high',
  },
  {
    id: 4,
    competitor: 'Globex Inc',
    type: 'Changelog published',
    timeAgo: '5 hrs ago',
    severity: 'low',
  },
  {
    id: 5,
    competitor: 'Acme Corp',
    type: 'Product feature removed',
    timeAgo: '8 hrs ago',
    severity: 'medium',
  },
];

export const mockJobs = [
  { id: 1, title: 'Senior Software Engineer',  location: 'San Francisco, CA', department: 'Engineering', postedDate: 'Jun 12, 2025' },
  { id: 2, title: 'Product Manager',           location: 'Remote',            department: 'Product',     postedDate: 'Jun 10, 2025' },
  { id: 3, title: 'UX Designer',               location: 'New York, NY',      department: 'Design',      postedDate: 'Jun 8, 2025'  },
  { id: 4, title: 'Data Scientist',            location: 'Austin, TX',        department: 'Data',        postedDate: 'Jun 5, 2025'  },
  { id: 5, title: 'DevOps Engineer',           location: 'Remote',            department: 'Engineering', postedDate: 'Jun 1, 2025'  },
  { id: 6, title: 'Sales Development Rep',     location: 'Chicago, IL',       department: 'Sales',       postedDate: 'May 28, 2025' },
];

export const mockChanges = [
  {
    id: 1,
    pageUrl: 'https://acmecorp.com/pricing',
    detectedDate: 'Jun 13, 2025',
    description: 'Pricing tier restructured — Pro plan price increased by $20/mo',
    before: 'Pro plan: $79/month, includes 10 seats',
    after:  'Pro plan: $99/month, includes 15 seats',
  },
  {
    id: 2,
    pageUrl: 'https://acmecorp.com/features',
    detectedDate: 'Jun 9, 2025',
    description: 'New "AI Assistant" feature added to features page',
    before: 'No mention of AI capabilities',
    after:  'AI Assistant section added with demo video embed',
  },
  {
    id: 3,
    pageUrl: 'https://acmecorp.com/about',
    detectedDate: 'Jun 3, 2025',
    description: 'Leadership team page updated — 2 new executives listed',
    before: '8 executives listed',
    after:  '10 executives listed, including new CTO and VP of Sales',
  },
];

export const mockSentimentTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  score: Math.min(100, Math.max(10, 55 + Math.round(Math.sin(i / 3) * 18 + (Math.random() - 0.5) * 12))),
}));

export const mockRedditMentions = [
  { id: 1, title: 'Anyone else notice Acme Corp raised prices again?',         subreddit: 'r/SaaS',         upvotes: 342, date: 'Jun 13, 2025' },
  { id: 2, title: 'Acme Corp vs Initech — honest comparison after 6 months',   subreddit: 'r/entrepreneur', upvotes: 218, date: 'Jun 10, 2025' },
  { id: 3, title: 'Acme Corp support has gone downhill lately',                 subreddit: 'r/smallbusiness',upvotes: 97,  date: 'Jun 7, 2025'  },
  { id: 4, title: 'New AI feature from Acme is actually impressive',            subreddit: 'r/artificial',   upvotes: 504, date: 'Jun 4, 2025'  },
  { id: 5, title: 'Switched from Acme Corp — here\'s what I learned',          subreddit: 'r/startups',     upvotes: 163, date: 'May 30, 2025' },
];

export const mockChangelog = [
  { id: 1, date: 'Jun 12, 2025', version: 'v4.2.0', title: 'AI Assistant Beta Launch',       description: 'Introduced AI-powered assistant for automated report generation and competitor summaries.' },
  { id: 2, date: 'Jun 1, 2025',  version: 'v4.1.3', title: 'Performance Improvements',       description: 'Dashboard load time reduced by 40%. Fixed memory leak in real-time monitoring module.' },
  { id: 3, date: 'May 20, 2025', version: 'v4.1.0', title: 'New Integrations: Slack & Teams', description: 'Push alerts directly to Slack channels or Microsoft Teams. Configure per-competitor notification rules.' },
  { id: 4, date: 'May 5, 2025',  version: 'v4.0.1', title: 'Bug Fixes',                      description: 'Resolved CSV export encoding issue. Fixed date filter on the jobs monitoring table.' },
  { id: 5, date: 'Apr 18, 2025', version: 'v4.0.0', title: 'Major Release — Platform v4',    description: 'Complete UI overhaul, new pricing engine, multi-user workspaces, and API v2 with full REST support.' },
];
