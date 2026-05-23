export type SectionId =
  | "intro"
  | "about"
  | "skills"
  | "featured"
  | "projects"
  | "simulations"
  | "media"
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

export interface Simulation {
  id: string;
  title: string;
  description: string;
  iframe_url?: string;
  fallback_url?: string;
  thumbnail?: string;
  technologies: string[];
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
    | "visit"
    | "object_interaction"
    | "project_view"
    | "resume_download"
    | "simulation_launch"
    | "contact_submit";
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
  interactionPrompt?: string;
}
