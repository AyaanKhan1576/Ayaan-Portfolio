import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileText,
  Gamepad2,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Moon,
  Network,
  Play,
  Server,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { config } from "../config";
import { education } from "../data/education";
import { experience } from "../data/experience";
import { mediaItems } from "../data/media";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { useProfessionalSound } from "../hooks/useProfessionalSound";
import { useProfessionalTheme, type ProfessionalTheme } from "../hooks/useProfessionalTheme";
import { downloadResume } from "../services/api";
import { trackEvent } from "../services/analytics";
import type { Project } from "../types";

export type PortfolioRoute = "/" | "/professional" | "/projects" | "/room";
export type ProjectFilter = "All" | "AI/ML" | "Computer Vision" | "RAG" | "AI Agents" | "Backend" | "DevOps" | "Data Science";

export const projectFilters: ProjectFilter[] = ["All", "AI/ML", "Computer Vision", "RAG", "AI Agents", "Backend", "DevOps", "Data Science"];

const heroTags = ["LLMs", "RAG", "Computer Vision", "AI Agents", "FastAPI", "Python", "Backend Systems"];
const featuredIds = ["pose2play", "financial-sentiment-rag", "event-booking-microservices"];
const previewIds = ["synthetic-music-detector", "multimodal-pdf-rag", "semantic-product-search", "online-catalogue-devops", "real-time-crime-analytics", "english-urdu-mbart"];

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

const sectionOrder = [
  ["about", "About Me"],
  ["contact", "Contact"],
  ["resume", "Resume"],
  ["education", "Education"],
  ["experience", "Experience"],
  ["featured", "Featured Projects"],
  ["skills", "Skills"],
  ["projects-preview", "All Projects"],
  ["honors", "Leadership"],
] as const;

export function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

