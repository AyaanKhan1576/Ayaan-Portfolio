import { getSupabaseAdmin } from "../server/supabaseAdmin.js";
import {
  applySecurityHeaders,
  checkBodySize,
  methodAllowed,
  parseJsonBody,
  rateLimit,
  requireJson,
  safeUserAgent,
  sanitizeAnalyticsBody,
} from "./_security.js";

export default async function handler(req, res) {
  applySecurityHeaders(res);
  if (!methodAllowed(req, res, "POST")) return;
  if (!checkBodySize(req, res, 4096)) return;
  if (!requireJson(req, res)) return;
  if (!rateLimit(req, res, { keyPrefix: "analytics", limit: 40 })) return;

  const parsedBody = parseJsonBody(req.body);
  const sanitized = sanitizeAnalyticsBody(parsedBody);
  if (!sanitized) {
    return res.status(400).json({ accepted: false, persisted: false });
  }

  const { eventType, metadata } = sanitized;
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return res.status(200).json({ accepted: true, persisted: false });
  }

  try {
    const { error } = await supabase.from("analytics_events").insert({
      event_type: eventType,
      metadata,
      user_agent: safeUserAgent(req),
      ip_address: null,
    });

    if (error) {
      return res.status(200).json({ accepted: true, persisted: false });
    }

    return res.status(200).json({ accepted: true, persisted: true });
  } catch {
    return res.status(200).json({ accepted: true, persisted: false });
  }
}
