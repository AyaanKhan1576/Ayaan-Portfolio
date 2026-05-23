import { config } from "../config";
import type { AnalyticsEvent } from "../types";
import { trackEvent } from "./analytics";

export async function downloadResume(): Promise<void> {
  await trackEvent({ eventType: "resume_download" });
  window.location.assign(config.resumeAssetUrl);
}

export async function submitContact(payload: { name: string; email: string; subject: string; message: string }): Promise<boolean> {
  await trackEvent({ eventType: "contact_submit", metadata: { source: "signal_channel" } } satisfies AnalyticsEvent);

  if (!config.apiBaseUrl) return false;

  try {
    const response = await fetch(`${config.apiBaseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}
