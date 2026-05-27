import { getSupabaseAdmin } from "../server/supabaseAdmin.js";
import { applySecurityHeaders, methodAllowed, rateLimit } from "./_security.js";

async function logResumeDownload() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("analytics_events").insert({
    event_type: "resume_download",
    metadata: {},
  });

  if (error) {
    return false;
  }

  return true;
}

export default async function handler(req, res) {
  applySecurityHeaders(res);
  if (!methodAllowed(req, res, "GET")) return;
  if (!rateLimit(req, res, { keyPrefix: "resume", limit: 10 })) return;

  const resumeUrl = process.env.RESUME_FILE_URL;
  if (!resumeUrl) {
    return res.status(503).json({ error: "Request failed" });
  }

  try {
    await logResumeDownload();
  } catch {
    // Resume access should continue even if tracking fails.
  }

  return res.status(200).json({ resumeUrl });
}