export function useProfessionalMotion(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".campaign-media",
        { clipPath: "inset(8% 0 8% 0)", y: 24 },
        {
          clipPath: "inset(0% 0 0% 0)",
          duration: 1.15,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".campaign-copy > *",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.88, stagger: 0.08, ease: "power3.out" },
      );

      gsap.utils.toArray<HTMLElement>(".editorial-scene").forEach((scene, index) => {
        const trigger = scene.querySelector(".scene-trigger");
        const detail = scene.querySelector(".scene-detail");
        gsap.fromTo(
          trigger,
          { autoAlpha: 0, x: index % 2 === 0 ? -34 : 34 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: scene, start: "top 78%" },
          },
        );
        gsap.fromTo(
          detail,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: scene, start: "top 66%" },
          },
        );
      });

      gsap.to(".campaign-media", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: ".campaign-hero", start: "top top", end: "bottom top", scrub: 0.75 },
      });

      gsap.to(".editorial-atmosphere", {
        "--atmosphere-drift": 1,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, scope);

    return () => ctx.revert();
  }, [scopeRef]);
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
  const lastSoundTargetRef = useRef<Element | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [openScene, setOpenScene] = useState<string>("about");
  const sound = useProfessionalSound();
  const { theme, toggleTheme } = useProfessionalTheme();
  const featuredProjects = projects.filter((project) => featuredIds.includes(project.id));
  const previewProjects = projects.filter((project) => previewIds.includes(project.id));
  useScrollReveal();
  useProfessionalMotion(pageRef);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!pageRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = pageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, window.innerHeight) - 0.5) * 2;
    pageRef.current.style.setProperty("--mx", x.toFixed(3));
    pageRef.current.style.setProperty("--my", y.toFixed(3));
  }

  function handlePointerOver(event: PointerEvent<HTMLElement>) {
    const interactive = (event.target as HTMLElement).closest("a, button");
    if (!interactive || interactive === lastSoundTargetRef.current) return;
    lastSoundTargetRef.current = interactive;
    sound.play("hover");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animate(interactive, { y: [0, -2, 0], duration: 420, ease: "out(3)" });
    }
  }

  function handleInteractionClick(event: ReactMouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a, button")) sound.play("select");
  }

  async function copyEmail() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(config.emailAddress);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = config.emailAddress;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("Copy command failed.");
      }
    } catch {
      // Some embedded browsers block clipboard writes; the visible action remains a best-effort copy affordance.
    }
    setCopyStatus("copied");
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <main
      className="pro-page editorial-home"
      data-theme={theme}
      onClickCapture={handleInteractionClick}
      onPointerMove={handlePointerMove}
      onPointerOverCapture={handlePointerOver}
      ref={pageRef}
    >
      <EditorialAtmosphere />
      <ProfessionalNav
        activeSection={openScene}
        onNavigate={onNavigate}
        onToggleSound={sound.toggle}
        onToggleTheme={toggleTheme}
        soundEnabled={sound.enabled}
        theme={theme}
      />

      <section className="campaign-hero" id="top">
        <div className="campaign-media" aria-hidden="true">
          <ProductionSystemVisual />
        </div>
        <div className="campaign-copy reveal is-visible">
          <p>AI & SOFTWARE ENGINEER</p>
          <h1>Ayaan Khan</h1>
          <span>Building production-ready intelligent systems with LLMs, Computer Vision, RAG, AI Agents, and backend engineering.</span>
          <div className="editorial-pills">
            {heroTags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className="campaign-actions">
            <a className="pill-primary" href="#about">Explore Story <ArrowRight size={17} /></a>
            <button className="pill-secondary" onClick={() => onNavigate("/projects")} type="button">Project Archive</button>
            <button className="pill-secondary" onClick={() => onNavigate("/room")} type="button"><Gamepad2 size={17} /> Enter Interactive Portfolio</button>
          </div>
          <SocialContactRow copyEmail={copyEmail} copyStatus={copyStatus} />
        </div>
      </section>

      <StoryRail active={openScene} setActive={setOpenScene} />

      <Scene id="about" number="01" open={openScene === "about"} setOpen={setOpenScene} title="About Me" kicker="The person behind the systems">
        <div className="scene-copy-grid">
          <p>I’m an AI & Software Engineer interested in building intelligent systems that are practical, scalable, and production ready.</p>
          <p>Currently pursuing a BS in Computer Science at FAST NUCES, Class of 2026, I’ve worked on LLMs, RAG pipelines, AI agents, fullstack applications, cloud infrastructure, and real-time ML systems.</p>
          <p>I primarily work with Python, FastAPI, and modern AI frameworks, with a strong C/C++ foundation and experience across Docker, Kubernetes, CI/CD, data pipelines, and backend system design.</p>
        </div>
      </Scene>

      <Scene id="contact" number="02" open={openScene === "contact"} setOpen={setOpenScene} title="Contact" kicker="Direct professional signals">
        <SocialContactRow copyEmail={copyEmail} copyStatus={copyStatus} expanded />
      </Scene>

      <Scene id="resume" number="03" open={openScene === "resume"} setOpen={setOpenScene} title="Resume" kicker="The concise document layer">
        <div className="resume-editorial">
          <div className="document-photo" aria-hidden="true"><FileText size={28} /><b>Ayaan Khan</b><span /></div>
          <div>
            <p>View or download the current resume while preserving the existing tracked download behavior.</p>
            <div className="campaign-actions">
              <a className="pill-secondary" href={config.resumeFallbackUrl} rel="noreferrer" target="_blank">View Resume</a>
              <button
                className="pill-primary"
                onClick={() => {
                  void trackEvent({ eventType: "resume_download", metadata: { surface: "professional_editorial" } });
                  void downloadResume();
                }}
                type="button"
              >
                Download Resume <Download size={17} />
              </button>
            </div>
          </div>
        </div>
      </Scene>

      <Scene id="education" number="04" open={openScene === "education"} setOpen={setOpenScene} title="Education" kicker="Computer science foundation">
        <div className="education-editorial">
          <div className="timeline-dot"><GraduationCap size={22} /></div>
          <div>
            <h3>{education.university}</h3>
            <p>{education.degree} / {education.location}</p>
            <b>{education.period}</b>
            <div className="editorial-pills">{education.coursework.map((course) => <span key={course}>{course}</span>)}</div>
          </div>
        </div>
      </Scene>

      <Scene id="experience" number="05" open={openScene === "experience"} setOpen={setOpenScene} title="Experience" kicker="Applied work in motion">
        <div className="experience-editorial">
          {experience.map((item) => {
            const [title, company] = displayText(item.title).split(" - ");
            return (
              <article key={item.title}>
                <span>{item.period}</span>
                <h3>{company ?? item.title}</h3>
                <b>{title}</b>
                <p>{displayText(item.detail)}</p>
              </article>
            );
          })}
        </div>
      </Scene>

      <Scene id="featured" number="06" open={openScene === "featured"} setOpen={setOpenScene} title="Featured Projects" kicker="Three production-facing case studies">
        <div className="featured-editorial">
          {featuredProjects.map((project, index) => <FeaturedProjectCard index={index} key={project.id} project={project} />)}
        </div>
      </Scene>

      <Scene id="skills" number="07" open={openScene === "skills"} setOpen={setOpenScene} title="Skills" kicker="Grouped capabilities, no bars">
        <div className="skills-editorial">
          {skills.map((group) => (
            <article key={group.category}>
              <div>{skillIcon(group.category)}</div>
              <h3>{group.category}</h3>
              <div className="editorial-pills">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
          ))}
        </div>
      </Scene>

      <Scene id="projects-preview" number="08" open={openScene === "projects-preview"} setOpen={setOpenScene} title="All Projects Preview" kicker="A moving catalog before the archive">
        <div className="product-rail">
          {[...previewProjects, ...previewProjects].map((project, index) => <PreviewProjectCard key={`${project.id}-${index}`} project={project} />)}
        </div>
        <button className="pill-primary" onClick={() => onNavigate("/projects")} type="button">View All Projects <ArrowRight size={17} /></button>
      </Scene>

      <Scene id="honors" number="09" open={openScene === "honors"} setOpen={setOpenScene} title="Leadership and Honors" kicker="Signals beyond repositories">
        <div className="honors-editorial">
          {mediaItems.map((item) => (
            <article key={item.id}>
              <div>{item.type === "pdf" ? <FileText size={24} /> : <Award size={24} />}</div>
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Scene>
    </main>
  );
}

function Scene({ children, id, kicker, number, open, setOpen, title }: {
  children: ReactNode;
  id: string;
  kicker: string;
  number: string;
  open: boolean;
  setOpen: (id: string) => void;
  title: string;
}) {
  return (
    <section className={`editorial-scene scene-${id} reveal ${open ? "open" : ""}`} id={id}>
      <button className="scene-trigger" onClick={() => setOpen(id)} type="button">
        <span>{number}</span>
        <div>
          <p>{kicker}</p>
          <h2>{title}</h2>
        </div>
        <ArrowRight size={22} />
      </button>
      <div className="scene-detail">{children}</div>
    </section>
  );
}

function StoryRail({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <aside className="story-rail" aria-label="Professional portfolio scenes">
      {sectionOrder.map(([id, label], index) => (
        <button className={active === id ? "active" : ""} key={id} onClick={() => setActive(id)} type="button">
          <span>{String(index + 1).padStart(2, "0")} /</span>
          <b>{label}</b>
        </button>
      ))}
    </aside>
  );
}

export function ProfessionalNav({ activeSection, onNavigate, onToggleSound, onToggleTheme, soundEnabled, theme = "light" }: {
  onNavigate: (path: PortfolioRoute) => void;
  activeSection?: string;
  onToggleSound?: () => void;
  onToggleTheme?: () => void;
  soundEnabled?: boolean;
  theme?: ProfessionalTheme;
}) {
  return (
    <header className="pro-nav editorial-nav" aria-label="Professional portfolio navigation">
      <button className="pro-brand" onClick={() => onNavigate("/")} type="button"><span>AK</span>Ayaan Khan</button>
      <nav className="pro-nav-links" aria-label="Sections">
        <button className={activeSection ? "active" : ""} onClick={() => onNavigate("/professional")} type="button"><span>01 /</span><b>Story</b></button>
        <button onClick={() => onNavigate("/projects")} type="button"><span>02 /</span><b>Projects</b></button>
        <button onClick={() => onNavigate("/room")} type="button"><span>03 /</span><b>Interactive Portfolio</b></button>
      </nav>
      <div className="pro-nav-actions">
        {onToggleTheme ? (
          <button className="pro-theme-toggle" onClick={onToggleTheme} type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        ) : null}
        {onToggleSound ? (
          <button className="pro-sound-toggle" onClick={onToggleSound} type="button" aria-pressed={Boolean(soundEnabled)}>
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>{soundEnabled ? "Sound on" : "Sound off"}</span>
          </button>
        ) : null}
        <button className="pill-secondary compact" onClick={() => onNavigate("/room")} type="button">Enter Interactive Portfolio</button>
      </div>
    </header>
  );
}

function SocialContactRow({ copyEmail, copyStatus, expanded = false }: { copyEmail: () => void; copyStatus: "idle" | "copied" | "failed"; expanded?: boolean }) {
  return (
    <div className={`social-contact-row ${expanded ? "expanded" : ""}`}>
      <a href={config.githubUrl} rel="noreferrer" target="_blank"><Github size={18} />GitHub</a>
      <a href={config.linkedinUrl} rel="noreferrer" target="_blank"><Linkedin size={18} />LinkedIn</a>
      <button onClick={copyEmail} type="button">
        <Mail size={18} />{config.emailAddress}
        {copyStatus !== "idle" ? <small>copied.</small> : null}
      </button>
      <a href={config.resumeFallbackUrl} rel="noreferrer" target="_blank"><FileText size={18} />Resume</a>
    </div>
  );
}

export function EditorialAtmosphere() {
  return (
    <div className="editorial-atmosphere" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, index) => <span key={index} style={{ "--x": `${(index * 31) % 100}%`, "--d": `${18 + index % 8}s` } as CSSProperties} />)}
    </div>
  );
}

