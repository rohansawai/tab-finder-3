import { AnalyticsEvent } from '../types';
import { config } from '../config/config';

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (!config.analytics.enabled) return;

    const event: AnalyticsEvent = {
      eventName,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  private async sendToAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      // Implement your analytics service here (e.g., Google Analytics, Mixpanel)
      if (config.analytics.trackingId) {
        // Example implementation
        console.log('Analytics event:', event);
      }
    } catch (error) {
      console.error('Error sending analytics:', error);
    }
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  clearEvents(): void {
    this.events = [];
  }
}

export const analyticsService = AnalyticsService.getInstance(); 