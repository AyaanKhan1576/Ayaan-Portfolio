import { ExternalLink, FileDown, Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { config } from "../config";
import { education } from "../data/education";
import { experience } from "../data/experience";
import { mediaItems } from "../data/media";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { downloadResume } from "../services/api";
import { trackEvent } from "../services/analytics";
import type { Project, SectionId } from "../types";

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
      <p className="soft-role">AI & Software Engineer</p>
      <p>
        I build applied AI systems, backend platforms, data pipelines, and cloud-deployed software. My recent work spans
        agentic AI, computer vision rehabilitation, financial NLP, microservices, and medical document automation.
      </p>
      <div className="two-column">
        <div className="paper-card">
          <b>Education</b>
          <p>BS Computer Science at FAST-NUCES Islamabad, expected June 2026.</p>
        </div>
        <div className="paper-card">
          <b>Interests</b>
          <p>Agentic AI, NLP/RAG, computer vision, backend architecture, cloud deployment, and data engineering.</p>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className="stats-list">
      {skills.map((skill) => (
        <div className="stat-row" key={skill.name}>
          <div>
            <b>{skill.name}</b>
            <p>{skill.note}</p>
          </div>
          <div className="stat-meter" aria-label={`${skill.name} ${skill.value}`}>
            <span style={{ width: `${skill.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Projects({ onlyFeatured = false }: { onlyFeatured?: boolean }) {
  const shown = onlyFeatured ? projects.filter((project) => project.featured).slice(0, 3) : projects;
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <div className="dialogue-copy">
        <button className="back-link" onClick={() => setSelected(null)} type="button">Back to memories</button>
        <h3>{selected.title}</h3>
        <p>{selected.long_description}</p>
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
        <button
          className="quest-card"
          key={project.id}
          onClick={() => {
            setSelected(project);
            void trackEvent({ eventType: "project_view", metadata: { projectId: project.id } });
          }}
          type="button"
        >
          <span>{project.status}</span>
          <b>{project.title}</b>
          <p>{project.short_description}</p>
        </button>
      ))}
    </div>
  );
}

function LeadershipAndHonors() {
  return (
    <div className="quest-grid">
      {mediaItems.map((item) => (
        <article className="quest-card static" key={item.id}>
          <span>{item.type}</span>
          <b>{item.title}</b>
          <p>{item.description}</p>
          {item.type === "video" && item.url ? (
            <iframe className="media-frame" src={item.url} title={item.title} />
          ) : item.url ? (
            <a href={item.url} rel="noreferrer" target="_blank">Open media <ExternalLink size={14} /></a>
          ) : (
            <small>Media URL can be added later.</small>
          )}
        </article>
      ))}
    </div>
  );
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
        </div>
        <div className="paper-card">
          <b>Expected Graduation</b>
          <p>{education.expectedGraduation}</p>
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
  return (
    <div className="dialogue-copy resume-viewer">
      <div className="resume-actions">
        <p>View the full resume here, or download a copy without leaving the room.</p>
        <button className="download-button" onClick={downloadResume} type="button">
          <FileDown size={16} /> Download Resume
        </button>
      </div>
      <embed className="resume-frame" src={config.resumeFallbackUrl} title="Ayaan Khan resume" type="application/pdf" />
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
