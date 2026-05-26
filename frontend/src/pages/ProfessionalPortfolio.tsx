import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Server,
  Sparkles,
} from "lucide-react";
import { config } from "../config";
import { education } from "../data/education";
import { experience } from "../data/experience";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { downloadResume } from "../services/api";
import { trackEvent } from "../services/analytics";
import type { Project } from "../types";

export type PortfolioRoute = "/" | "/professional" | "/projects" | "/room";
export type ProjectFilter = "All" | "AI/ML" | "Computer Vision" | "RAG" | "AI Agents" | "Backend" | "DevOps" | "Data Science";

export const projectFilters: ProjectFilter[] = ["All", "AI/ML", "Computer Vision", "RAG", "AI Agents", "Backend", "DevOps", "Data Science"];

const heroTags = ["LLMs", "RAG", "Computer Vision", "AI Agents", "FastAPI", "Python", "Backend Systems"];
const featuredIds = ["pose2play", "financial-sentiment-rag", "event-booking-microservices"];

const featuredBriefs: Record<string, { problem: string; built: string; outcome: string }> = {
  pose2play: {
    problem: "Rehabilitation feedback is difficult to personalize without real-time movement understanding.",
    built: "Built webcam pose tracking, temporal form assessment, adaptive feedback, and a web/VR therapy loop.",
    outcome: "A product-like AI rehabilitation prototype spanning model inference, backend APIs, and Unity VR.",
  },
  "financial-sentiment-rag": {
    problem: "Financial sentiment needs domain language and retrieval context, not generic classification alone.",
    built: "Combined FinBERT, Flan-T5, FAISS retrieval, RAG classification, and metric-driven comparison.",
    outcome: "Reported 96.29% sentiment accuracy in the resume-backed selected project summary.",
  },
  "event-booking-microservices": {
    problem: "Event platforms need clear service boundaries, async communication, delivery automation, and observability.",
    built: "Designed FastAPI, Flask, and Node.js microservices with RabbitMQ, databases, Kubernetes, GitOps, and monitoring.",
    outcome: "A cloud-native backend platform demonstrating practical production and DevOps workflows.",
  },
};

const categoryMatchers: Record<ProjectFilter, string[]> = {
  All: [],
  "AI/ML": ["AI", "ML", "NLP", "GenAI", "Generative", "Translation", "Audio", "Classical AI", "Distributed ML"],
  "Computer Vision": ["Computer Vision", "Vision", "CycleGAN", "Image", "Pose", "Plant"],
  RAG: ["RAG", "Retrieval"],
  "AI Agents": ["Agent", "Agentic", "Simulation", "Control"],
  Backend: ["Backend", "Fullstack", "Microservices", "Flask", "FastAPI", "Node", "REST"],
  DevOps: ["DevOps", "Cloud", "Kubernetes", "Docker", "AWS", "Terraform"],
  "Data Science": ["Data", "Analytics", "Streaming", "Kafka", "Spark", "MapReduce", "Big Data"],
};

export function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.14 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

export function displayText(value: string) {
  return value.replace("sÃ¯Paradigm", "sïParadigm").replace("sÃƒÂ¯Paradigm", "sïParadigm");
}

export function projectMatches(project: Project, filter: ProjectFilter) {
  if (filter === "All") return true;
  const haystack = [...project.tags, ...project.technologies, project.title, project.short_description].join(" ").toLowerCase();
  return categoryMatchers[filter].some((keyword) => haystack.includes(keyword.toLowerCase()));
}

