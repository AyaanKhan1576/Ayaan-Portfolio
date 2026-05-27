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

function sameOriginOrRelative(url: string): boolean {
  try {
    return new URL(url, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
}

export async function downloadResume(): Promise<void> {
  const trackedResumeUrl = await getTrackedResumeUrl();
  const resumeUrl =
    sameOriginOrRelative(trackedResumeUrl) || !sameOriginOrRelative(config.resumeFallbackUrl)
      ? trackedResumeUrl
      : config.resumeFallbackUrl;
  const anchor = document.createElement("a");
  anchor.href = resumeUrl;
  anchor.download = "AyaanKhan_Resume.pdf";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
