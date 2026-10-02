"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

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
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          className="flex min-h-[380px] flex-col items-center justify-center text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <motion.span
            className="sent-badge"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
          >
            <Check size={28} strokeWidth={2.5} />
          </motion.span>
          <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">Message sent</h3>
          <p className="mt-2 max-w-xs text-sm text-[var(--text-secondary)]">
            Thanks for writing. I’ll get back to you soon.
          </p>
          <button type="button" className="btn-ghost mt-7" onClick={() => setStatus("idle")}>
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          className="grid gap-4"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <label className="sr-only" aria-hidden="true">
            Website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
          <label className="field">
            <span className="field-label flex justify-between">
              Message
              <span className="font-normal text-[var(--text-muted)]">{message.length}/2000</span>
            </span>
            <textarea
              required
              maxLength={2000}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="field-area"
            />
          </label>
          <button type="submit" className="btn-primary send-btn mt-1 w-full" disabled={status === "sending"}>
            {status === "sending" ? (
              <>
                <span className="spinner" /> Sending…
              </>
            ) : (
              <>
                Send message <ArrowRight size={16} className="send-arrow" />
              </>
            )}
          </button>
          {status === "error" && (
            <motion.p
              className="text-sm text-red-300/80"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
