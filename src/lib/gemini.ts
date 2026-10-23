import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface AIAnalysisResult {
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  severity: "CRITICAL_BLOCKAGE" | "FLOOD_RISK" | "FOUL_ODOR" | "ROUTINE_MAINTENANCE" | "STRUCTURAL_DAMAGE";
  summary: string;
  suggestedTags: string[];
  estimatedResolutionDays: number;
  confidence: number;
  zone: string;
  reasoning: string;
}

export async function analyzeComplaint(
  description: string,
  imageBase64?: string,
  mimeType?: string
): Promise<AIAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an AI assistant for a civic drain maintenance platform called "Clear Drain". 
Analyze the following drain complaint and provide a structured assessment.

Complaint Description:
"${description}"

Based on this complaint ${imageBase64 ? "and the attached image" : ""}, provide a JSON response with these fields:
- priority: one of "URGENT", "HIGH", "MEDIUM", "LOW"
- severity: one of "CRITICAL_BLOCKAGE", "FLOOD_RISK", "FOUL_ODOR", "ROUTINE_MAINTENANCE", "STRUCTURAL_DAMAGE"
- summary: a 1-2 sentence professional summary of the issue
- suggestedTags: array of 3-5 relevant tags (e.g., "blocked-grate", "flood-prone", "sewage-overflow")
- estimatedResolutionDays: estimated days to resolve (1-14)
- confidence: confidence score 0.0-1.0
- zone: suggest zone routing (e.g., "North Zone", "South Zone", "Central Zone", "East Zone", "West Zone")
- reasoning: brief explanation of your assessment

Priority Guidelines:
- URGENT: Active flooding, sewage overflow, public health hazard
- HIGH: Major blockage, strong odor, accident risk
- MEDIUM: Partial blockage, recurring issue, slow drain
- LOW: Minor debris, cosmetic, routine cleaning needed

Respond with ONLY valid JSON, no markdown.`;

  const parts: Parameters<typeof model.generateContent>[0] extends { contents: infer C } ? C[0]["parts"] : never[] = [
    { text: prompt }
  ];

  if (imageBase64 && mimeType) {
    (parts as { inlineData?: { mimeType: string; data: string }; text?: string }[]).push({
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    });
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    const text = result.response.text().trim();
    // Strip markdown code blocks if present
    const json = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(json) as AIAnalysisResult;
  } catch {
    // Fallback if AI fails
    return {
      priority: "MEDIUM",
      severity: "ROUTINE_MAINTENANCE",
      summary: "Drain issue reported. Manual review required.",
      suggestedTags: ["drain-issue", "review-needed"],
      estimatedResolutionDays: 7,
      confidence: 0.3,
      zone: "Central Zone",
      reasoning: "AI analysis unavailable. Default classification applied.",
    };
  }
}

export async function getChatbotResponse(
  userMessage: string,
  language: string = "en",
  context?: { ackId?: string; ticketStatus?: string }
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are ClearBot, the helpful AI assistant for "Clear Drain" — a civic drain maintenance platform. 
You help citizens report drain issues, check ticket status, and answer FAQs.

Current context: ${context ? JSON.stringify(context) : "No context"}
User language preference: ${language}

Guidelines:
- Be concise, friendly, and professional
- If asked about ticket status and ackId is provided, use it
- For reporting issues, guide them to use the "Report Issue" button
- Respond in the user's language (${language})
- If the language is not English, respond in that language
- Keep responses under 150 words
- Use emojis sparingly for warmth
- Never make up specific data about actual tickets — only use provided context

Common FAQs:
- How to report: Go to the Report section and fill the form with location and photos
- SLA: Issues are resolved within 7 working days
- Escalation: If unresolved after 7 days, click "Escalate Issue" on your ticket
- Track status: Use your Acknowledgement ID (CD-XXXX) on the Track page`;

  const result = await model.generateContent({
    contents: [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I'm ClearBot, ready to assist citizens with drain-related queries." }] },
      { role: "user", parts: [{ text: userMessage }] },
    ],
  });

  return result.response.text();
}
