"use client";

import dynamic from "next/dynamic";

import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import PortfolioShowcase from "@/components/sections/PortfolioShowcase";
import SkillsSection from "@/components/sections/skills/SkillsSection";
import PathSection from "@/components/sections/path/PathSection";
import ContactSection from "@/components/sections/contact/ContactSection";
import SmoothScroll from "@/components/SmoothScroll";
import ErrorBoundary from "@/components/ErrorBoundary";

const ParticleWorld = dynamic(() => import("@/components/three/ParticleWorld"), { ssr: false });

export default function HomeClient() {
  return (
    <main className="relative overflow-x-clip">
      <div className="site-bg" aria-hidden="true" />
      <ErrorBoundary>
        <ParticleWorld />
      </ErrorBoundary>
      <SmoothScroll />
      <div className="grain" aria-hidden="true" />

      <div className="relative z-[2]">
        <Navbar />
        <Hero />
        <PortfolioShowcase />
        <SkillsSection />
        <PathSection />
        <ContactSection />
      </div>
    </main>
  );
}
