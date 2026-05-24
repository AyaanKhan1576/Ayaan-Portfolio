export type SectionId =
  | "intro"
  | "about"
  | "skills"
  | "featured"
  | "projects"
  | "media"
  | "education"
  | "experience"
  | "resume"
  | "contact";

export type ProjectStatus = "deployed" | "prototype" | "research" | "archived";

export interface Project {
  id: string;
  title: string;
  short_description: string;
  long_description: string;
  technologies: string[];
  role: string;
  screenshots: string[];
  demo_video_url?: string;
  slide_url?: string;
  github_url?: string;
  live_demo_url?: string;
  tags: string[];
  featured: boolean;
  status: ProjectStatus;
}

export interface MediaItem {
  id: string;
  title: string;
  type: "video" | "image" | "pdf" | "diagram";
  url: string;
  projectId?: string;
  description: string;
}

export interface AnalyticsEvent {
  eventType:
    | "site_visit"
    | "object_interaction"
    | "section_open"
    | "project_view"
    | "resume_download";
  metadata?: Record<string, unknown>;
}

export type InteractionType = "dialogue" | "menu" | "download" | "external";

export interface RoomObject {
  object_id: string;
  display_name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  interaction_radius: number;
  interaction_type: InteractionType;
  linked_portfolio_section: SectionId;
  color: number;
  accent: number;
  label: string;
  assetKey?: string;
  frameKey?: string;
  directImage?: boolean;
  interactionPrompt?: string;
}
