export const config = {
  app: {
    name: 'Tab Finder',
    version: '1.0.0',
    description: 'Find tabs using natural language descriptions with AI assistance',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tab-finder-3.vercel.app/',
    timeout: 30000,
    huggingFaceApiKey: process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || '',
    huggingFaceEndpoint: process.env.NEXT_PUBLIC_HUGGING_FACE_ENDPOINT || 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
  },
  features: {
    maxTabsToSearch: 100,
    searchHistoryLimit: 50,
    aiSearchEnabled: true,
  },
  storage: {
    searchHistoryKey: 'tab-finder-search-history',
    userPreferencesKey: 'tab-finder-preferences',
  },
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    trackingId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },
};

export type Config = typeof config; 