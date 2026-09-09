import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    message?: string;
    website?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 1 || name.length > 80) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!EMAIL.test(email) || email.length > 120) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (message.length < 1 || message.length > 2000) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  try {
    await supabaseRest("cv_messages", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ name, email, message }),
    });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "";
    if (messageText.includes("not configured")) {
      return NextResponse.json({ error: "Contact is not configured yet." }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not send the message." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
