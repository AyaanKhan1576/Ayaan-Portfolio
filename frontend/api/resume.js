import { getSupabaseAdmin } from "../server/supabaseAdmin.js";

async function logResumeDownload() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("Supabase admin client is not configured; resume download event skipped.");
    return false;
  }

  const { error } = await supabase.from("analytics_events").insert({
    event_type: "resume_download",
    metadata: {},
  });

  if (error) {
    console.error("Failed to persist resume download event:", error);
    return false;
  }

  return true;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const resumeUrl = process.env.RESUME_FILE_URL;
  if (!resumeUrl) {
    console.warn("RESUME_FILE_URL is not configured.");
    return res.status(503).json({ error: "Resume URL is not configured." });
  }

  try {
    await logResumeDownload();
  } catch (error) {
    console.error("Unexpected resume tracking failure:", error);
  }

  return res.status(200).json({ resumeUrl });
}
