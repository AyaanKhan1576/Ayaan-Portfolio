const DEFAULT_ALLOWED_EVENTS = new Set([
  "site_visit",
  "visit",
  "object_interaction",
  "section_open",
  "project_view",
  "simulation_launch",
  "resume_download",
]);

const WINDOW_MS = 60_000;
const buckets = new Map();

export function applySecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  res.setHeader("Cache-Control", "no-store");
}

export function methodAllowed(req, res, method) {
  if (req.method === method) return true;
  res.setHeader("Allow", method);
  res.status(405).json({ error: "Request failed" });
  return false;
}

export function requireJson(req, res) {
  const contentType = req.headers["content-type"] ?? "";
  if (typeof contentType === "string" && contentType.toLowerCase().includes("application/json")) return true;
  res.status(415).json({ error: "Request failed" });
  return false;
}

export function checkBodySize(req, res, maxBytes = 4096) {
  const rawLength = req.headers["content-length"];
  const contentLength = typeof rawLength === "string" ? Number(rawLength) : 0;
  if (Number.isFinite(contentLength) && contentLength <= maxBytes) return true;
  res.status(413).json({ error: "Request failed" });
  return false;
}

export function getRequestIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  return req.socket?.remoteAddress ?? "unknown";
}

export function rateLimit(req, res, { keyPrefix, limit }) {
  const now = Date.now();
  const ip = getRequestIp(req);
  const key = `${keyPrefix}:${ip}`;
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  bucket.count += 1;
  if (bucket.count <= limit) return true;

  res.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
  res.status(429).json({ error: "Request failed" });
  return false;
}

export function parseJsonBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  if (typeof body === "object" && !Array.isArray(body)) return body;
  return null;
}

export function sanitizeAnalyticsBody(body, allowedEvents = DEFAULT_ALLOWED_EVENTS) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const eventType = typeof body.eventType === "string" ? body.eventType.slice(0, 64) : "";
  if (!allowedEvents.has(eventType)) return null;

  const metadata = sanitizeMetadata(body.metadata);
  return { eventType, metadata };
}

function sanitizeMetadata(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const allowedKeys = new Set(["section", "projectId", "objectId", "displayName", "route", "mode"]);
  const output = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!allowedKeys.has(key)) continue;
    if (typeof raw === "string") output[key] = raw.slice(0, 160);
    else if (typeof raw === "number" || typeof raw === "boolean") output[key] = raw;
  }
  return output;
}

export function safeUserAgent(req) {
  const userAgent = req.headers["user-agent"];
  return typeof userAgent === "string" ? userAgent.slice(0, 180) : null;
}
