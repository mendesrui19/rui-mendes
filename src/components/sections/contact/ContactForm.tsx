"use client";

import { useState } from "react";
import { Send, User, Mail, MessageSquare, ArrowUpRight } from "lucide-react";
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
    <div className="contact-panel flex h-full min-w-0 flex-col rounded-[28px] p-6 md:p-8">
      <h2 className="mb-2 text-2xl font-bold md:text-3xl">Write to me</h2>
      <p className="mb-8 text-sm leading-relaxed text-[var(--text-secondary)]">
        Collaborations, ideas or just a hello. I usually reply on LinkedIn.
      </p>

      <form className="grid gap-5" onSubmit={handleSubmit}>
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
          <span className="field-box">
            <User size={16} />
            <input
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="field-input"
            />
          </span>
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <span className="field-box">
            <Mail size={16} />
            <input
              required
              type="email"
              maxLength={120}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@email.com"
              className="field-input"
            />
          </span>
        </label>
        <label className="field">
          <span className="field-label">Message</span>
          <span className="field-box area">
            <MessageSquare size={16} />
            <textarea
              required
              maxLength={2000}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="field-area"
            />
          </span>
        </label>
        <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
          <Send size={16} />
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
        {status === "sent" && (
          <p className="text-sm text-[var(--accent)]">Message sent. I’ll get back to you soon.</p>
        )}
        {status === "error" && <p className="text-sm text-red-300/80">{error}</p>}
      </form>

      <div className="mt-8 border-t border-[color-mix(in_oklch,var(--accent)_22%,transparent)] pt-6">
        <p className="mb-4 text-sm text-[var(--text-muted)]">Links</p>
        <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-row mb-3">
          <span className="flex min-w-0 items-center gap-3">
            <span className="social-chip">
              <FaLinkedinIn />
            </span>
            <span>
              <span className="block text-sm font-medium">LinkedIn</span>
              <span className="block text-xs text-[var(--text-muted)]">/in/ruimiguelmendes</span>
            </span>
          </span>
          <span className="social-chip">
            <ArrowUpRight size={14} />
          </span>
        </a>
        <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="social-row">
          <span className="flex min-w-0 items-center gap-3">
            <span className="social-chip">
              <FaGithub />
            </span>
            <span>
              <span className="block text-sm font-medium">GitHub</span>
              <span className="block text-xs text-[var(--text-muted)]">@mendesrui19</span>
            </span>
          </span>
          <span className="social-chip">
            <ArrowUpRight size={14} />
          </span>
        </a>
      </div>
    </div>
  );
}