export function AtmosphericDust() {
  return <EditorialAtmosphere />;
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

function ProductionSystemVisual() {
  const nodes = ["AI Agents", "RAG", "APIs", "Backend", "Vision", "Data", "Cloud", "Frontend"];
  return (
    <div className="editorial-system" aria-label="Production AI system visual">
      <svg viewBox="0 0 620 620" role="img" aria-label="Connected AI architecture">
        <path d="M310 90 C440 110 520 210 510 330 C500 468 386 542 260 520 C130 496 74 382 104 252 C130 146 210 92 310 90Z" />
        <path d="M130 310 C220 180 390 170 500 310" />
        <path d="M165 430 C290 300 390 310 474 432" />
        <circle className="data-pulse pulse-a" r="5" />
        <circle className="data-pulse pulse-b" r="4" />
      </svg>
      <div className="system-core"><Network size={22} /><b>Production AI</b><span>models + APIs + infrastructure</span></div>
      {nodes.map((node, index) => <span className={`system-chip chip-${index}`} key={node}>{node}</span>)}
    </div>
  );
}

export function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="featured-editorial-card" style={{ "--stagger": `${index * 80}ms` } as CSSProperties}>
      <ProjectVisual project={project} />
      <span>{project.tags.slice(0, 2).join(" / ")}</span>
      <h3>{project.title}</h3>
      <p>{project.short_description}</p>
      <b>{project.role}</b>
      <div className="editorial-pills">{project.technologies.slice(0, 6).map((tech) => <span key={tech}>{tech}</span>)}</div>
      <ProjectLinks project={project} />
    </article>
  );
}

function PreviewProjectCard({ project }: { project: Project }) {
  return (
    <article className="preview-product">
      <ProjectVisual project={project} />
      <h3>{project.title}</h3>
      <p>{project.tags.slice(0, 3).join(" / ")}</p>
    </article>
  );
}

export function ProjectVisual({ project }: { project: Project }) {
  return (
    <div className="project-visual editorial-photo" aria-hidden="true">
      <div className="visual-playback"><Play size={14} /><span>preview</span></div>
      <b>{project.title.split(" ").slice(0, 3).join(" ")}</b>
      <span>{project.technologies.slice(0, 3).join(" / ")}</span>
    </div>
  );
}

export function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-links">
      {project.github_url ? <a href={project.github_url} rel="noreferrer" target="_blank"><Github size={16} />GitHub</a> : null}
      {project.live_demo_url ? <a href={project.live_demo_url} rel="noreferrer" target="_blank"><ExternalLink size={16} />Live</a> : null}
      {project.demo_video_url ? <a href={project.demo_video_url} rel="noreferrer" target="_blank"><ExternalLink size={16} />Demo</a> : null}
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
