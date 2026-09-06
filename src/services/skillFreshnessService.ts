// Skill Freshness Service
// Evaluates evidence freshness decay curve based on elapsed time.

export type FreshnessLevel = 'recent' | 'needs_refresh' | 'stale';

export interface FreshnessScore {
  level: FreshnessLevel;
  freshnessMultiplier: number; // 0.0 - 1.0
  daysElapsed: number;
  label: string;
}

export const skillFreshnessService = {
  calculateFreshness(lastDemonstratedDate: string | number | Date): FreshnessScore {
    if (!lastDemonstratedDate) {
      return {
        level: 'needs_refresh',
        freshnessMultiplier: 0.65,
        daysElapsed: 365,
        label: 'Needs Refresh (> 12 mo)'
      };
    }

    const timestamp = new Date(lastDemonstratedDate).getTime();
    const diffMs = Math.max(0, Date.now() - timestamp);
    const daysElapsed = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (daysElapsed <= 120) {
      // Demonstrated within last 4 months: full freshness
      return {
        level: 'recent',
        freshnessMultiplier: 1.0,
        daysElapsed,
        label: 'Active & Recent'
      };
    } else if (daysElapsed <= 270) {
      // 4 to 9 months: minor decay
      const decay = 1.0 - ((daysElapsed - 120) / 150) * 0.15;
      return {
        level: 'recent',
        freshnessMultiplier: Math.round(decay * 100) / 100,
        daysElapsed,
        label: 'Recent'
      };
    } else if (daysElapsed <= 450) {
      // 9 to 15 months: moderate decay
      const decay = 0.85 - ((daysElapsed - 270) / 180) * 0.25;
      return {
        level: 'needs_refresh',
        freshnessMultiplier: Math.round(decay * 100) / 100,
        daysElapsed,
        label: 'Needs Refresh'
      };
    } else {
      // > 15 months: stale
      return {
        level: 'stale',
        freshnessMultiplier: 0.5,
        daysElapsed,
        label: 'Stale (> 15 mo)'
      };
    }
  }
};
