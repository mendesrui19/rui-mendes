"use client";

import { site } from "@/data/site";

export default function WelcomeScreen() {
  return (
    <div
      className="flex h-dvh w-full items-center justify-center px-5"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <img
          src={site.photo}
          alt=""
          className="size-20 rounded-full object-cover object-[center_18%] ring-2 ring-[var(--accent)]"
        />
        <div>
          <p className="text-[clamp(18px,3vw,28px)] font-extrabold tracking-[-0.04em]">
            Hi, I’m Rui
          </p>
          <h1
            className="m-0 text-[clamp(16px,2.6vw,22px)] font-medium tracking-[-0.02em]"
            style={{ color: "var(--accent)" }}
          >
            {site.role}
          </h1>
        </div>
        <div
          className="rounded-full px-3.5 py-1.5 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.12em]"
          style={{
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          {site.location}
        </div>
      </div>
    </div>
  );
}
