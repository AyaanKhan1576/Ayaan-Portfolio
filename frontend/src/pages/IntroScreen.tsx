import type { CSSProperties, PointerEvent } from "react";
import { useRef, useState } from "react";
import { ArrowRight, BriefcaseBusiness, DoorOpen } from "lucide-react";

type PortfolioRoute = "/" | "/professional" | "/room";
type PortfolioMode = "professional" | "room";
type TransitionMode = "professional" | "room" | null;

export function IntroScreen({
  lastMode,
  onNavigate,
}: {
  lastMode: PortfolioMode | null;
  onNavigate: (path: PortfolioRoute) => void;
}) {
  const pageRef = useRef<HTMLElement | null>(null);
  const [hoveredMode, setHoveredMode] = useState<PortfolioMode | null>(null);
  const [transitionMode, setTransitionMode] = useState<TransitionMode>(null);
  const continuePath = lastMode === "room" ? "/room" : "/professional";
  const continueLabel = lastMode === "room" ? "Continue in Ayaan's Room" : "Continue Professional Portfolio";

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!pageRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = pageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    pageRef.current.style.setProperty("--ix", x.toFixed(3));
    pageRef.current.style.setProperty("--iy", y.toFixed(3));
  }

  function enterMode(mode: PortfolioMode) {
    setTransitionMode(mode);
    window.setTimeout(() => onNavigate(mode === "room" ? "/room" : "/professional"), 420);
  }

  return (
    <main
      className={`intro-page dream-gateway ${hoveredMode ? `hover-${hoveredMode}` : ""} ${transitionMode ? `intro-transitioning transition-${transitionMode}` : ""}`}
      onPointerMove={handlePointerMove}
      ref={pageRef}
    >
      <div className="dream-grain" />
      <div className="dream-fog" />
      <div className="room-silhouette" aria-hidden="true">
        <span className="silhouette-floor" />
        <span className="silhouette-door" />
        <span className="silhouette-light" />
      </div>
      <div className="intro-dust" aria-hidden="true">
        {Array.from({ length: 38 }).map((_, index) => (
          <span
            key={index}
            style={{
              "--x": `${(index * 29) % 100}%`,
              "--y": `${(index * 47) % 100}%`,
              "--s": `${1 + (index % 5) * 0.35}px`,
              "--d": `${22 + (index % 8) * 3}s`,
              "--delay": `${index * -0.58}s`,
              "--a": `${0.12 + (index % 5) * 0.04}`,
            } as CSSProperties}
          />
        ))}
      </div>

      <section className="gateway-shell" aria-labelledby="intro-title">
        <div className="gateway-heading">
          <p>Ayaan Khan</p>
          <h1 id="intro-title">AI & Software Engineer</h1>
          <div className="gateway-lines" aria-label="Portfolio modes">
            <span>There are two ways to explore this portfolio.</span>
          </div>
        </div>

        <div className="choice-caption-row" aria-hidden="true">
          <span>One is built for clarity.</span>
          <span>One is built for curiosity.</span>
        </div>

        <div className="gateway-options" aria-label="Choose portfolio experience">
          <button
            className="gateway-option option-professional"
            onBlur={() => setHoveredMode(null)}
            onClick={() => enterMode("professional")}
            onFocus={() => setHoveredMode("professional")}
            onMouseEnter={() => setHoveredMode("professional")}
            onMouseLeave={() => setHoveredMode(null)}
            type="button"
          >
            <span className="option-index">01</span>
            <span className="option-icon"><BriefcaseBusiness size={18} /></span>
            <span className="option-copy">
              <b>Professional Portfolio</b>
              <small>Structured, technical, recruiter-focused.</small>
            </span>
            <ArrowRight className="option-arrow" size={17} />
          </button>

          <button
            className="gateway-option option-room"
            onBlur={() => setHoveredMode(null)}
            onClick={() => enterMode("room")}
            onFocus={() => setHoveredMode("room")}
            onMouseEnter={() => setHoveredMode("room")}
            onMouseLeave={() => setHoveredMode(null)}
            type="button"
          >
            <span className="option-index">02</span>
            <span className="option-icon"><DoorOpen size={18} /></span>
            <span className="option-copy">
              <b>Ayaan's Room</b>
              <small>Interactive, exploratory, personal.</small>
            </span>
            <ArrowRight className="option-arrow" size={17} />
          </button>
        </div>

        {lastMode ? (
          <button className="gateway-continue" onClick={() => enterMode(lastMode)} type="button">
            {continueLabel}
            <ArrowRight size={15} />
          </button>
        ) : null}
      </section>

      <div className="gateway-transition" aria-hidden="true" />
    </main>
  );
}
