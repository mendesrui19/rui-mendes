import { NextResponse } from "next/server";
import { supabaseRest, supabaseUpload } from "@/lib/supabase";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 1_048_576;

export type GuestbookNote = {
  id: string;
  name: string;
  comment: string;
  image_url: string | null;
  likes: number;
  is_pinned: boolean;
};

export async function GET() {
  try {
    const notes = await supabaseRest<GuestbookNote[]>("cv_guestbook", {
      search:
        "?select=id,name,comment,image_url,likes,is_pinned&order=is_pinned.desc,created_at.desc",
    });
    return NextResponse.json({ notes });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "";
    if (messageText.includes("not configured")) {
      return NextResponse.json({ error: "Comments are not configured yet." }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not load comments." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (String(form.get("website") ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(form.get("name") ?? "").trim();
  const comment = String(form.get("comment") ?? "").trim();
  const image = form.get("image");

  if (name.length < 1 || name.length > 40) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (comment.length < 1 || comment.length > 500) {
    return NextResponse.json({ error: "Comment is required." }, { status: 400 });
  }

  try {
    let image_url: string | null = null;

    if (image instanceof File && image.size > 0) {
      if (image.size > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: "Image must be under 1 MB." }, { status: 400 });
      }
      if (!ALLOWED_TYPES.has(image.type)) {
        return NextResponse.json({ error: "Use a JPG, PNG, WEBP or GIF image." }, { status: 400 });
      }

      const ext = image.type === "image/jpeg" ? "jpg" : image.type.split("/")[1];
      image_url = await supabaseUpload(`${crypto.randomUUID()}.${ext}`, image);
    }

    const notes = await supabaseRest<GuestbookNote[]>("cv_guestbook", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ name, comment, image_url }),
    });

    const note = notes[0];
    if (!note) {
      return NextResponse.json({ error: "Could not publish the comment." }, { status: 500 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "";
    if (messageText.includes("not configured")) {
      return NextResponse.json({ error: "Comments are not configured yet." }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not publish the comment." }, { status: 500 });
  }
}
