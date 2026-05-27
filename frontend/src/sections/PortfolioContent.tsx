import { ChevronLeft, ChevronRight, FileDown, Film, Github, Image as ImageIcon, Linkedin, Mail, Maximize2, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { gsap } from "gsap";
import { config } from "../config";
import { education } from "../data/education";
import { experience } from "../data/experience";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { downloadResume } from "../services/api";
import { trackEvent } from "../services/analytics";
import { HonorsGallery } from "../pages/ProfessionalPortfolio";
import type { Project, ProjectMedia, SectionId } from "../types";

export function PortfolioContent({ section, openSection }: { section: SectionId; openSection: (section: SectionId) => void }) {
  switch (section) {
    case "intro":
      return <Intro openSection={openSection} />;
    case "about":
      return <About />;
    case "skills":
      return <Skills />;
    case "featured":
      return <Projects onlyFeatured />;
    case "projects":
      return <Projects />;
    case "media":
      return <LeadershipAndHonors />;
    case "education":
      return <Education />;
    case "experience":
      return <ExperienceTimeline />;
    case "resume":
      return <Resume />;
    case "contact":
      return <Contact />;
    case "fluff":
      return <Fluff />;
  }
}

function Intro({ openSection }: { openSection: (section: SectionId) => void }) {
  return (
    <div className="dialogue-copy">
      <p> You wake up in a quiet little room. Each object keeps a piece of Ayaan Khan's professional story.</p>
      <p>Move with WASD or arrow keys. Stand near something and press E. Tapping objects works too.</p>
      <div className="pixel-actions">
        <button onClick={() => openSection("about")} type="button">Start at the desk</button>
        <button onClick={() => openSection("projects")} type="button">Open quest files</button>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="dialogue-copy">
      <p className="soft-role">AI & Software Engineer building production-ready intelligent systems</p>
      <p>
        I focus on practical AI systems across LLMs, RAG, AI agents, computer vision, backend-focused fullstack
        engineering, and cloud/DevOps workflows. I am pursuing a BS in Computer Science at FAST-NUCES, Class of 2026,
        and primarily work with Python, modern AI frameworks, and have a strong C/C++ foundation.
      </p>
      <div className="two-column">
        <div className="paper-card">
          <b>Engineering Focus</b>
          <p>Production-ready LLM, RAG, agentic AI, computer vision, and backend systems.</p>
        </div>
        <div className="paper-card">
          <b>Tooling</b>
          <p>Docker, Kubernetes, AWS, CI/CD, data pipelines, system design, PostgreSQL, and MongoDB.</p>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className="skills-grid">
      {skills.map((group) => (
        <article className="skill-card" key={group.category}>
          <b>{group.category}</b>
          <div className="tag-row">
            {group.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function Projects({ onlyFeatured = false }: { onlyFeatured?: boolean }) {
  const shown = onlyFeatured ? projects.filter((project) => project.featured).slice(0, 4) : projects;
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    const selectedMedia = getProjectMedia(selected);
    return (
      <div className="dialogue-copy">
        <button className="back-link" onClick={() => setSelected(null)} type="button">Back to memories</button>
        <GameProjectArchive project={selected} media={selectedMedia} />
        <p><b>Role:</b> {selected.role}</p>
        <div className="tag-row">{selected.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
        <div className="pixel-actions">
          {selected.github_url ? <a href={selected.github_url} rel="noreferrer" target="_blank">Code</a> : null}
          {selected.live_demo_url ? <a href={selected.live_demo_url} rel="noreferrer" target="_blank">Live Demo</a> : null}
          {selected.demo_video_url ? <a href={selected.demo_video_url} rel="noreferrer" target="_blank">Video</a> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="quest-grid">
      {shown.map((project) => (
        <article className="quest-card project-card" key={project.id}>
          <button
            className="project-card-main"
            onClick={() => {
              setSelected(project);
              void trackEvent({ eventType: "project_view", metadata: { projectId: project.id } });
            }}
            type="button"
          >
            <span>{project.status}</span>
            <GameProjectThumbnail media={getProjectMedia(project)[0]} title={project.title} />
            <b>{project.title}</b>
            <p>{project.short_description}</p>
          </button>
          {project.github_url ? (
            <a className="project-card-link" href={project.github_url} rel="noreferrer" target="_blank">
              <Github size={15} />
              GitHub
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function getProjectMedia(project: Project): ProjectMedia[] {
  const explicit = project.media ?? [];
  const screenshots = project.screenshots.map((src, index): ProjectMedia => {
    const extension = src.split(".").pop()?.toLowerCase();
    return {
      type: extension === "gif" ? "gif" : index === 0 ? "diagram" : "image",
      src,
      caption: index === 0 ? "Architecture / project visual" : `Project still ${index + 1}`,
      alt: `${project.title} ${index === 0 ? "architecture visual" : `screenshot ${index + 1}`}`,
    };
  });
  const video = project.demo_video_url
    ? [{
        type: "video" as const,
        src: project.demo_video_url,
        thumbnail: project.screenshots[0],
        caption: "Demo clip",
        alt: `${project.title} demo video`,
      }]
    : [];

  return [...explicit, ...screenshots, ...video].filter((item, index, items) => items.findIndex((candidate) => candidate.src === item.src) === index);
}

function GameProjectThumbnail({ media, title }: { media?: ProjectMedia; title: string }) {
  if (!media) {
    return (
      <div className="game-project-thumb game-project-thumb-empty" aria-hidden="true">
        <ImageIcon size={18} />
      </div>
    );
  }

  return (
    <div className="game-project-thumb" aria-hidden="true">
      {media.type === "video" ? (
        <>
          {media.thumbnail ? <img alt="" loading="lazy" src={media.thumbnail} /> : null}
          <Film size={18} />
        </>
      ) : (
        <img alt="" loading="lazy" src={media.thumbnail ?? media.src} />
      )}
      <span>{title}</span>
    </div>
  );
}

function GameProjectArchive({ media, project }: { media: ProjectMedia[]; project: Project }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const activeMedia = media[activeIndex];

  useEffect(() => {
    if (activeIndex >= media.length) setActiveIndex(0);
  }, [activeIndex, media.length]);

  return (
    <div className="game-project-archive">
      <div>
        <h3>{project.title}</h3>
        <p>{project.long_description}</p>
      </div>
      {media.length ? (
        <div className="memory-album" aria-label={`${project.title} media album`}>
          <button className="memory-album-stage" onClick={() => setViewerOpen(true)} type="button">
            <RenderProjectMedia media={activeMedia} mode="preview" />
            <span className="memory-album-open"><Maximize2 size={15} /> Open memory</span>
          </button>
          <div className="memory-album-caption">
            <span>{activeIndex + 1}/{media.length}</span>
            <p>{activeMedia.caption ?? project.title}</p>
          </div>
          {media.length > 1 ? (
            <div className="memory-strip" aria-label="Project media thumbnails">
              {media.map((item, index) => (
                <button className={index === activeIndex ? "active" : ""} key={`${item.src}-${index}`} onClick={() => setActiveIndex(index)} type="button" aria-label={`View ${item.caption ?? item.alt}`}>
                  <RenderProjectMedia media={item} mode="thumb" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {viewerOpen ? (
        <GameMediaViewer
          media={media}
          onClose={() => setViewerOpen(false)}
          projectTitle={project.title}
          selectedIndex={activeIndex}
          setSelectedIndex={setActiveIndex}
        />
      ) : null}
    </div>
  );
}

function GameMediaViewer({
  media,
  onClose,
  projectTitle,
  selectedIndex,
  setSelectedIndex,
}: {
  media: ProjectMedia[];
  onClose: () => void;
  projectTitle: string;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}) {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const closingRef = useRef(false);
  const activeMedia = media[selectedIndex];
  const hasMany = media.length > 1;

  const next = () => setSelectedIndex((selectedIndex + 1) % media.length);
  const previous = () => setSelectedIndex((selectedIndex - 1 + media.length) % media.length);
  const closeWithAnimation = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const root = viewerRef.current;
    if (!root) {
      onClose();
      return;
    }
    gsap.to(root.querySelector(".memory-viewer-window"), { opacity: 0, y: 18, scale: 0.97, duration: 0.2, ease: "power2.in" });
    gsap.to(root.querySelector(".memory-viewer-backdrop"), { opacity: 0, duration: 0.22, ease: "power2.in", onComplete: onClose });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".memory-viewer-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.24, ease: "power2.out" });
      gsap.fromTo(".memory-viewer-window", { opacity: 0, y: 24, scale: 0.96, rotate: -0.4 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(".memory-viewer-media", { opacity: 0, scale: 1.025 }, { opacity: 1, scale: 1, duration: 0.44, ease: "power2.out" });
    }, viewerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeWithAnimation();
      }
      if (event.key === "ArrowRight" && hasMany) {
        event.preventDefault();
        next();
      }
      if (event.key === "ArrowLeft" && hasMany) {
        event.preventDefault();
        previous();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [closeWithAnimation, hasMany, next, previous]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".memory-viewer-media", { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.28, ease: "power2.out" });
      gsap.fromTo(".memory-viewer-caption", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" });
    }, viewerRef);
    return () => ctx.revert();
  }, [selectedIndex]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    touchStartRef.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (touchStartRef.current === null || !hasMany) return;
    const distance = event.clientX - touchStartRef.current;
    touchStartRef.current = null;
    if (Math.abs(distance) < 44) return;
    if (distance < 0) next();
    else previous();
  }

  return (
    <div className="memory-viewer" ref={viewerRef}>
      <button className="memory-viewer-backdrop" onClick={closeWithAnimation} type="button" aria-label="Close media viewer" />
      <div className="memory-viewer-window" role="dialog" aria-modal="true" aria-label={`${projectTitle} media viewer`}>
        <div className="memory-viewer-top">
          <div>
            <p className="pixel-label">Memory Archive</p>
            <h4>{projectTitle}</h4>
          </div>
          <button className="pixel-icon-button" onClick={closeWithAnimation} type="button" aria-label="Close media viewer">
            <X size={18} />
          </button>
        </div>
        <div className="memory-viewer-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          {hasMany ? <button className="memory-viewer-arrow previous" onClick={previous} type="button" aria-label="Previous media"><ChevronLeft size={22} /></button> : null}
          <RenderProjectMedia media={activeMedia} mode="viewer" />
          {hasMany ? <button className="memory-viewer-arrow next" onClick={next} type="button" aria-label="Next media"><ChevronRight size={22} /></button> : null}
        </div>
        <div className="memory-viewer-caption">
          <span>{selectedIndex + 1}/{media.length}</span>
          <p>{activeMedia.caption ?? activeMedia.alt}</p>
          {activeMedia.type !== "video" ? <small><ZoomIn size={13} /> Open image in a new tab to inspect full size.</small> : null}
        </div>
      </div>
    </div>
  );
}

function RenderProjectMedia({ media, mode }: { media: ProjectMedia; mode: "preview" | "thumb" | "viewer" }) {
  const className = mode === "viewer" ? "memory-viewer-media" : mode === "thumb" ? "memory-thumb-media" : "memory-preview-media";

  if (media.type === "video") {
    if (mode === "thumb") {
      return media.thumbnail ? <img alt="" loading="lazy" src={media.thumbnail} /> : <Film size={16} />;
    }

    return (
      <video
        autoPlay={mode === "preview"}
        className={className}
        controls={mode === "viewer"}
        loop
        muted={mode !== "viewer"}
        poster={media.thumbnail}
        playsInline
        preload={mode === "viewer" ? "metadata" : "none"}
        src={media.src}
      />
    );
  }

  return <img alt={media.alt} className={className} loading={mode === "viewer" ? "eager" : "lazy"} src={media.thumbnail ?? media.src} />;
}

function LeadershipAndHonors() {
  return <HonorsGallery />;
}

function Education() {
  return (
    <div className="dialogue-copy">
      <p className="soft-role">{education.degree}</p>
      <p>{education.summary}</p>
      <div className="two-column">
        <div className="paper-card">
          <b>University</b>
          <p>{education.university}</p>
          <p>{education.location}</p>
        </div>
        <div className="paper-card">
          <b>Degree Period</b>
          <p>{education.period}</p>
        </div>
      </div>
      <div className="paper-card">
        <b>Relevant Coursework</b>
        <p>{education.coursework.join(" | ")}</p>
      </div>
      <div className="paper-card">
        <b>Academic Highlights</b>
        <p>{education.highlights.join(" | ")}</p>
      </div>
    </div>
  );
}

function ExperienceTimeline() {
  return (
    <div className="timeline-path">
      {experience.map((item) => (
        <article key={`${item.period}-${item.title}`}>
          <span>{item.period}</span>
          <b>{item.title}</b>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

function Resume() {
  const [resumePreviewUrl, setResumePreviewUrl] = useState(config.resumeFallbackUrl);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadResumePreview() {
      try {
        const response = await fetch(config.resumeFallbackUrl);
        if (!response.ok) throw new Error("Resume preview failed.");
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setResumePreviewUrl(objectUrl);
      } catch {
        if (!cancelled) setResumePreviewUrl(config.resumeFallbackUrl);
      }
    }

    void loadResumePreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <div className="dialogue-copy resume-viewer">
      <div className="resume-actions">
        <p>View the full resume here, or download a copy without leaving the room.</p>
        <button className="download-button" onClick={downloadResume} type="button">
          <FileDown size={16} /> Download Resume
        </button>
      </div>
      <embed className="resume-frame" src={resumePreviewUrl} title="Ayaan Khan resume" type="application/pdf" />
    </div>
  );
}

function Contact() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const links = [
    { label: "GitHub", href: config.githubUrl, icon: Github },
    { label: "LinkedIn", href: config.linkedinUrl, icon: Linkedin },
  ];

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
    <div className="dialogue-copy">
      <p>Choose a signal.</p>
      <div className="email-copy-card">
        <span>Email</span>
        <button onClick={copyEmail} type="button">{config.emailAddress}</button>
        {copyStatus === "copied" ? <small>copied.</small> : null}
        {copyStatus === "failed" ? <small>copy unavailable; use Mail.</small> : null}
      </div>
      <div className="contact-links">
        {links.map(({ label, href, icon: Icon }) => (
          <a href={href} key={label} rel="noreferrer" target="_blank">
            <Icon size={18} />
            {label}
          </a>
        ))}
        <a href={`mailto:${config.emailAddress}`}>
          <Mail size={18} />
          Mail
        </a>
      </div>
    </div>
  );
}

function Fluff() {
  return (
    <div className="dialogue-copy">
      <img
        alt="Fluff"
        src="/assets/fluff.jpeg"
        style={{
          display: "block",
          height: "auto",
          margin: "0 auto",
          maxHeight: "min(68vh, 640px)",
          maxWidth: "100%",
          objectFit: "contain",
          width: "auto",
        }}
      />
    </div>
  );
}
