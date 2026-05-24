import { apiUrl } from "../config";
import type { AnalyticsEvent } from "../types";

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    await fetch(apiUrl("/api/analytics"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // Analytics must never block the interface.
  }
}
