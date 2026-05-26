import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { IntroScreen } from "./pages/IntroScreen";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProfessionalPortfolio } from "./pages/ProfessionalPortfolio";
import { trackEvent } from "./services/analytics";

const RoomPage = lazy(() => import("./pages/RoomPage").then((module) => ({ default: module.RoomPage })));

type PortfolioRoute = "/" | "/professional" | "/projects" | "/room";
type PortfolioMode = "professional" | "room";

function normalizeRoute(pathname: string): PortfolioRoute {
  if (pathname === "/professional" || pathname === "/projects" || pathname === "/room") return pathname;
  return "/";
}

function routeToMode(path: PortfolioRoute): PortfolioMode | null {
  if (path === "/professional" || path === "/projects") return "professional";
  if (path === "/room") return "room";
  return null;
}

export function App() {
  const [route, setRoute] = useState<PortfolioRoute>(() => normalizeRoute(window.location.pathname));
  const [lastMode, setLastMode] = useState<PortfolioMode | null>(() => {
    const stored = localStorage.getItem("ayaan-portfolio-mode");
    return stored === "professional" || stored === "room" ? stored : null;
  });

  useEffect(() => {
    void trackEvent({ eventType: "site_visit", metadata: { surface: route } });
  }, [route]);

  useEffect(() => {
    const handlePopState = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((path: PortfolioRoute) => {
    const nextMode = routeToMode(path);
    if (nextMode) {
      localStorage.setItem("ayaan-portfolio-mode", nextMode);
      setLastMode(nextMode);
    }

    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setRoute(path);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (route === "/professional") {
    return <ProfessionalPortfolio onNavigate={navigate} />;
  }

  if (route === "/projects") {
    return <ProjectsPage onNavigate={navigate} />;
  }

  if (route === "/room") {
    return (
      <Suspense fallback={<main className="route-loading">Opening Ayaan's Room...</main>}>
        <RoomPage onNavigate={navigate} />
      </Suspense>
    );
  }

  return <IntroScreen lastMode={lastMode} onNavigate={navigate} />;
}
