import { Tab, SearchResult } from '../types';
import { config } from '../config/config';
import { aiService } from './aiService';

class TabService {
  private static instance: TabService;

  private constructor() {}

  public static getInstance(): TabService {
    if (!TabService.instance) {
      TabService.instance = new TabService();
    }
    return TabService.instance;
  }

  async getAllTabs(): Promise<Tab[]> {
    try {
      const tabs = await chrome.tabs.query({});
      return tabs.map(tab => ({
        id: tab.id!,
        title: tab.title!,
        url: tab.url!,
        favIconUrl: tab.favIconUrl,
        windowId: tab.windowId,
        active: tab.active,
      }));
    } catch (error) {
      console.error('Error fetching tabs:', error);
      return [];
    }
  }

  async searchTabs(query: string): Promise<SearchResult[]> {
    try {
      const tabs = await this.getAllTabs();
      
      // If AI search is enabled, use it
      if (config.features.aiSearchEnabled) {
        try {
          return await this.searchTabsWithAI(query, tabs);
        } catch (aiError) {
          console.error('AI search failed, falling back to local search:', aiError);
          // Fall back to local search if AI search fails
          return this.searchTabsLocally(query, tabs);
        }
      } else {
        // Use local search if AI search is disabled
        return this.searchTabsLocally(query, tabs);
      }
    } catch (error) {
      console.error('Error searching tabs:', error);
      return [];
    }
  }

  private async searchTabsWithAI(query: string, tabs: Tab[]): Promise<SearchResult[]> {
    // Get embedding for the query
    const queryEmbedding = await aiService.getEmbedding(query);
    
    // Get embeddings for each tab
    const tabEmbeddings = await Promise.all(
      tabs.map(async (tab) => {
        const text = `${tab.title} ${tab.url}`;
        const embedding = await aiService.getEmbedding(text);
        return { tab, embedding };
      })
    );
    
    // Calculate similarity scores
    const results: SearchResult[] = tabEmbeddings.map(({ tab, embedding }) => {
      const relevance = aiService.calculateCosineSimilarity(queryEmbedding, embedding);
      return {
        tab,
        relevance,
        matchReason: `Semantic similarity: ${relevance.toFixed(2)}`,
      };
    });
    
    // Sort by relevance (descending)
    return results
      .filter(result => result.relevance > 0.5)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, config.features.maxTabsToSearch);
  }

  private searchTabsLocally(query: string, tabs: Tab[]): SearchResult[] {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const results: SearchResult[] = [];

    for (const tab of tabs) {
      const content = `${tab.title} ${tab.url}`.toLowerCase();
      let relevance = 0;
      const matchReasons: string[] = [];

      // Count how many query terms appear in the tab content
      for (const term of queryTerms) {
        if (content.includes(term)) {
          relevance += 1;
          matchReasons.push(`Contains "${term}"`);
        }
      }

      if (relevance > 0) {
        results.push({
          tab,
          relevance,
          matchReason: matchReasons.join(', '),
        });
      }
    }

    // Sort by relevance (descending)
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, config.features.maxTabsToSearch);
  }

  async switchToTab(tabId: number): Promise<void> {
    try {
      await chrome.tabs.update(tabId, { active: true });
    } catch (error) {
      console.error('Error switching to tab:', error);
      throw error;
    }
  }
}

export const tabService = TabService.getInstance(); 