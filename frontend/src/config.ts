export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "",
  siteName: import.meta.env.VITE_SITE_NAME || "Ayaan's Room",
  enableAudio: import.meta.env.VITE_ENABLE_AUDIO !== "false",
  resumeFallbackUrl:
    import.meta.env.VITE_RESUME_FALLBACK_URL ||
    "/assets/resume/AyaanKhan_Resume.pdf",
  githubUrl: import.meta.env.VITE_GITHUB_URL || "https://github.com/AyaanKhan1576",
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/in/ayaan-khan-b7ba11325",
  emailAddress: import.meta.env.VITE_EMAIL_ADDRESS || "khanayaan.2003@gmail.com",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  supabaseConfigured: Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  ),
};

export function apiUrl(path: string): string {
  return `${config.apiBaseUrl}${path}`;
}
