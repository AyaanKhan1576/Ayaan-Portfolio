import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { config } from "../config";
import { projects } from "../data/projects";
import { useProfessionalTheme } from "../hooks/useProfessionalTheme";
import type { Project } from "../types";
import {
  AtmosphericDust,
  PortfolioRoute,
  ProfessionalFooter,
  ProfessionalNav,
  ProjectFilter,
  ProjectLinks,
  ProjectVisual,
  SectionHeader,
  projectFilters,
  projectMatches,
  useScrollReveal,
} from "./ProfessionalPortfolio";

export function ProjectsPage({ onNavigate }: { onNavigate: (path: PortfolioRoute) => void }) {
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("All");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const { theme, toggleTheme } = useProfessionalTheme();
  const filteredProjects = useMemo(
    () => projects.filter((project) => projectMatches(project, projectFilter)),
    [projectFilter],
  );
  useScrollReveal();

  async function copyEmail() {
    try {
      await navigator.clipboard?.writeText(config.emailAddress);
    } catch {
      // Embedded browsers may block clipboard writes; the visible affordance remains best effort.
    }
    setCopyStatus("copied");
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <main className="pro-page projects-page" data-theme={theme}>
      <AtmosphericDust />
      <ProfessionalNav activeSection="projects" onNavigate={onNavigate} onToggleTheme={toggleTheme} theme={theme} />

      <section className="projects-hero">
        <button className="archive-back" onClick={() => onNavigate("/professional")} type="button">
          <ArrowLeft size={16} />
          Back to professional home
        </button>
        <div className="projects-hero-grid">
          <div className="reveal is-visible">
            <p className="pro-eyebrow">Project archive</p>
            <h1>Explore the systems behind the portfolio.</h1>
            <p>
              A technical archive across AI/ML, computer vision, RAG, agentic workflows, backend engineering, DevOps,
              data science, and systems coursework.
            </p>
          </div>
          <div className="archive-console pro-panel reveal is-visible" aria-hidden="true">
            <span>archive.query</span>
            <b>{filteredProjects.length} projects visible</b>
            <small>{projectFilter === "All" ? "all domains" : projectFilter}</small>
          </div>
        </div>
      </section>

      <section className="pro-section archive-section">
        <SectionHeader
          eyebrow="Filter"
          title="Find projects by engineering surface."
          summary="Cards expand in place so the archive stays scannable without hiding implementation detail."
        />
        <div className="filter-row cinematic-filter" aria-label="Project filters">
          {projectFilters.map((filter) => (
            <button
              className={projectFilter === filter ? "selected" : ""}
              key={filter}
              onClick={() => {
                setProjectFilter(filter);
                setExpandedProject(null);
              }}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="archive-grid">
          {filteredProjects.map((project, index) => (
            <ArchiveProjectCard
              expanded={expandedProject === project.id}
              index={index}
              key={project.id}
              onToggle={() => setExpandedProject((current) => (current === project.id ? null : project.id))}
              project={project}
            />
          ))}
        </div>
      </section>
      <ProfessionalFooter copyEmail={copyEmail} copyStatus={copyStatus} onNavigate={onNavigate} />
    </main>
  );
}

function ArchiveProjectCard({
  expanded,
  index,
  onToggle,
  project,
}: {
  expanded: boolean;
  index: number;
  onToggle: () => void;
  project: Project;
}) {
  return (
    <article className={`archive-card reveal ${expanded ? "expanded" : ""}`} style={{ "--stagger": `${Math.min(index, 12) * 45}ms` } as CSSProperties}>
      <ProjectVisual project={project} />
      <div className="archive-card-main">
        <div className="featured-meta">
          <span>{project.status}</span>
          <span>{project.tags.slice(0, 3).join(" / ")}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.short_description}</p>
      </div>
      <div className="pro-tag-row">
        {project.tags.slice(0, 5).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <button className="archive-expand" onClick={onToggle} type="button" aria-expanded={expanded}>
        {expanded ? "Collapse details" : "Expand details"}
        <ChevronDown size={16} />
      </button>
      <div className="archive-details">
        <p>{project.long_description}</p>
        <p><b>Role:</b> {project.role}</p>
        <div className="pro-tag-row">
          {project.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}
