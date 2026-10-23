import { NextResponse } from "next/server";
import { getChatbotResponse } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, language = "en", ackId, ticketStatus } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await getChatbotResponse(message, language, { ackId, ticketStatus });
    return NextResponse.json({ response });
  } catch (err) {
    console.error("[POST /api/chat]", err);
    return NextResponse.json({ error: "Chat service unavailable" }, { status: 500 });
  }
}
