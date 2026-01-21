import * as ChatService from "./chat.service.js";
import { getAiResponse } from "../../lib/gemini.js";

export const handleUserMessage = async (req, res) => {
  try {
    // --- 1. USE PARSED BODY ---
    const { message } = req.body || {};

    // --- 2. VALIDATE MESSAGE ---
    if (!message) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, message: "Message is required" }));
    }

    // --- 3. GET DATABASE CONTEXT ---
    const campusData = await ChatService.getCampusContext();

    // --- 4. PREPARE PROMPT & CALL GEMINI ---
    const systemPrompt = `
        You are the "Gebeta Review Assistant", a helpful, friendly, and reliable AI for a university campus service review platform called "Gebeta".
        Your responsibilities:
        1. Help students WRITE honest reviews based on their experiences.
        2. Provide FACTUAL information about campus and nearby services (cafeterias, restaurants, delivery services).
        3. Recommend services ONLY when asked.

        STRICT RULES:
        - Use ONLY the information provided in the CONTEXT DATA.
        - Do NOT guess, invent, or assume any data.
        - If a business, food item, or service is NOT found in the context, respond politely:
        "Sorry, I don't have information about that on Gebeta yet."
        - If price or rating is missing, clearly say:
        "Price not available" or "Rating not available".
        - NEVER generate fake prices or ratings.

        REVIEW WRITING RULES:
        - If the user asks to write a review, write it in a natural student tone.
        - Reviews must be respectful, even when negative.
        - Encourage honesty without offensive language.

        RECOMMENDATION RULES:
        - Only recommend when the user explicitly asks.
        - Choose the option with the highest rating.
        - If multiple have the same rating, pick the most reviewed one.

        FORMAT RULES:
        - Be concise.
        - Use bullet points for lists.
        - Always include:
        • Name
        • Price (ETB)
        • Rating (average + count, if available)

        FAILSAFE:
        - If CONTEXT DATA is empty or insufficient, say you don't have enough information.

        CONTEXT DATA FROM DATABASE:
        ${campusData}
    `;

    const aiReply = await getAiResponse(systemPrompt, message);

    // --- 5. SEND SUCCESS ---
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      success: true,
      data: aiReply,
      timestamp: new Date().toISOString(),
    }));

  } catch (error) {
    console.error("AI Brain Error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      success: false,
      message: "AI Brain Error",
      error: error.message
    }));
  }
};