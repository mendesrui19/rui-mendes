"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { site } from "@/data/site";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setError(data.error || "Could not send the message.");
        return;
      }

      setName("");
      setEmail("");
      setMessage("");
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Could not send the message.");
    }
  };

  return (
    <div className="contact-panel flex h-full min-w-0 flex-col rounded-2xl p-6 md:p-7">
      <h2 className="mb-1 text-xl font-semibold tracking-[-0.02em] md:text-2xl">Write to me</h2>
      <p className="mb-7 text-sm leading-relaxed text-[var(--text-muted)]">
        Collaborations, ideas or just a hello. I usually reply on LinkedIn.
      </p>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="sr-only" aria-hidden="true">
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Name</span>
          <input
            required
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
          />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            maxLength={120}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input"
          />
        </label>
        <label className="field">
          <span className="field-label">Message</span>
          <textarea
            required
            maxLength={2000}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="field-area"
          />
        </label>
        <button type="submit" className="btn-primary mt-1 w-full" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "sent" && (
          <p className="text-sm text-[var(--accent)]">Message sent. I’ll get back to you soon.</p>
        )}
        {status === "error" && <p className="text-sm text-red-300/80">{error}</p>}
      </form>

      <div className="mt-8 border-t border-[color-mix(in_oklch,var(--accent)_22%,transparent)] pt-6">
        <p className="mb-4 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.16em] text-[var(--accent)]">
          Find me
        </p>
        <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-row social-link is-linkedin mb-3">
          <span className="flex min-w-0 items-center gap-3.5">
            <span className="social-chip social-chip--linkedin">
              <FaLinkedinIn />
            </span>
            <span>
              <span className="block text-base font-semibold">LinkedIn</span>
              <span className="block text-xs text-[var(--accent)]">/in/ruimiguelmendes</span>
            </span>
          </span>
          <span className="social-chip social-chip--go">
            <ArrowUpRight size={16} />
          </span>
        </a>
        <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="social-row social-link is-github">
          <span className="flex min-w-0 items-center gap-3.5">
            <span className="social-chip social-chip--github">
              <FaGithub />
            </span>
            <span>
              <span className="block text-base font-semibold">GitHub</span>
              <span className="block text-xs text-[var(--accent)]">@mendesrui19</span>
            </span>
          </span>
          <span className="social-chip social-chip--go">
            <ArrowUpRight size={16} />
          </span>
        </a>
      </div>
    </div>
  );
}
