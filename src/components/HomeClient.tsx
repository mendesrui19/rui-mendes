"use client";

import Sidebar from "@/components/ui/Sidebar";
import Hero from "@/components/sections/Hero";
import PortfolioShowcase from "@/components/sections/PortfolioShowcase";
import SkillsSection from "@/components/sections/skills/SkillsSection";
import PathSection from "@/components/sections/path/PathSection";
import ContactSection from "@/components/sections/contact/ContactSection";
import SmoothScroll from "@/components/SmoothScroll";
import Spotlight from "@/components/ui/Spotlight";
import ScrollScene from "@/components/ui/ScrollScene";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function HomeClient() {
  return (
    <div className="dash">
      <div className="site-bg" aria-hidden="true">
        <span className="bg-grid" />
        <span className="bg-glow bg-glow-a" />
        <span className="bg-glow bg-glow-b" />
      </div>
      <SmoothScroll />
      <Spotlight />
      <ScrollProgress />
      <Sidebar />
      <main className="dash-main">
        <ScrollScene enter={false}>
          <Hero />
        </ScrollScene>
        <ScrollScene>
          <PortfolioShowcase />
        </ScrollScene>
        <ScrollScene>
          <SkillsSection />
        </ScrollScene>
        <ScrollScene>
          <PathSection />
        </ScrollScene>
        <ScrollScene>
          <ContactSection />
        </ScrollScene>
      </main>
    </div>
  );
}
