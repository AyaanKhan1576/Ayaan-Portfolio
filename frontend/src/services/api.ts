import { apiUrl, config } from "../config";

export async function getTrackedResumeUrl(): Promise<string> {
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

  return resumeUrl;
}

export async function downloadResume(): Promise<void> {
  const resumeUrl = await getTrackedResumeUrl();
  const anchor = document.createElement("a");
  anchor.href = resumeUrl;
  anchor.download = "AyaanKhan_Resume.pdf";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
