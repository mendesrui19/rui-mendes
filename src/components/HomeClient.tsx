"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import PortfolioShowcase from "@/components/sections/PortfolioShowcase";
import ContactSection from "@/components/sections/contact/ContactSection";
import WelcomeScreen from "@/components/WelcomeScreen";
import { hasPlayedIntro, setIntroPlayed } from "@/lib/introState";

export default function HomeClient() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showApp, setShowApp] = useState(false);
  const [skipExit, setSkipExit] = useState(false);

  useEffect(() => {
    const currentHash = window.location.hash;
    const pathname = window.location.pathname;

    if (currentHash === "#portfolio") {
      setSkipExit(true);
      setShowWelcome(false);
      setShowApp(true);
      return;
    }

    const navEntries = performance.getEntriesByType("navigation");
    const navigationType =
      navEntries.length > 0
        ? (navEntries[0] as PerformanceNavigationTiming).type
        : null;

    const isReload = navigationType === "reload";

    if (isReload && pathname === "/") {
      sessionStorage.removeItem("introPlayed");
      sessionStorage.removeItem("heroPlayed");

      if (window.location.hash) {
        history.replaceState(null, "", "/");
      }

      window.scrollTo({ top: 0, behavior: "instant" });
    }

    if (!hasPlayedIntro()) {
      setShowWelcome(true);
      setShowApp(false);

      const timer = setTimeout(() => {
        setShowWelcome(false);
        setShowApp(true);
        setIntroPlayed();
      }, 4200);

      return () => clearTimeout(timer);
    }

    setSkipExit(true);
    setShowWelcome(false);
    setShowApp(true);
  }, []);

  return (
    <main className="relative overflow-x-clip">
      <AnimatedBackground />

      <div className="relative z-[2]">
        <Navbar />
        <Hero showApp={showApp} />
        <About />
        <PortfolioShowcase />
        <ContactSection />
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            onAnimationStart={(definition) => {
              if (definition === "exit") {
                setShowApp(true);
              }
            }}
            transition={{
              duration: skipExit ? 0 : 1.2,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-[9999]"
          >
            <WelcomeScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
