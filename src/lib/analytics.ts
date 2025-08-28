// Lightweight analytics adapter with no-op default
// Usage: import { analytics } from '@/lib/analytics'; analytics.track('event', { ... })

export type AnalyticsPayload = Record<string, any>;

export interface AnalyticsAdapter {
  track: (event: string, payload?: AnalyticsPayload) => void;
}

class NoopAnalytics implements AnalyticsAdapter {
  track(_event: string, _payload?: AnalyticsPayload) {
    // no-op
  }
}

class ConsoleAnalytics implements AnalyticsAdapter {
  track(event: string, payload?: AnalyticsPayload) {
    if (import.meta.env.MODE !== 'production') {
      // Guard to avoid leaking PII; keep payloads small
      // eslint-disable-next-line no-console
      console.log('[analytics]', event, payload || {});
    }
  }
}

// Future: GA4 or PostHog providers can be added here

function createAdapter(): AnalyticsAdapter {
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER?.toLowerCase();
  switch (provider) {
    case 'console':
      return new ConsoleAnalytics();
    // case 'ga4': return new GA4Analytics(import.meta.env.VITE_GA4_MEASUREMENT_ID!);
    // case 'posthog': return new PosthogAnalytics(import.meta.env.VITE_POSTHOG_KEY!, import.meta.env.VITE_POSTHOG_HOST);
    default:
      return new NoopAnalytics();
  }
}

export const analytics: AnalyticsAdapter = createAdapter();
