export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "",
  siteName: import.meta.env.VITE_SITE_NAME || "Ayaan's Room",
  enableAudio: import.meta.env.VITE_ENABLE_AUDIO !== "false",
  resumeAssetUrl: import.meta.env.VITE_RESUME_ASSET_URL || "/assets/resume/AyaanKhan_Resume.pdf",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  supabaseConfigured: Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  ),
};
