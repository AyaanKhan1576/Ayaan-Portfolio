import { getRequestIp, getSupabaseAdmin } from "../server/supabaseAdmin.js";

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ accepted: false, persisted: false });
  }

  const body = normalizeBody(req.body);
  const eventType = typeof body.eventType === "string" ? body.eventType : "unknown";
  const metadata = body.metadata && typeof body.metadata === "object" ? body.metadata : {};
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    console.warn("Supabase admin client is not configured; analytics event skipped.");
    return res.status(200).json({ accepted: true, persisted: false });
  }

  try {
    const { error } = await supabase.from("analytics_events").insert({
      event_type: eventType,
      metadata,
      user_agent: req.headers["user-agent"] ?? null,
      ip_address: getRequestIp(req) ?? null,
    });

    if (error) {
      console.error("Failed to persist analytics event:", error);
      return res.status(200).json({ accepted: true, persisted: false });
    }

    return res.status(200).json({ accepted: true, persisted: true });
  } catch (error) {
    console.error("Unexpected analytics failure:", error);
    return res.status(200).json({ accepted: true, persisted: false });
  }
}
