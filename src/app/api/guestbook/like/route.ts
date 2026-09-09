import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: { id?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = body.id?.trim() ?? "";
  if (!id) {
    return NextResponse.json({ error: "Comment id is required." }, { status: 400 });
  }

  try {
    const likes = await supabaseRest<number>("rpc/cv_guestbook_like", {
      method: "POST",
      body: JSON.stringify({ p_id: id }),
    });
    return NextResponse.json({ likes: Number(likes ?? 0) });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "";
    if (messageText.includes("not configured")) {
      return NextResponse.json({ error: "Comments are not configured yet." }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not like this comment." }, { status: 500 });
  }
}