export function ProfessionalPortfolio({ onNavigate }: { onNavigate: (path: PortfolioRoute) => void }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const featuredProjects = projects.filter((project) => featuredIds.includes(project.id));
  useScrollReveal();

  async function copyEmail() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API is unavailable.");
      await navigator.clipboard.writeText(config.emailAddress);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <main className="pro-page">
      <AtmosphericDust />
      <ProfessionalNav onNavigate={onNavigate} />

      <section className="pro-hero cinematic-hero" id="top">
        <div className="pro-hero-copy reveal is-visible">
          <p className="pro-eyebrow">Ayaan Khan / AI & Software Engineer</p>
          <h1>Production AI systems, built with software discipline.</h1>
          <p className="pro-hero-line">
            LLMs, Computer Vision, RAG & AI Agents | Fullstack, Cloud & DevOps | CS @ FAST NUCES'26
          </p>
          <p className="pro-hero-summary">
            I build practical intelligent systems where model behavior, backend architecture, data pipelines, and
            deployment all meet in one production-ready surface.
          </p>
          <div className="pro-actions">
            <a className="pro-button pro-button-primary magnetic-link" href="#featured">
              View Featured Work
              <ArrowRight size={17} />
            </a>
            <button className="pro-button pro-button-secondary magnetic-link" onClick={() => onNavigate("/projects")} type="button">
              Explore Project Archive
            </button>
            <button className="pro-button pro-button-tertiary magnetic-link" onClick={() => onNavigate("/room")} type="button">
              Enter Ayaan's Room
            </button>
          </div>

          <div className="hero-action-dock" aria-label="Recruiter actions">
            <a href={config.resumeFallbackUrl} rel="noreferrer" target="_blank">
              <FileText size={17} />
              View Resume
            </a>
            <button
              onClick={() => {
                void trackEvent({ eventType: "resume_download", metadata: { surface: "professional_hero" } });
                void downloadResume();
              }}
              type="button"
            >
              <Download size={17} />
              Download
            </button>
            <a href={config.githubUrl} rel="noreferrer" target="_blank">
              <Github size={17} />
              GitHub
            </a>
            <a href={config.linkedinUrl} rel="noreferrer" target="_blank">
              <Linkedin size={17} />
              LinkedIn
            </a>
            <button onClick={copyEmail} type="button">
              <Mail size={17} />
              Email
              {copyStatus === "copied" ? <small>copied.</small> : null}
              {copyStatus === "failed" ? <small>copy unavailable.</small> : null}
            </button>
          </div>

          <div className="pro-tag-row hero-tags" aria-label="Core technologies">
            {heroTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <HeroCinematicPanel />
      </section>

      <section className="pro-section" id="featured">
        <SectionHeader
          eyebrow="Featured systems"
          title="Three projects that define the engineering story."
          summary="A tighter homepage: applied computer vision, retrieval-heavy NLP, and cloud-native backend systems."
        />
        <div className="featured-grid curated-grid">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard index={index} key={project.id} project={project} />
          ))}
        </div>
        <div className="archive-strip reveal">
          <span>20 curated projects across AI, backend, cloud, data, and systems.</span>
          <button className="pro-button pro-button-secondary" onClick={() => onNavigate("/projects")} type="button">
            Open Project Archive
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="pro-section split-section" id="about">
        <SectionHeader eyebrow="About" title="AI engineering with backend instincts." />
        <div className="about-copy pro-panel reveal">
          <p>
            I'm an AI & Software Engineer interested in building intelligent systems that are practical, scalable, and
            production ready.
          </p>
          <p>
            Currently pursuing a BS in Computer Science at FAST NUCES, Class of 2026, I've worked on projects involving
            LLMs, RAG pipelines, AI agents, fullstack applications, cloud infrastructure, and real-time ML systems.
          </p>
          <p>
            I primarily work with Python, FastAPI, and modern AI frameworks, with a strong foundation in C/C++. My
            experience also includes Docker, Kubernetes, CI/CD workflows, data pipelines, and backend system design.
          </p>
        </div>
      </section>

      <section className="pro-section" id="experience">
        <SectionHeader eyebrow="Experience" title="Recent work across data automation, agents, coordination, and systems." />
        <div className="timeline cinematic-timeline">
          {experience.map((item, index) => {
            const [title, company] = displayText(item.title).split(" - ");
            return (
              <article className="timeline-card reveal" key={`${item.period}-${item.title}`} style={{ "--stagger": `${index * 70}ms` } as CSSProperties}>
                <span>{item.period}</span>
                <div>
                  <h3>{company ?? item.title}</h3>
                  <p className="timeline-role">{title}</p>
                  <p>{displayText(item.detail)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="pro-section" id="skills">
        <SectionHeader eyebrow="Skills" title="A stack organized by production responsibility." />
        <div className="skill-card-grid">
          {skills.map((group, index) => (
            <article className="pro-panel skill-group reveal" key={group.category} style={{ "--stagger": `${index * 55}ms` } as CSSProperties}>
              <div className="skill-icon">{skillIcon(group.category)}</div>
              <h3>{group.category}</h3>
              <div className="pro-tag-row">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pro-section" id="education">
        <SectionHeader eyebrow="Education" title="Computer Science foundation with AI, systems, and cloud coursework." />
        <article className="education-card pro-panel reveal">
          <div>
            <GraduationCap size={22} />
            <h3>{education.university}</h3>
            <p>{education.degree} / {education.location}</p>
          </div>
          <span>{education.period}</span>
          <p>{education.summary}</p>
          <div className="pro-tag-row">
            {education.coursework.map((course) => (
              <span key={course}>{course}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="pro-section cta-section" id="contact">
        <div className="cta-panel reveal">
          <div>
            <p className="pro-eyebrow">Contact</p>
            <h2>Open to AI engineering, ML systems, backend, and platform-heavy work.</h2>
            <p>Use the quick actions at the top, or jump into the project archive for a deeper technical read.</p>
          </div>
          <div className="pro-actions">
            <button className="pro-button pro-button-primary" onClick={() => onNavigate("/projects")} type="button">
              Explore Projects
              <ArrowRight size={17} />
            </button>
            <a className="pro-button pro-button-secondary" href={`mailto:${config.emailAddress}`}>
              <Mail size={17} />
              Email
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ProfessionalNav({ onNavigate }: { onNavigate: (path: PortfolioRoute) => void }) {
  function navigateToSection(sectionId: string) {
    onNavigate("/professional");
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  return (
    <header className="pro-nav" aria-label="Professional portfolio navigation">
      <button className="pro-brand" onClick={() => onNavigate("/")} type="button">
        <span>AK</span>
        Ayaan Khan
      </button>
      <nav className="pro-nav-links" aria-label="Sections">
        <button onClick={() => onNavigate("/professional")} type="button">Home</button>
        <button onClick={() => onNavigate("/projects")} type="button">Projects</button>
        <button onClick={() => navigateToSection("experience")} type="button">Experience</button>
        <button onClick={() => navigateToSection("contact")} type="button">Contact</button>
      </nav>
      <button className="pro-button pro-button-secondary pro-room-switch" onClick={() => onNavigate("/room")} type="button">
        Enter Ayaan's Room
      </button>
    </header>
  );
}

export function AtmosphericDust() {
  return (
    <div className="atmosphere" aria-hidden="true">
      {Array.from({ length: 34 }).map((_, index) => (
        <span
          key={index}
          style={{
            "--x": `${(index * 37) % 100}%`,
            "--y": `${(index * 53) % 100}%`,
            "--s": `${1 + (index % 5) * 0.42}px`,
            "--d": `${18 + (index % 8) * 3}s`,
            "--delay": `${index * -0.72}s`,
            "--alpha": `${0.14 + (index % 6) * 0.045}`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, summary }: { eyebrow: string; title: string; summary?: string }) {
  return (
    <div className="section-heading reveal">
      <p className="pro-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {summary ? <p>{summary}</p> : null}
    </div>
  );
}

function HeroCinematicPanel() {
  const rows = [
    ["rag.context", "FAISS + FinBERT", "96.29%"],
    ["vision.feedback", "MediaPipe + LSTM", "realtime"],
    ["agent.eval", "Pydantic AI", "tested"],
    ["deploy.flow", "K8s + GitOps", "synced"],
  ];

  return (
    <aside className="hero-cinema pro-panel reveal is-visible" aria-label="Technical system composition">
      <div className="cinema-scanline" />
      <div className="cinema-header">
        <span>live_system_map</span>
        <CheckCircle2 size={17} />
      </div>
      <div className="architecture-stage">
        <div className="arch-node node-source">
          <span>input</span>
          webcam / docs / APIs
        </div>
        <div className="arch-node node-model">
          <span>models</span>
          LLMs / CV / retrieval
        </div>
        <div className="arch-node node-ship">
          <span>ship</span>
          FastAPI / cloud / CI
        </div>
        <svg className="arch-lines" viewBox="0 0 420 250" role="img" aria-label="Architecture connection lines">
          <path d="M76 76 C158 32 218 32 326 74" />
          <path d="M78 176 C166 220 240 218 330 174" />
          <path d="M92 88 C142 128 202 146 305 156" />
        </svg>
      </div>
      <div className="system-grid cinematic-grid">
        {rows.map(([name, tool, status]) => (
          <div className="system-row" key={name}>
            <span>{name}</span>
            <b>{tool}</b>
            <small>{status}</small>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const brief = featuredBriefs[project.id];

  return (
    <article className="featured-card reveal" style={{ "--stagger": `${index * 90}ms` } as CSSProperties}>
      <ProjectVisual project={project} />
      <div className="featured-meta">
        <span>{project.status}</span>
        <span>{project.tags.slice(0, 3).join(" / ")}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.short_description}</p>
      <div className="case-study-list">
        <div>
          <b>Problem</b>
          <p>{brief?.problem ?? project.long_description}</p>
        </div>
        <div>
          <b>What I built</b>
          <p>{brief?.built ?? project.role}</p>
        </div>
        <div>
          <b>Outcome</b>
          <p>{brief?.outcome ?? "Documented as a polished technical project with repository-level implementation details."}</p>
        </div>
      </div>
      <div className="pro-tag-row">
        {project.technologies.slice(0, 8).map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      <ProjectLinks project={project} />
    </article>
  );
}

export function ProjectVisual({ project }: { project: Project }) {
  return (
    <div className={`project-visual project-visual-${project.id}`} aria-hidden="true">
      <div className="visual-toolbar">
        <span />
        <span />
        <span />
      </div>
      <div className="visual-stack">
        <span>{project.tags[0] ?? "system"}</span>
        <b>{project.title.split(" ").slice(0, 4).join(" ")}</b>
        <small>{project.technologies.slice(0, 3).join(" / ")}</small>
      </div>
      <div className="visual-meter" />
    </div>
  );
}

export function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-links">
      {project.github_url ? (
        <a href={project.github_url} rel="noreferrer" target="_blank">
          <Github size={16} />
          GitHub
        </a>
      ) : null}
      {project.live_demo_url ? (
        <a href={project.live_demo_url} rel="noreferrer" target="_blank">
          <ExternalLink size={16} />
          Live
        </a>
      ) : null}
      {project.demo_video_url ? (
        <a href={project.demo_video_url} rel="noreferrer" target="_blank">
          <ExternalLink size={16} />
          Demo
        </a>
      ) : null}
    </div>
  );
}

function skillIcon(category: string) {
  if (category.includes("AI")) return <Sparkles size={18} />;
  if (category.includes("Data")) return <Database size={18} />;
  if (category.includes("Backend")) return <Server size={18} />;
  if (category.includes("DevOps")) return <BriefcaseBusiness size={18} />;
  if (category.includes("Databases")) return <Database size={18} />;
  return <Code2 size={18} />;
}
