export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "",
  siteName: import.meta.env.VITE_SITE_NAME || "Ayaan's Room",
  enableAudio: import.meta.env.VITE_ENABLE_AUDIO !== "false",
};
