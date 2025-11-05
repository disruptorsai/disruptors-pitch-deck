
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, LayoutDashboard, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { usePersonalizedPresentation } from "@/hooks/use-personalized-presentation";
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation";
import { transitions, pageTransitions } from "@/lib/animation-config";
import ParticleBackground from "@/components/3d/ParticleBackground";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import ProgressIndicator from "@/components/ProgressIndicator";
import DarkModeToggle from "@/components/DarkModeToggle";
import DisruptorBot from "@/components/disruptorbot/DisruptorBot";

const pages = [
  { name: "Home", path: "Home", order: 1 },
  { name: "Introduction", path: "Introduction", order: 2 },
  { name: "Diagnostic", path: "Diagnostic", order: 3 },
  { name: "CaseStudies", path: "CaseStudies", order: 4 },
  { name: "Capabilities", path: "Capabilities", order: 5 },
  { name: "Blueprint", path: "Blueprint", order: 6 },
  { name: "Pricing", path: "Pricing", order: 7 },
  { name: "CallToAction", path: "CallToAction", order: 8 }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { client, isLoading } = usePersonalizedPresentation();
  const { handleSwipe } = useSwipeNavigation();

  const currentPageIndex = pages.findIndex(p => location.pathname === createPageUrl(p.path));
  const showNavigation = currentPageName !== "Home" && currentPageName !== "Dashboard";

  const goToPrevious = () => {
    if (currentPageIndex > 0) {
      navigate(createPageUrl(pages[currentPageIndex - 1].path));
    }
  };

  const goToNext = () => {
    if (currentPageIndex < pages.length - 1) {
      navigate(createPageUrl(pages[currentPageIndex + 1].path));
    }
  };

  return (
    <BrandingProvider client={client} isLoading={isLoading}>
    <>
      <ParticleBackground />
      <PerformanceMonitor />

      <motion.div
        className="min-h-screen bg-[#0E0E0E] text-white relative"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        dragMomentum={false}
        onDragEnd={(e, info) => handleSwipe(info)}
      >
      <style>{`
        * {
          font-family: 'Neue Montreal', system-ui, -apple-system, sans-serif;
          letter-spacing: normal;
        }

        .gradient-accent {
          background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
        }

        .gradient-text {
          background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hover-glow {
          transition: all 0.3s ease;
        }

        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.2);
          transform: scale(1.02);
        }
        
        .page-transition {
          animation: fadeIn 0.6s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .floating {
          animation: floating 6s ease-in-out infinite;
        }
        
        @keyframes floating {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>

      {showNavigation && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#0E0E0E]/90 backdrop-blur-xl border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentPageIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="hover:bg-white/10 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <span className="text-sm font-light text-white/70">
                {currentPageIndex + 1} / {pages.length}
              </span>
              {currentPageIndex < pages.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="hover:bg-white/10 text-white"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <DarkModeToggle />
              <Link to={createPageUrl("Home")}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/10 text-white"
                >
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Dashboard")}>
                <Button
                  className="gradient-accent hover-glow text-white font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </motion.nav>
      )}

      <main className={showNavigation ? "pt-20 pb-16" : "pb-16"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={pageTransitions.initial}
            animate={pageTransitions.animate}
            exit={pageTransitions.exit}
            transition={transitions.smooth}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <ProgressIndicator />

      {/* DisruptorBot AI Assistant */}
      {client?.id && (
        <DisruptorBot
          clientId={client.id}
          currentSlideSlug={pages[currentPageIndex]?.path}
        />
      )}
    </motion.div>
    </>
    </BrandingProvider>
  );
}
