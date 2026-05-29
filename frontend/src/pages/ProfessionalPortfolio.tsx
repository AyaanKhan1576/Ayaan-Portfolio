import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Code2,
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
  Plus,
  Minus,
  X,
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
import type { MediaItem } from "../types";

export type PortfolioRoute = "/" | "/professional" | "/projects" | "/room";
export type ProjectFilter = "All" | "AI/ML" | "Computer Vision" | "RAG" | "AI Agents" | "Backend" | "DevOps" | "Data Science";

export const projectFilters: ProjectFilter[] = ["All", "AI/ML", "Computer Vision", "RAG", "AI Agents", "Backend", "DevOps", "Data Science"];

const featuredIds = ["pose2play", "financial-sentiment-rag", "event-booking-microservices", "synthetic-music-detector"];
const previewIds = ["pose2play", "financial-sentiment-rag", "event-booking-microservices", "synthetic-music-detector"];

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

const projectFilterExclusions: Partial<Record<ProjectFilter, string[]>> = {
  "AI/ML": ["hotel-booking-microservices"],
  "Computer Vision": ["real-time-crime-analytics", "nyc-taxi-kafka", "multimodal-pdf-rag"],
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

const sectionIds: string[] = sectionOrder.map(([id]) => id);

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

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const updateMobileExperienceLine = () => {
      const editorial = scope.querySelector<HTMLElement>(".experience-editorial");
      if (!editorial) return;

      if (!window.matchMedia("(max-width: 620px)").matches) {
        editorial.style.removeProperty("--experience-line-top");
        editorial.style.removeProperty("--experience-line-bottom");
        return;
      }

      const stations = Array.from(editorial.querySelectorAll<HTMLElement>(".experience-station"));
      const firstCard = stations[0]?.querySelector<HTMLElement>(".station-card");
      const lastCard = stations[stations.length - 1]?.querySelector<HTMLElement>(".station-card");
      if (!firstCard || !lastCard) return;

      const containerRect = editorial.getBoundingClientRect();
      const firstRect = firstCard.getBoundingClientRect();
      const lastRect = lastCard.getBoundingClientRect();

      editorial.style.setProperty("--experience-line-top", `${Math.max(0, firstRect.top - containerRect.top)}px`);
      editorial.style.setProperty("--experience-line-bottom", `${Math.max(0, containerRect.bottom - lastRect.bottom)}px`);
    };

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
      });

      gsap.fromTo(
        ".scene-about .scene-copy-grid p",
        { autoAlpha: 0, y: 26, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.78,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".scene-about", start: "top 68%" },
        },
      );

      gsap.fromTo(
        ".scene-contact .social-contact-row > *",
        { autoAlpha: 0, x: -20 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.48,
          stagger: 0.08,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".scene-contact", start: "top 70%" },
        },
      );

      gsap.fromTo(
        ".scene-resume .resume-preview-frame",
        { autoAlpha: 0, rotateX: -14, y: 34 },
        {
          autoAlpha: 1,
          rotateX: 0,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".scene-resume", start: "top 70%" },
        },
      );

      gsap.fromTo(
        ".featured-editorial-card",
        { autoAlpha: 0, y: 54, rotateX: 8 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: { trigger: ".scene-featured", start: "top 70%" },
        },
      );

      gsap.fromTo(
        ".skills-editorial article",
        { autoAlpha: 0, scale: 0.92, y: 18 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.58,
          stagger: { amount: 0.5, from: "center" },
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: ".scene-skills", start: "top 70%" },
        },
      );

      gsap.fromTo(
        ".scene-projects-preview .preview-product",
        { autoAlpha: 0, x: 40 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: ".scene-projects-preview", start: "top 72%" },
        },
      );

      gsap.fromTo(
        ".honors-editorial article",
        { autoAlpha: 0, y: 36, rotation: -1.5 },
        {
          autoAlpha: 1,
          y: 0,
          rotation: 0,
          duration: 0.72,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: ".scene-honors", start: "top 72%" },
        },
      );

      gsap.to(".campaign-media", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: ".campaign-hero", start: "top top", end: "bottom top", scrub: 0.75 },
      });

      gsap.to(".hero-orbit", {
        rotate: 360,
        duration: 38,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".hero-orbit-item", {
        rotate: -360,
        duration: 38,
        repeat: -1,
        ease: "none",
      });

      gsap.fromTo(
        ".education-entry",
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".scene-education", start: "top 72%" },
        },
      );

      gsap.fromTo(
        ".experience-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".experience-editorial", start: "top 76%", end: "bottom 46%", scrub: 0.8 },
        },
      );

      updateMobileExperienceLine();
      window.addEventListener("resize", updateMobileExperienceLine);

      gsap.utils.toArray<HTMLElement>(".experience-station").forEach((station, index) => {
        const card = station.querySelector(".station-card");
        const node = station.querySelector(".station-node");
        const date = station.querySelector(".station-date");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: station,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });
        tl.fromTo(node, { autoAlpha: 0, scale: 0.72 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" })
          .fromTo(date, { autoAlpha: 0, x: index % 2 === 0 ? -18 : 18 }, { autoAlpha: 1, x: 0, duration: 0.46, ease: "power2.out" }, "-=0.26")
          .fromTo(card, { autoAlpha: 0, y: 28, rotateX: 6 }, { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.68, ease: "power3.out" }, "-=0.28")
          .fromTo(station.querySelectorAll(".station-impact li"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.05, ease: "power2.out" }, "-=0.2");
      });

      if (window.matchMedia("(max-width: 640px)").matches) {
        const mobileCards = gsap.utils.toArray<HTMLElement>(".mobile-experience-card");
        const progressLine = scope.querySelector<HTMLElement>(".mobile-experience-progress span");

        if (progressLine) {
          gsap.fromTo(
            progressLine,
            { scaleY: 0, transformOrigin: "top center" },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".mobile-experience-story",
                start: "top 72%",
                end: "bottom 38%",
                scrub: 0.6,
              },
            },
          );
        }

        mobileCards.forEach((card) => {
          const chapter = card.querySelector(".mobile-experience-chapter");
          const body = card.querySelector(".mobile-experience-body");
          const tags = card.querySelectorAll(".mobile-experience-tags span");
          const detailTargets = [body, ...Array.from(tags)].filter(Boolean);

          gsap.set(card, { autoAlpha: 0, y: 34, scale: 0.96 });
          gsap.set(detailTargets, { autoAlpha: 0, y: 12 });

          const mobileTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              end: "bottom 48%",
              toggleActions: "play none none reverse",
              onEnter: () => card.classList.add("is-active"),
              onEnterBack: () => card.classList.add("is-active"),
              onLeave: () => card.classList.remove("is-active"),
              onLeaveBack: () => card.classList.remove("is-active"),
            },
          });

          mobileTl
            .to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.64, ease: "power3.out" })
            .fromTo(chapter, { letterSpacing: "0.16em", autoAlpha: 0 }, { letterSpacing: "0.08em", autoAlpha: 1, duration: 0.36, ease: "power2.out" }, "-=0.36")
            .to(body, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" }, "-=0.2")
            .to(tags, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.045, ease: "power2.out" }, "-=0.16");

          gsap.to(card, {
            "--mobile-card-energy": 1,
            scrollTrigger: {
              trigger: card,
              start: "top 58%",
              end: "bottom 42%",
              scrub: 0.5,
            },
          });
        });
      }

      gsap.to(".editorial-atmosphere", {
        "--atmosphere-drift": 1,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".professional-ambient .ambient-orb", {
        x: (index) => (index % 2 === 0 ? 34 : -28),
        y: (index) => (index % 2 === 0 ? -42 : 36),
        scale: (index) => (index % 2 === 0 ? 1.08 : 0.94),
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.8,
      });

      gsap.utils.toArray<HTMLElement>(".section-atmosphere").forEach((atmosphere, index) => {
        const scene = atmosphere.closest(".editorial-scene");
        const isExperience = atmosphere.classList.contains("atmosphere-experience");
        gsap.to(atmosphere.querySelector(".atm-grid"), {
          xPercent: index % 2 === 0 ? 5 : -5,
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
        gsap.to(atmosphere.querySelector(".atm-line"), {
          [isExperience ? "scaleY" : "scaleX"]: 1,
          transformOrigin: isExperience ? "top center" : index % 2 === 0 ? "left center" : "right center",
          ease: "none",
          scrollTrigger: { trigger: scene, start: "top 76%", end: "bottom 42%", scrub: 0.9 },
        });
        gsap.to(atmosphere.querySelectorAll(".atm-drift, .atm-pulse"), {
          x: (dotIndex) => (dotIndex % 2 === 0 ? 22 : -18),
          y: (dotIndex) => (dotIndex % 2 === 0 ? -18 : 24),
          opacity: (dotIndex) => (dotIndex % 2 === 0 ? 0.64 : 0.38),
          duration: 5 + index * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.24,
        });
      });

      if (window.matchMedia("(max-width: 768px)").matches) {
        gsap.fromTo(
          ".mobile-chapter-dock",
          { autoAlpha: 0, y: 22, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.62, delay: 0.2, ease: "power3.out" },
        );

        gsap.utils.toArray<HTMLElement>(".editorial-scene").forEach((scene) => {
          gsap.fromTo(
            scene.querySelector(".scene-detail"),
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.64,
              ease: "power3.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 66%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      }

      ScrollTrigger.create({
        start: 80,
        end: "max",
        onUpdate: (self) => {
          document.querySelector(".editorial-nav")?.classList.toggle("is-compact", self.scroll() > 120);
        },
      });
    }, scope);

    return () => {
      window.removeEventListener("resize", updateMobileExperienceLine);
      ctx.revert();
    };
  }, [scopeRef]);
}

export function displayText(value: string) {
  return value.replace("sÃ¯Paradigm", "sïParadigm").replace("sÃƒÂ¯Paradigm", "sïParadigm").replace("sÃƒÆ’Ã‚Â¯Paradigm", "sïParadigm");
}

export function projectMatches(project: Project, filter: ProjectFilter) {
  if (filter === "All") return true;
  if (projectFilterExclusions[filter]?.includes(project.id)) return false;
  const haystack = [...project.tags, ...project.technologies, project.title, project.short_description].join(" ").toLowerCase();
  return categoryMatchers[filter].some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function experienceImpact(item: { detail: string }, index: number) {
  const detail = displayText(item.detail);
  if (index === 0) return ["Structured Jira workflows, PRDs, UATs, and technical reports.", "Improved cross-team clarity across software and hardware requirements."];
  if (index === 1) return ["Automated preprocessing for 200+ GB of medical PDFs.", "Applied spaCy NER with 90%+ record linkage accuracy.", "Built QA tooling that reduced manual review by about 70%."];
  if (index === 2) return ["Built a multi-agent weather chatbot with Google ADK and Gemini.", "Added evaluation loops with OpenAI Evals and Pydantic AI."];
  if (index === 3) return ["Developed and debugged C/C++ modules for embedded Linux.", "Automated engineering workflows with Bash scripting."];
  return [detail];
}

function experienceMobileTags(index: number) {
  if (index === 0) return ["Jira", "PRDs", "UATs", "Project management"];
  if (index === 1) return ["Python", "PostgreSQL", "spaCy NER", "Pandas"];
  if (index === 2) return ["Google ADK", "Gemini API", "WeatherAPI", "OpenAI Evals"];
  return ["C/C++", "Embedded Linux", "Bash", "Automation"];
}

export function ProfessionalPortfolio({ onNavigate }: { onNavigate: (path: PortfolioRoute) => void }) {
  const pageRef = useRef<HTMLElement | null>(null);
  const lastSoundTargetRef = useRef<Element | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [activeSection, setActiveSection] = useState<string>("about");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => new Set());
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const sound = useProfessionalSound();
  const { theme, toggleTheme } = useProfessionalTheme();
  const featuredProjects = projects.filter((project) => featuredIds.includes(project.id));
  const previewProjects = projects.filter((project) => previewIds.includes(project.id));
  useScrollReveal();
  useProfessionalMotion(pageRef);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    let animationFrame = 0;

    const updateActiveSection = () => {
      animationFrame = 0;
      const marker = window.scrollY + window.innerHeight * 0.34;
      let currentId = sections[0].id;

      for (const section of sections) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) currentId = section.id;
      }

      setActiveSection((current) => (current === currentId ? current : currentId));
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  function scrollToSection(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    setActiveSection(id);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.scrollIntoView({ block: "start" });
      return;
    }
    gsap.to(window, {
      duration: 0.9,
      ease: "power3.inOut",
      scrollTo: { y: target, offsetY: 92 },
    });
  }

  function toggleSection(id: string) {
    setCollapsedSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function navigateFromSection(id: string, direction: -1 | 1) {
    const currentIndex = sectionIds.indexOf(id);
    const nextId = sectionIds[Math.min(sectionIds.length - 1, Math.max(0, currentIndex + direction))];
    if (nextId && nextId !== id) scrollToSection(nextId);
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!pageRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = pageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, window.innerHeight) - 0.5) * 2;
    pageRef.current.style.setProperty("--mx", x.toFixed(3));
    pageRef.current.style.setProperty("--my", y.toFixed(3));
    pageRef.current.style.setProperty("--spot-x", `${Math.round(((event.clientX - rect.left) / rect.width) * 100)}%`);
    pageRef.current.style.setProperty("--spot-y", `${Math.round((event.clientY / window.innerHeight) * 100)}%`);
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
      <ProfessionalAmbientLayer />
      <ProfessionalNav
        activeSection={activeSection}
        onNavigate={onNavigate}
        onScrollToSection={scrollToSection}
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
          <button className="pill-primary hero-room-entry" onClick={() => onNavigate("/room")} type="button"><Gamepad2 size={17} /> Enter Interactive Portfolio</button>
          <SocialContactRow copyEmail={copyEmail} copyStatus={copyStatus} />
        </div>
      </section>

      <StoryRail active={activeSection} scrollToSection={scrollToSection} />
      <MobileChapterDock active={activeSection} scrollToSection={scrollToSection} />

      <Scene collapsed={collapsedSections.has("about")} id="about" number="01" onNavigate={navigateFromSection} onToggleCollapse={toggleSection} title="About Me" kicker="The person behind the systems">
        <div className="scene-copy-grid">
          <p>I’m an AI & Software Engineer interested in building intelligent systems that are practical, scalable, and production ready.</p>
          <p>Currently pursuing a BS in Computer Science at FAST NUCES, Class of 2026, I’ve worked on LLMs, RAG pipelines, AI agents, fullstack applications, cloud infrastructure, and real-time ML systems.</p>
          <p>I primarily work with Python and modern AI frameworks, with a strong C/C++ foundation and experience across Docker, Kubernetes, CI/CD, data pipelines, and backend system design.</p>
        </div>
      </Scene>

      <Scene collapsed={collapsedSections.has("contact")} id="contact" number="02" onNavigate={navigateFromSection} onToggleCollapse={toggleSection} title="Contact" kicker="Direct professional signals">
        <SocialContactRow copyEmail={copyEmail} copyStatus={copyStatus} expanded />
      </Scene>

      <Scene collapsed={collapsedSections.has("resume")} id="resume" number="03" onNavigate={navigateFromSection} onToggleCollapse={toggleSection} title="Resume" kicker="The concise document layer">
        <div className="resume-editorial">
          <div className="resume-preview-frame" aria-label="Scrollable resume preview">
            <div className="resume-preview-paper">
              <b>Ayaan Khan</b>
              <span>AI & Software Engineer</span>
              <p>LLMs / RAG / Computer Vision / AI Agents / Backend Systems</p>
              <hr />
              <strong>Experience</strong>
              <p>Kodifly — Project Associate</p>
              <p>sïParadigm — Data Analyst Intern</p>
              <p>DreamAI Software — Agentic AI Intern</p>
              <p>Teresol — Software Development Intern</p>
              <strong>Education</strong>
              <p>FAST-NUCES — BS Computer Science</p>
              <strong>Selected Systems</strong>
              <p>Pose2Play, Financial Sentiment RAG, Event Booking Microservices</p>
            </div>
          </div>
          <div>
            <p>View or download resume from here.</p>
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

      <Scene collapsed={collapsedSections.has("education")} id="education" number="04" onNavigate={navigateFromSection} onToggleCollapse={toggleSection} title="Education" kicker="Computer science foundation">
        <div className="education-editorial">
          <article className="education-entry university-entry">
            <div className="education-mark"><GraduationCap size={22} /></div>
            <div>
              <span>University</span>
              <h3>{education.university}</h3>
              <p>{education.degree} / {education.location}</p>
              <b>{education.period}</b>
              <div className="academic-card-grid">
                <article><span>Standing</span><b>{education.highlights[0]}</b><p>Current academic progression in the BS Computer Science program.</p></article>
                <article><span>Recognition</span><b>{education.highlights[1]}</b><p>Academic recognition during the BS Computer Science program.</p></article>
                <article><span>Societies</span><b>Debating Society / FPDC</b><p>Secretary General Debating Society and Deputy Director General Internals, FAST Parliamentary Debating Championship.</p></article>
              </div>
              <div className="editorial-pills">{education.coursework.map((course) => <span key={course}>{course}</span>)}</div>
            </div>
          </article>
          <article className="education-entry">
            <div className="education-mark"><BookOpen size={21} /></div>
            <div>
              <span>A Levels</span>
              <h3>Beaconhouse Potohar Campus</h3>
              <b>3A* and 1A / SAT 1500</b>
              <div className="subject-list">
                <span>A*: Physics</span>
                <span>A*: Mathematics</span>
                <span>A*: Biology</span>
                <span>A: Chemistry</span>
                <span>SAT: 790 Math / 710 English</span>
              </div>
            </div>
          </article>
          <article className="education-entry">
            <div className="education-mark"><Award size={21} /></div>
            <div>
              <span>GCSE O Levels</span>
              <h3>Beaconhouse Potohar Campus</h3>
              <b>10A*s</b>
              <div className="subject-list">
                {["Mathematics", "Additional Mathematics", "Physics", "Chemistry", "Biology", "English", "Urdu", "Pakistan Studies", "Islamiat", "Global Perspectives"].map((subject) => <span key={subject}>{subject}</span>)}
              </div>
            </div>
          </article>
        </div>
      </Scene>

      <Scene collapsed={collapsedSections.has("experience")} id="experience" number="05" onNavigate={navigateFromSection} onToggleCollapse={toggleSection} title="Experience" kicker="Applied work in motion">
        <div className="experience-editorial">
          <div className="experience-story">
            <span>Progression</span>
            <p>From embedded systems and automation into agentic AI, data pipelines, and production coordination.</p>
          </div>
          <div className="experience-line" aria-hidden="true" />
          {experience.map((item, index) => {
            const [title, company] = displayText(item.title).split(" - ");
            const focus = index === 0 ? "Project management" : index === 1 ? "Data automation" : index === 2 ? "Agentic AI" : "Systems programming";
            const location = index === 0 ? "Islamabad" : index === 1 ? "Remote" : index === 2 ? "Remote" : "Islamabad";
            return (
              <article className={`experience-station ${index % 2 === 0 ? "station-left" : "station-right"}`} key={item.title} style={{ "--station": index } as CSSProperties}>
                <div className="station-date"><span>{item.period}</span></div>
                <div className="station-node"><BriefcaseBusiness size={16} /><span>{String(index + 1).padStart(2, "0")}</span></div>
                <div className="station-card">
                  <h3>{company ?? item.title}</h3>
                  <b>{title}</b>
                  <span>{location} / {item.period}</span>
                  <ul className="station-impact">
                    {experienceImpact(item, index).map((impact) => <li key={impact}>{impact}</li>)}
                  </ul>
                  <small>{focus}</small>
                </div>
              </article>
            );
          })}
          <div className="mobile-experience-story" aria-label="Mobile experience timeline">
            <div className="mobile-experience-progress" aria-hidden="true"><span /></div>
            {experience.map((item, index) => {
              const [title, company] = displayText(item.title).split(" - ");
              const focus = index === 0 ? "Project management" : index === 1 ? "Data automation" : index === 2 ? "Agentic AI" : "Systems programming";
              const location = index === 0 ? "Islamabad" : index === 1 ? "Remote" : index === 2 ? "Remote" : "Islamabad";
              return (
                <article className="mobile-experience-card" key={`mobile-${item.title}`} style={{ "--mobile-card-energy": 0 } as CSSProperties}>
                  <div className="mobile-experience-chapter">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <small>{item.period}</small>
                  </div>
                  <div className="mobile-experience-surface">
                    <div className="mobile-experience-heading">
                      <p>{focus}</p>
                      <h3>{title}</h3>
                      <b>{company ?? item.title}</b>
                      <span>{location}</span>
                    </div>
                    <div className="mobile-experience-body">
                      <ul>
                        {experienceImpact(item, index).map((impact) => <li key={impact}>{impact}</li>)}
                      </ul>
                      <div className="mobile-experience-tags">
                        {experienceMobileTags(index).map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Scene>

      <Scene collapsed={collapsedSections.has("featured")} id="featured" number="06" onNavigate={navigateFromSection} onToggleCollapse={toggleSection} title="Featured Projects" kicker="Three production-facing case studies">
        <div className="featured-editorial">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard index={index} key={project.id} onOpenPreview={() => setPreviewProject(project)} project={project} />
          ))}
        </div>
      </Scene>

      <Scene collapsed={collapsedSections.has("skills")} id="skills" number="07" onNavigate={navigateFromSection} onToggleCollapse={toggleSection} title="Skills" kicker="Grouped capabilities, no bars">
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

      <Scene collapsed={collapsedSections.has("projects-preview")} id="projects-preview" number="08" onNavigate={navigateFromSection} onToggleCollapse={toggleSection} title="All Projects Preview" kicker="A moving catalog before the archive">
        <div className="product-rail">
          {[...previewProjects, ...previewProjects].map((project, index) => (
            <PreviewProjectCard key={`${project.id}-${index}`} onOpenPreview={() => setPreviewProject(project)} project={project} />
          ))}
        </div>
        <button className="pill-primary" onClick={() => onNavigate("/projects")} type="button">View All Projects <ArrowRight size={17} /></button>
      </Scene>

      <Scene collapsed={collapsedSections.has("honors")} id="honors" number="09" onNavigate={navigateFromSection} onToggleCollapse={toggleSection} title="Leadership and Honors" kicker="Signals beyond repositories">
        <HonorsGallery />
      </Scene>
      <ProfessionalFooter copyEmail={copyEmail} copyStatus={copyStatus} onNavigate={onNavigate} scrollToSection={scrollToSection} />
      <ProjectPreviewOverlay onClose={() => setPreviewProject(null)} project={previewProject} />
    </main>
  );
}

function Scene({ children, collapsed, id, number, onNavigate, onToggleCollapse, title }: {
  children: ReactNode;
  collapsed: boolean;
  id: string;
  kicker?: string;
  number: string;
  onNavigate: (id: string, direction: -1 | 1) => void;
  onToggleCollapse: (id: string) => void;
  title: string;
}) {
  const currentIndex = sectionIds.indexOf(id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sectionIds.length - 1;

  return (
    <section className={`editorial-scene scene-${id} reveal open ${collapsed ? "collapsed" : ""}`} id={id}>
      <SectionAtmosphere id={id} />
      <div className="scene-trigger">
        <span>{number}</span>
        <div>
          <h2>{title}</h2>
        </div>
        <div className="scene-controls" aria-label={`${title} controls`}>
          <button disabled={!hasPrev} onClick={() => onNavigate(id, -1)} type="button" aria-label={`Previous section from ${title}`}><ArrowUp size={16} /></button>
          <button disabled={!hasNext} onClick={() => onNavigate(id, 1)} type="button" aria-label={`Next section from ${title}`}><ArrowDown size={16} /></button>
          <button className="collapse-toggle" onClick={() => onToggleCollapse(id)} type="button" aria-expanded={!collapsed} aria-label={`${collapsed ? "Expand" : "Collapse"} ${title}`}>
            {collapsed ? <Plus size={16} /> : <Minus size={16} />}
          </button>
        </div>
      </div>
      <div className="scene-detail">{children}</div>
    </section>
  );
}

function StoryRail({ active, scrollToSection }: { active: string; scrollToSection: (id: string) => void }) {
  return (
    <aside className="story-rail" aria-label="Professional portfolio scenes">
      {sectionOrder.map(([id, label], index) => (
        <button className={active === id ? "active" : ""} key={id} onClick={() => scrollToSection(id)} type="button">
          <span>{String(index + 1).padStart(2, "0")} /</span>
          <b>{label}</b>
        </button>
      ))}
    </aside>
  );
}

function MobileChapterDock({ active, scrollToSection }: { active: string; scrollToSection: (id: string) => void }) {
  return (
    <nav className="mobile-chapter-dock" aria-label="Mobile portfolio chapters">
      {sectionOrder.map(([id, label], index) => (
        <button className={active === id ? "active" : ""} key={id} onClick={() => scrollToSection(id)} type="button">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <b>{label}</b>
        </button>
      ))}
    </nav>
  );
}

function SectionAtmosphere({ id }: { id: string }) {
  return (
    <div className={`section-atmosphere atmosphere-${id}`} aria-hidden="true">
      <span className="atm-grid" />
      <span className="atm-line" />
      <span className="atm-drift" />
      <span className="atm-pulse" />
    </div>
  );
}

function ProfessionalAmbientLayer() {
  return (
    <div className="professional-ambient" aria-hidden="true">
      <span className="ambient-orb orb-a" />
      <span className="ambient-orb orb-b" />
      <span className="ambient-orb orb-c" />
    </div>
  );
}

export function ProfessionalNav({ activeSection, onNavigate, onScrollToSection, onToggleSound, onToggleTheme, soundEnabled, theme = "light" }: {
  onNavigate: (path: PortfolioRoute) => void;
  activeSection?: string;
  onScrollToSection?: (id: string) => void;
  onToggleSound?: () => void;
  onToggleTheme?: () => void;
  soundEnabled?: boolean;
  theme?: ProfessionalTheme;
}) {
  const storyActive = Boolean(activeSection && activeSection !== "projects");
  const projectsActive = activeSection === "projects";
  return (
    <header className="pro-nav editorial-nav" aria-label="Professional portfolio navigation">
      <button className="pro-brand" onClick={() => onNavigate("/")} type="button"><span>AK</span>Ayaan Khan</button>
      <nav className="pro-nav-links" aria-label="Sections">
        <button className={storyActive ? "active" : ""} onClick={() => onScrollToSection ? onScrollToSection("about") : onNavigate("/professional")} type="button"><span>01 /</span><b>Story</b></button>
        <button className={projectsActive ? "active" : ""} onClick={() => onNavigate("/projects")} type="button"><span>02 /</span><b>Projects</b></button>
        <button onClick={() => onNavigate("/room")} type="button"><span>03 /</span><b>Interactive Portfolio</b></button>
      </nav>
      <div className="pro-nav-actions">
        <button className="mobile-header-link" onClick={() => onNavigate("/professional")} type="button">Home</button>
        <button className="mobile-header-link" onClick={() => onNavigate("/projects")} type="button">Projects</button>
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

export function ProfessionalFooter({
  copyEmail,
  copyStatus,
  onNavigate,
  scrollToSection,
}: {
  copyEmail: () => void;
  copyStatus: "idle" | "copied" | "failed";
  onNavigate: (path: PortfolioRoute) => void;
  scrollToSection?: (id: string) => void;
}) {
  function goToSection(id: string) {
    if (scrollToSection) scrollToSection(id);
    else onNavigate("/professional");
  }

  return (
    <footer className="professional-footer">
      <div className="footer-identity">
        <h2>Ayaan Khan</h2>
        <span>AI & Software Engineer building production-ready intelligent systems.</span>
      </div>
      <div className="footer-links">
        {sectionOrder.slice(0, 5).map(([id, label]) => (
          <button key={id} onClick={() => goToSection(id)} type="button">{label}</button>
        ))}
        <button onClick={() => onNavigate("/projects")} type="button">Projects</button>
        <button onClick={() => onNavigate("/room")} type="button">Interactive Portfolio</button>
      </div>
      <div className="footer-contact">
        <SocialContactRow copyEmail={copyEmail} copyStatus={copyStatus} />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Ayaan Khan</span>
        <span>React / GSAP / Anime.js</span>
      </div>
    </footer>
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
  const orbitLabels = ["LLMs", "RAG", "Agents", "Vision", "APIs", "Cloud"];
  return (
    <div className="editorial-system" aria-label="Production AI system visual">
      <svg viewBox="0 0 620 620" role="img" aria-label="Connected AI architecture">
        <path d="M310 90 C440 110 520 210 510 330 C500 468 386 542 260 520 C130 496 74 382 104 252 C130 146 210 92 310 90Z" />
        <path d="M130 310 C220 180 390 170 500 310" />
        <path d="M165 430 C290 300 390 310 474 432" />
        <circle className="data-pulse pulse-a" r="5" />
        <circle className="data-pulse pulse-b" r="4" />
      </svg>
      <div className="hero-orbit" aria-hidden="true">
        {orbitLabels.map((label, index) => <span className="hero-orbit-item" key={label} style={{ "--orbit-index": index } as CSSProperties}>{label}</span>)}
      </div>
      <div className="system-core"><Network size={22} /><b>Production AI</b><span>models + APIs + infrastructure</span></div>
    </div>
  );
}

export function FeaturedProjectCard({
  index,
  onOpenPreview,
  project,
}: {
  index: number;
  onOpenPreview: () => void;
  project: Project;
}) {
  const isDevOpsCaseStudy = project.id === "event-booking-microservices";
  const description = isDevOpsCaseStudy
    ? "DevOps-focused AWS event platform covering service containerization, cloud deployment, Kubernetes delivery, GitOps automation, infrastructure provisioning, and observability."
    : project.short_description;
  const technologies = isDevOpsCaseStudy
    ? ["AWS", "Docker", "Kubernetes", "Terraform", "Argo CD", "GitHub Actions"]
    : project.technologies.slice(0, 6);

  return (
    <article className="featured-editorial-card" style={{ "--stagger": `${index * 80}ms` } as CSSProperties}>
      <ProjectVisual onOpenPreview={onOpenPreview} project={project} />
      <span>{project.tags.slice(0, 2).join(" / ")}</span>
      <h3>{project.title}</h3>
      <p>{description}</p>
      <b>{project.role}</b>
      <div className="editorial-pills">{technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
      <ProjectLinks project={project} />
    </article>
  );
}

function PreviewProjectCard({ onOpenPreview, project }: { onOpenPreview: () => void; project: Project }) {
  return (
    <article className="preview-product">
      <ProjectVisual onOpenPreview={onOpenPreview} project={project} />
      <h3>{project.title}</h3>
      <p>{project.tags.slice(0, 3).join(" / ")}</p>
    </article>
  );
}

export function ProjectVisual({ onOpenPreview, project }: { onOpenPreview?: () => void; project: Project }) {
  const techPreview = project.id === "event-booking-microservices"
    ? ["AWS", "Kubernetes", "Docker", "GitOps"]
    : project.technologies.slice(0, 3);
  const mediaSrc = project.demo_video_url || project.screenshots[0];
  const isVideo = Boolean(project.demo_video_url);
  return (
    <div className="project-visual editorial-photo">
      {mediaSrc ? (
        <button className="project-visual-media-link" onClick={onOpenPreview} type="button" aria-label={`Open ${project.title} preview`}>
          {isVideo ? (
            <video autoPlay className="project-visual-media" loop muted playsInline preload="metadata" src={mediaSrc} />
          ) : (
            <img alt="" className="project-visual-media" loading="lazy" src={mediaSrc} />
          )}
        </button>
      ) : (
        <div className="project-visual-placeholder" aria-hidden="true">
          <b>{project.title}</b>
        </div>
      )}
      <div className="project-visual-footer">
        {mediaSrc ? (
          <button className="visual-playback" onClick={onOpenPreview} type="button">
            <Play size={14} />
            <span>open preview</span>
          </button>
        ) : null}
        <span>{techPreview.join(" / ")}</span>
      </div>
    </div>
  );
}

export function ProjectPreviewOverlay({ onClose, project }: { onClose: () => void; project: Project | null }) {
  if (!project) return null;

  const mediaSrc = project.demo_video_url || project.screenshots[0];
  const isVideo = Boolean(project.demo_video_url);

  return (
    <div className="project-preview-overlay rpg-overlay" onClick={onClose} role="presentation">
      <div className="project-preview-window rpg-window" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${project.title} preview`}>
        <div className="rpg-window-header">
          <div>
            <p className="pixel-label">Project preview</p>
            <h2>{project.title}</h2>
          </div>
          <button className="pixel-icon-button" onClick={onClose} type="button" aria-label="Close preview">
            <X size={18} />
          </button>
        </div>
        <div className="rpg-window-body project-preview-body">
          {mediaSrc ? (
            isVideo ? (
              <video autoPlay controls className="project-preview-media" loop muted playsInline preload="metadata" src={mediaSrc} />
            ) : (
              <img alt={project.title} className="project-preview-media" src={mediaSrc} />
            )
          ) : (
            <div className="project-preview-placeholder">
              <b>{project.title}</b>
            </div>
          )}
          <p>{project.short_description}</p>
          <p><b>Role:</b> {project.role}</p>
          <div className="tag-row">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
          <ProjectLinks project={project} />
        </div>
      </div>
    </div>
  );
}

type HonorPreview = {
  description: string;
  src: string;
  title: string;
};

export function HonorsGallery() {
  const [preview, setPreview] = useState<HonorPreview | null>(null);

  return (
    <>
      <div className="honors-editorial">
        {mediaItems.map((item) => (
          <HonorCard key={item.id} item={item} onPreview={setPreview} />
        ))}
      </div>
      <MediaPreviewOverlay onClose={() => setPreview(null)} preview={preview} />
    </>
  );
}

function HonorCard({ item, onPreview }: { item: MediaItem; onPreview: (preview: HonorPreview) => void }) {
  const mediaSources = item.gallery?.length ? item.gallery : item.url ? [item.url] : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (mediaSources.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % mediaSources.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [mediaSources.length]);

  useEffect(() => {
    if (activeIndex >= mediaSources.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, mediaSources.length]);

  const activeMedia = mediaSources[activeIndex];

  const goToPrevious = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!mediaSources.length) return;
    setActiveIndex((currentIndex) => (currentIndex - 1 + mediaSources.length) % mediaSources.length);
  };

  const goToNext = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!mediaSources.length) return;
    setActiveIndex((currentIndex) => (currentIndex + 1) % mediaSources.length);
  };

  return (
    <article className="honor-card">
      {activeMedia ? (
        <div className={`honor-media-frame ${mediaSources.length > 1 ? "honor-media-carousel" : ""}`}>
          <button className="honor-media-button" onClick={() => onPreview({ description: item.description, src: activeMedia, title: item.title })} type="button">
            <img alt={item.title} className="honor-media" loading="lazy" src={activeMedia} />
          </button>
          {mediaSources.length > 1 ? (
            <>
              <button className="honor-carousel-control honor-carousel-control-prev" onClick={goToPrevious} type="button" aria-label={`Previous image for ${item.title}`}>
                <ArrowLeft size={18} />
              </button>
              <button className="honor-carousel-control honor-carousel-control-next" onClick={goToNext} type="button" aria-label={`Next image for ${item.title}`}>
                <ArrowRight size={18} />
              </button>
              <span className="honor-carousel-badge">{activeIndex + 1}/{mediaSources.length}</span>
            </>
          ) : null}
        </div>
      ) : (
        <div className="honor-media-frame honor-media-empty">
          <Award size={24} />
          <b>{item.title}</b>
        </div>
      )}
      <div className="honor-copy">
        <span>{item.type}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

function MediaPreviewOverlay({ onClose, preview }: { onClose: () => void; preview: HonorPreview | null }) {
  if (!preview) return null;

  return (
    <div className="project-preview-overlay rpg-overlay" onClick={onClose} role="presentation">
      <div className="project-preview-window rpg-window" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${preview.title} preview`}>
        <div className="rpg-window-header">
          <div>
            <p className="pixel-label">Honor preview</p>
            <h2>{preview.title}</h2>
          </div>
          <button className="pixel-icon-button" onClick={onClose} type="button" aria-label="Close preview">
            <X size={18} />
          </button>
        </div>
        <div className="rpg-window-body project-preview-body">
          <img alt={preview.title} className="project-preview-media honor-preview-media" src={preview.src} />
          <p>{preview.description}</p>
        </div>
      </div>
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
