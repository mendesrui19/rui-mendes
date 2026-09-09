"use client";

import { useEffect, useState } from "react";
import { Upload, Heart, Pin } from "lucide-react";

type Comment = {
  id: string;
  name: string;
  comment: string;
  image_url?: string | null;
  likes: number;
  is_pinned?: boolean;
};

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/guestbook");
        const data = (await response.json()) as { notes?: Comment[]; error?: string };
        if (!response.ok) {
          if (!cancelled) setError(data.error || "Could not load comments.");
          return;
        }
        if (!cancelled) setComments(data.notes ?? []);
      } catch {
        if (!cancelled) setError("Could not load comments.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !comment.trim() || publishing) return;

    setPublishing(true);
    setError("");

    const form = new FormData();
    form.set("name", name.trim());
    form.set("comment", comment.trim());
    form.set("website", website);
    if (image) form.set("image", image);

    try {
      const response = await fetch("/api/guestbook", { method: "POST", body: form });
      const data = (await response.json()) as { note?: Comment; error?: string };

      if (!response.ok || !data.note) {
        setError(data.error || "Could not publish the comment.");
        return;
      }

      setComments((current) => [data.note!, ...current]);
      setName("");
      setComment("");
      setImage(null);
      setPreview(null);
    } catch {
      setError("Could not publish the comment.");
    } finally {
      setPublishing(false);
    }
  };

  const handleLike = async (id: string) => {
    setComments((current) =>
      current.map((item) => (item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item)),
    );

    try {
      const response = await fetch("/api/guestbook/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await response.json()) as { likes?: number };
      if (!response.ok) return;
      if (typeof data.likes === "number") {
        setComments((current) =>
          current.map((item) => (item.id === id ? { ...item, likes: data.likes! } : item)),
        );
      }
    } catch {
      /* keep the optimistic count */
    }
  };

  return (
    <div className="comment-panel flex h-full min-w-0 flex-col rounded-2xl p-6 md:p-7">
      <div className="mb-6">
        <h3 className="mb-1 text-xl font-semibold tracking-[-0.02em] md:text-2xl">Comments</h3>
        <p className="text-sm text-[var(--text-muted)]">Public notes from people who visit the site</p>
      </div>

      <form className="mb-6 grid gap-4" onSubmit={handleSubmit}>
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
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
          />
        </label>
        <label className="field">
          <span className="field-label">Comment</span>
          <textarea
            required
            maxLength={500}
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="field-area"
            style={{ minHeight: 96 }}
          />
        </label>
        <label className="file-field">
          <span className="flex min-w-0 items-center gap-2">
            <Upload size={14} />
            <span className="truncate">{image ? image.name : "Attach image"}</span>
          </span>
          <span className="shrink-0 text-[11px] tracking-normal text-[var(--text-muted)]">Optional · 1 MB</span>
          <input hidden type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImage} />
        </label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-full rounded-[var(--r)] border border-[var(--border)] object-cover"
          />
        )}

        <button type="submit" className="btn-soft" disabled={publishing}>
          {publishing ? "Publishing..." : "Publish"}
        </button>
        {error && <p className="text-sm text-red-300/80">{error}</p>}
      </form>

      <div className="custom-scroll comment-feed min-h-[160px] flex-1 overflow-y-auto rounded-[var(--r-lg)] p-3">
        {loading ? (
          <p className="px-3 py-8 text-center text-[13px] text-[var(--text-muted)]">Loading notes...</p>
        ) : comments.length === 0 ? (
          <p className="px-3 py-8 text-center text-[13px] text-[var(--text-muted)]">No notes yet.</p>
        ) : (
          <div className="grid gap-3">
            {comments.map((item) => (
              <div
                key={item.id}
                className={`comment-card rounded-[var(--r)] p-4 ${item.is_pinned ? "is-pinned" : ""}`}
              >
                <div className="flex gap-3">
                  <div className="comment-avatar flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {item.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{item.name}</p>
                      {item.is_pinned && (
                        <div className="flex items-center gap-1 rounded-full border border-[color-mix(in_oklch,var(--accent)_35%,transparent)] bg-[color-mix(in_oklch,var(--accent)_12%,transparent)] px-2 py-[3px] text-[10px] text-[var(--accent)]">
                          <Pin size={10} />
                          PINNED
                        </div>
                      )}
                    </div>
                    <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{item.comment}</p>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt="Comment"
                        className="mt-3 max-h-48 w-full rounded-xl border border-[var(--border)] object-cover"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleLike(item.id)}
                    className="like-btn flex h-fit items-center gap-1 text-[11px] transition-colors"
                  >
                    <Heart size={13} />
                    {item.likes || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
