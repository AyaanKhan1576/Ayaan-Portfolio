import { ArrowRight, BriefcaseBusiness, Gamepad2 } from "lucide-react";

type PortfolioRoute = "/" | "/professional" | "/room";
type PortfolioMode = "professional" | "room";

export function IntroScreen({
  lastMode,
  onNavigate,
}: {
  lastMode: PortfolioMode | null;
  onNavigate: (path: PortfolioRoute) => void;
}) {
  const continuePath = lastMode === "room" ? "/room" : "/professional";
  const continueLabel = lastMode === "room" ? "Continue in Ayaan's Room" : "Continue Professional Portfolio";

  return (
    <main className="intro-page">
      <div className="intro-noise" />
      <section className="intro-shell" aria-labelledby="intro-title">
        <div className="intro-eyebrow">Ayaan Khan / AI & Software Engineer</div>
        <div className="intro-grid">
          <div className="intro-copy">
            <p className="intro-kicker">There are two ways to explore this portfolio.</p>
            <h1 id="intro-title">One is built for clarity. One is built for curiosity.</h1>
            <p className="intro-summary">
              Building production-ready intelligent systems with LLMs, Computer Vision, RAG, and backend engineering.
            </p>
            <div className="intro-actions" aria-label="Choose portfolio experience">
              <button className="pro-button pro-button-primary" onClick={() => onNavigate("/professional")} type="button">
                <BriefcaseBusiness size={17} />
                Enter Professional Portfolio
              </button>
              <button className="pro-button pro-button-secondary" onClick={() => onNavigate("/room")} type="button">
                <Gamepad2 size={17} />
                Enter Ayaan's Room
              </button>
            </div>
            {lastMode ? (
              <button className="intro-continue" onClick={() => onNavigate(continuePath)} type="button">
                {continueLabel}
                <ArrowRight size={15} />
              </button>
            ) : null}
          </div>

          <div className="intro-panel" aria-hidden="true">
            <div className="intro-panel-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="intro-panel-row active">
              <span>professional</span>
              <b>Recruiter-facing overview</b>
            </div>
            <div className="intro-panel-row">
              <span>game</span>
              <b>Interactive room portfolio</b>
            </div>
            <div className="intro-panel-code">
              <span>mode.select()</span>
              <span>fast, focused, memorable</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
