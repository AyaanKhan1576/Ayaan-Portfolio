import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
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
  Layers3,
  Linkedin,
  Mail,
  Network,
  Play,
  Server,
  Sparkles,
} from "lucide-react";
import { config } from "../config";
import { education } from "../data/education";
import { experience } from "../data/experience";
import { mediaItems } from "../data/media";
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
const previewIds = ["synthetic-music-detector", "multimodal-pdf-rag", "semantic-product-search", "online-catalogue-devops", "real-time-crime-analytics", "english-urdu-mbart"];

const featuredBriefs: Record<string, { problem: string; built: string; outcome: string }> = {
  pose2play: {
    problem: "Rehabilitation needs real-time feedback that can understand body movement, not just count repetitions.",
    built: "A webcam-to-feedback loop with MediaPipe, temporal LSTM assessment, adaptive targets, backend inference, and VR integration.",
    outcome: "A product-shaped AI rehab system that connects perception, backend APIs, adaptation, and frontend/VR experience.",
  },
  "financial-sentiment-rag": {
    problem: "Financial sentiment depends on domain language, retrieval context, and measurable model behavior.",
    built: "A hybrid pipeline using FinBERT, Flan-T5, FAISS retrieval, RAG classification, and precision/recall/F1 evaluation.",
    outcome: "Reported 96.29% sentiment accuracy in the selected project summary with a clear retrieval and evaluation story.",
  },
  "event-booking-microservices": {
    problem: "Production platforms need boundaries, messaging, observability, infrastructure, and delivery discipline.",
    built: "FastAPI, Flask, and Node services with RabbitMQ, PostgreSQL, MongoDB, Docker, Kubernetes, GitOps, and monitoring.",
    outcome: "A cloud-native backend system showing how services move from code to deployed infrastructure.",
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
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

export function displayText(value: string) {
  return value.replace("sÃ¯Paradigm", "sïParadigm").replace("sÃƒÂ¯Paradigm", "sïParadigm").replace("sÃƒÆ’Ã‚Â¯Paradigm", "sïParadigm");
}

export function projectMatches(project: Project, filter: ProjectFilter) {
  if (filter === "All") return true;
  const haystack = [...project.tags, ...project.technologies, project.title, project.short_description].join(" ").toLowerCase();
  return categoryMatchers[filter].some((keyword) => haystack.includes(keyword.toLowerCase()));
}

export function ProfessionalPortfolio({ onNavigate }: { onNavigate: (path: PortfolioRoute) => void }) {
  const pageRef = useRef<HTMLElement | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const featuredProjects = projects.filter((project) => featuredIds.includes(project.id));
  const previewProjects = projects.filter((project) => previewIds.includes(project.id));
  useScrollReveal();

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!pageRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = pageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, window.innerHeight) - 0.5) * 2;
    pageRef.current.style.setProperty("--mx", x.toFixed(3));
    pageRef.current.style.setProperty("--my", y.toFixed(3));
  }

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
    <main className="pro-page professional-home" onPointerMove={handlePointerMove} ref={pageRef}>
      <AtmosphericDust />
      <ProfessionalNav onNavigate={onNavigate} />

      <section className="story-hero" id="top">
        <div className="story-hero-copy reveal is-visible">
          <p className="pro-eyebrow">Ayaan Khan / AI & Software Engineer</p>
          <h1>Building intelligent systems from model behavior to production infrastructure.</h1>
          <p className="story-hero-lede">
            I work across LLMs, RAG, Computer Vision, AI Agents, backend systems, cloud workflows, and data pipelines to
            turn intelligent prototypes into practical software.
          </p>
          <div className="pro-tag-row hero-tags" aria-label="Core technologies">
            {heroTags.map((tag, index) => (
              <span key={tag} style={{ "--stagger": `${index * 42}ms` } as CSSProperties}>{tag}</span>
            ))}
          </div>
          <div className="pro-actions">
            <a className="pro-button pro-button-primary magnetic-link" href="#about">
              Start with About
              <ArrowRight size={17} />
            </a>
            <button className="pro-button pro-button-secondary magnetic-link" onClick={() => onNavigate("/projects")} type="button">
              View Project Archive
            </button>
            <button className="pro-button pro-button-tertiary magnetic-link" onClick={() => onNavigate("/room")} type="button">
              Enter Ayaan's Room
            </button>
          </div>
          <SocialContactRow copyEmail={copyEmail} copyStatus={copyStatus} surface="hero" />
        </div>
        <ProductionSystemVisual />
      </section>

      <section className="story-section about-story" id="about">
        <SectionHeader eyebrow="01 / About Me" title="What this portfolio is about: practical AI systems, not isolated demos." summary="A personal starting point before the technical archive." />
        <div className="about-story-grid">
          <div className="about-narrative pro-panel reveal">
            {[
              "I'm an AI & Software Engineer interested in building intelligent systems that are practical, scalable, and production ready.",
              "Currently pursuing a BS in Computer Science at FAST NUCES, Class of 2026, I've worked on projects involving LLMs, RAG pipelines, AI agents, fullstack applications, cloud infrastructure, and real-time ML systems.",
              "I primarily work with Python, FastAPI, and modern AI frameworks, with a strong foundation in C/C++. My experience also includes Docker, Kubernetes, CI/CD workflows, data pipelines, and backend system design.",
            ].map((paragraph, index) => (
              <p className="word-reveal" key={paragraph} style={{ "--stagger": `${index * 120}ms` } as CSSProperties}>{paragraph}</p>
            ))}
          </div>
          <div className="principle-stack reveal">
            {["Model behavior", "Backend contracts", "Data movement", "Deployment reality"].map((item, index) => (
              <div className="principle-card" key={item} style={{ "--stagger": `${index * 80}ms` } as CSSProperties}>
                <span>0{index + 1}</span>
                <b>{item}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section contact-story" id="contact">
        <SectionHeader eyebrow="02 / Contact" title="Direct paths for recruiters and collaborators." summary="Resume, code, profile, and email are intentionally close to the top." />
        <div className="contact-command pro-panel reveal">
          <SocialContactRow copyEmail={copyEmail} copyStatus={copyStatus} surface="contact" />
        </div>
      </section>

      <section className="story-section resume-story" id="resume">
        <SectionHeader eyebrow="03 / Resume" title="The concise document view, with the same tracked download behavior." summary="Use the document preview frame when you want the short version before opening project details." />
        <div className="resume-cinema pro-panel reveal">
          <div className="resume-preview-frame" aria-hidden="true">
            <div className="paper-sheet">
              <span />
              <b>Ayaan Khan</b>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="resume-copy">
            <p>Current resume with education, experience, selected projects, skills, leadership, and contact details.</p>
            <div className="pro-actions">
              <a className="pro-button pro-button-secondary" href={config.resumeFallbackUrl} rel="noreferrer" target="_blank">
                <FileText size={17} />
                View Resume
              </a>
              <button
                className="pro-button pro-button-primary"
                onClick={() => {
                  void trackEvent({ eventType: "resume_download", metadata: { surface: "professional_resume" } });
                  void downloadResume();
                }}
                type="button"
              >
                <Download size={17} />
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="story-section education-story" id="education">
        <SectionHeader eyebrow="04 / Education" title="Computer Science foundation for AI, systems, and cloud work." summary="The coursework is the base layer under the production-oriented projects." />
        <article className="education-cinematic pro-panel reveal">
          <div className="education-node">
            <GraduationCap size={22} />
          </div>
          <div>
            <h3>{education.university}</h3>
            <p>{education.degree} / {education.location}</p>
            <span>{education.period}</span>
            <p>{education.summary}</p>
            <div className="pro-tag-row course-tags">
              {education.coursework.map((course, index) => (
                <span key={course} style={{ "--stagger": `${index * 32}ms` } as CSSProperties}>{course}</span>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="story-section experience-story" id="experience">
        <SectionHeader eyebrow="05 / Experience" title="Professional experience: coordination, data automation, agentic AI, and systems work." summary="A timeline of applied work that connects technical delivery with production constraints." />
        <div className="experience-flow">
          {experience.map((item, index) => {
            const [title, company] = displayText(item.title).split(" - ");
            return (
              <article className="experience-entry reveal" key={`${item.period}-${item.title}`} style={{ "--stagger": `${index * 95}ms` } as CSSProperties}>
                <div className="experience-marker" />
                <span>{item.period}</span>
                <div className="experience-card pro-panel">
                  <h3>{company ?? item.title}</h3>
                  <p className="timeline-role">{title}</p>
                  <p>{displayText(item.detail)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="story-section featured-story" id="featured">
        <SectionHeader eyebrow="06 / Featured Projects" title="Featured case studies: the clearest evidence of production AI engineering." summary="Each project card is built like a small launch surface with problem, implementation, outcome, and technical media placeholders." />
        <div className="featured-case-grid">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard index={index} key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="story-section skills-story" id="skills">
        <SectionHeader eyebrow="07 / Skills" title="Skill clusters organized by how intelligent systems are shipped." summary="No bars, no fake percentages. Just grouped capabilities with motion and hierarchy." />
        <div className="skill-orbit-grid">
          {skills.map((group, index) => (
            <article className="skill-orbit pro-panel reveal" key={group.category} style={{ "--stagger": `${index * 70}ms` } as CSSProperties}>
              <div className="skill-icon">{skillIcon(group.category)}</div>
              <h3>{group.category}</h3>
              <div className="pro-tag-row floating-tags">
                {group.items.map((item, itemIndex) => (
                  <span key={item} style={{ "--stagger": `${itemIndex * 28}ms` } as CSSProperties}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section all-projects-preview" id="projects-preview">
        <SectionHeader eyebrow="08 / All Projects Preview" title="A quick scan before the full project archive." summary="The homepage stays curated, while the archive gives the complete technical map." />
        <div className="project-marquee reveal">
          <div className="project-marquee-track">
            {[...previewProjects, ...previewProjects].map((project, index) => (
              <PreviewProjectCard key={`${project.id}-${index}`} project={project} />
            ))}
          </div>
        </div>
        <div className="archive-strip reveal">
          <span>{projects.length} total projects across AI, backend, cloud, data, and systems.</span>
          <button className="pro-button pro-button-primary" onClick={() => onNavigate("/projects")} type="button">
            View All Projects
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="story-section honors-story" id="honors">
        <SectionHeader eyebrow="09 / Leadership and Honors" title="Leadership, academic recognition, and community work." summary="A final gallery for signals that do not fit neatly into code repositories." />
        <div className="honors-gallery">
          {mediaItems.map((item, index) => (
            <article className="honor-frame pro-panel reveal" key={item.id} style={{ "--stagger": `${index * 90}ms` } as CSSProperties}>
              <div className="honor-media" aria-hidden="true">
                {item.type === "video" ? <Play size={22} /> : item.type === "pdf" ? <FileText size={22} /> : <Award size={22} />}
              </div>
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
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
        <button onClick={() => navigateToSection("about")} type="button">About</button>
        <button onClick={() => navigateToSection("contact")} type="button">Contact</button>
        <button onClick={() => navigateToSection("experience")} type="button">Experience</button>
        <button onClick={() => onNavigate("/projects")} type="button">Projects</button>
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
      {Array.from({ length: 42 }).map((_, index) => (
        <span
          key={index}
          style={{
            "--x": `${(index * 37) % 100}%`,
            "--y": `${(index * 53) % 100}%`,
            "--s": `${1 + (index % 6) * 0.38}px`,
            "--d": `${20 + (index % 9) * 3}s`,
            "--delay": `${index * -0.66}s`,
            "--alpha": `${0.12 + (index % 6) * 0.038}`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, summary }: { eyebrow: string; title: string; summary?: string }) {
  return (
    <div className="section-heading story-heading reveal">
      <p className="pro-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {summary ? <p>{summary}</p> : null}
    </div>
  );
}

function SocialContactRow({
  copyEmail,
  copyStatus,
  surface,
}: {
  copyEmail: () => void;
  copyStatus: "idle" | "copied" | "failed";
  surface: string;
}) {
  return (
    <div className="social-contact-row" aria-label={`${surface} contact actions`}>
      <a data-tip="Open GitHub" href={config.githubUrl} rel="noreferrer" target="_blank">
        <Github size={18} />
        GitHub
      </a>
      <a data-tip="Open LinkedIn" href={config.linkedinUrl} rel="noreferrer" target="_blank">
        <Linkedin size={18} />
        LinkedIn
      </a>
      <button data-tip="Copy email" onClick={copyEmail} type="button">
        <Mail size={18} />
        {config.emailAddress}
        {copyStatus === "copied" ? <small>copied.</small> : null}
        {copyStatus === "failed" ? <small>copy unavailable.</small> : null}
      </button>
      <a data-tip="View resume" href={config.resumeFallbackUrl} rel="noreferrer" target="_blank">
        <FileText size={18} />
        Resume
      </a>
    </div>
  );
}

function ProductionSystemVisual() {
  const nodes = [
    { id: "agents", label: "AI Agents", meta: "planning / tools", className: "node-agents" },
    { id: "rag", label: "RAG", meta: "retrieval / grounding", className: "node-rag" },
    { id: "apis", label: "APIs", meta: "FastAPI / REST", className: "node-apis" },
    { id: "vision", label: "Computer Vision", meta: "pose / media", className: "node-vision" },
    { id: "backend", label: "Backend Systems", meta: "services / queues", className: "node-backend" },
    { id: "cloud", label: "Cloud + Infra", meta: "Docker / K8s / CI", className: "node-cloud" },
    { id: "data", label: "Data Pipelines", meta: "ETL / streaming", className: "node-data" },
    { id: "frontend", label: "Frontend Experiences", meta: "web / VR / dashboards", className: "node-frontend" },
  ];

  return (
    <aside className="production-system pro-panel reveal is-visible" aria-label="Production AI architecture visual">
      <div className="system-legend">
        <span>production_ai_architecture</span>
        <CheckCircle2 size={17} />
      </div>
      <div className="system-canvas">
        <svg className="system-connections" viewBox="0 0 560 520" role="img" aria-label="Connected AI system flow">
          <path d="M92 160 C170 86 254 74 356 116" />
          <path d="M356 116 C432 156 470 230 452 312" />
          <path d="M452 312 C386 396 286 420 190 374" />
          <path d="M190 374 C122 318 80 242 92 160" />
          <path d="M140 112 C220 210 308 240 442 210" />
          <path d="M132 306 C242 286 352 306 470 398" />
          <path d="M280 258 C230 188 202 154 140 112" />
          <path d="M280 258 C352 220 396 174 442 210" />
          <path d="M280 258 C302 336 356 386 470 398" />
          <path d="M280 258 C226 300 190 338 132 306" />
        </svg>
        <div className="system-core">
          <Network size={20} />
          <b>Production AI</b>
          <span>models + software + infra</span>
        </div>
        {nodes.map((node) => (
          <div className={`system-node ${node.className}`} key={node.id}>
            <b>{node.label}</b>
            <span>{node.meta}</span>
          </div>
        ))}
      </div>
      <div className="system-caption">
        <Layers3 size={16} />
        Intelligent systems are strongest when retrieval, perception, APIs, data, frontend, and infrastructure are designed together.
      </div>
    </aside>
  );
}

export function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const brief = featuredBriefs[project.id];

  return (
    <article className="featured-card launch-card reveal" style={{ "--stagger": `${index * 110}ms` } as CSSProperties}>
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
          <p>{brief?.outcome ?? "A documented technical project with repository-level implementation details."}</p>
        </div>
      </div>
      <div className="pro-tag-row moving-stack">
        {project.technologies.slice(0, 8).map((tech, techIndex) => (
          <span key={tech} style={{ "--stagger": `${techIndex * 34}ms` } as CSSProperties}>{tech}</span>
        ))}
      </div>
      <ProjectLinks project={project} />
    </article>
  );
}

function PreviewProjectCard({ project }: { project: Project }) {
  return (
    <article className="preview-project-card">
      <ProjectVisual project={project} />
      <span>{project.tags.slice(0, 2).join(" / ")}</span>
      <h3>{project.title}</h3>
      <p>{project.short_description}</p>
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
      <div className="visual-playback">
        <Play size={15} />
        <span>preview</span>
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
  if (category.includes("Languages")) return <Code2 size={18} />;
  return <BookOpen size={18} />;
}
