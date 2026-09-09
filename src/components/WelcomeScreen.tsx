"use client";

import { Code2, Globe, User } from "lucide-react";
import { site } from "@/data/site";

const icons = [Code2, User, Globe];

export default function WelcomeScreen() {
  return (
    <div className="welcome-screen flex h-dvh w-full items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="flex flex-col items-center text-center">
        <div className="welcome-rise mb-10 flex items-center gap-3">
          {icons.map((Icon, index) => (
            <span key={index} className="welcome-icon">
              <Icon size={16} strokeWidth={1.6} />
            </span>
          ))}
        </div>

        <h1 className="welcome-rise welcome-rise-2 m-0 text-[clamp(2.6rem,8vw,5.2rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-white">
          Hello, I’m Rui
        </h1>
        <p className="welcome-rise welcome-rise-2 mt-4 mb-0 text-[clamp(1.05rem,2.4vw,1.55rem)] font-medium tracking-[-0.02em] text-[var(--text-secondary)]">
          Data Science & Engineering
        </p>

        <p className="welcome-rise welcome-rise-3 mt-10 mb-0 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.04em] text-white/65">
          {site.url}
        </p>
      </div>
    </div>
  );
}
