export interface Tab {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  windowId: number;
  active: boolean;
}

export interface SearchResult {
  tab: Tab;
  relevance: number;
  matchReason: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  searchHistory: string[];
  maxSearchResults: number;
  aiSearchEnabled: boolean;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultsCount: number;
}

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp: number;
} 