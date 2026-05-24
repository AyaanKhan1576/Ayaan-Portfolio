import { apiUrl, config } from "../config";

export async function downloadResume(): Promise<void> {
  let resumeUrl = config.resumeFallbackUrl;
  try {
    const response = await fetch(apiUrl("/api/resume"));
    if (response.ok) {
      const payload = (await response.json()) as { resumeUrl?: string };
      resumeUrl = payload.resumeUrl || resumeUrl;
    }
  } catch {
    // Resume access must keep working even when the tracking API is unavailable.
  }

  window.open(resumeUrl, "_blank", "noopener,noreferrer");
}
