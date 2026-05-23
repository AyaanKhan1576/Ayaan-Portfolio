import { ExternalLink, FileDown, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { education } from "../data/education";
import { experience } from "../data/experience";
import { mediaItems } from "../data/media";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { downloadResume, submitContact } from "../services/api";
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
      <p>
        You wake up in a quiet little room. Each object keeps a piece of Ayaan Khan's professional story.
      </p>
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
      <h3>About Me</h3>
      <p className="soft-role">AI & Software Engineer</p>
      <p>
        I build applied AI systems, backend platforms, simulation prototypes, and performance-minded software. I like
        projects that feel understandable from the outside and resilient on the inside.
      </p>
      <div className="two-column">
        <div className="paper-card">
          <b>Education</b>
          <p>Computer science and software engineering coursework with applied systems projects.</p>
        </div>
        <div className="paper-card">
          <b>Interests</b>
          <p>AI agents, computer vision, backend architecture, simulation, and graphics/performance work.</p>
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
      <h3>Education</h3>
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
        <p>{education.coursework.join(" • ")}</p>
      </div>
      <div className="paper-card">
        <b>Academic Highlights</b>
        <p>{education.highlights.join(" • ")}</p>
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
    <div className="dialogue-copy">
      <p>The folder is neatly labelled. Opening it asks the backend to log the download and redirect to the configured resume URL.</p>
      <button className="download-button" onClick={downloadResume} type="button">
        <FileDown size={16} /> Download Resume
      </button>
    </div>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "offline">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const ok = await submitContact({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
    });
    setStatus(ok ? "sent" : "offline");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required type="email" />
      <input name="subject" placeholder="Subject" required />
      <textarea name="message" placeholder="Message" required />
      <button disabled={status === "sending"} type="submit">
        <Send size={15} /> {status === "sending" ? "Sending..." : "Send letter"}
      </button>
      {status === "sent" ? <p className="success">Letter stored.</p> : null}
      {status === "offline" ? <p className="warning">The mailbox could not reach the backend. Try again later.</p> : null}
    </form>
  );
}
