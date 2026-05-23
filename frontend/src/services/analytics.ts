import { config } from "../config";
import type { AnalyticsEvent } from "../types";

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  if (!config.apiBaseUrl) return;

  try {
    await fetch(`${config.apiBaseUrl}/api/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // Analytics must never block the interface.
  }
}
