import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAiResponse = async (systemPrompt, userPrompt) => {
  try {
    // Use v1 (Stable) with the most basic model name
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" }, // Latest stable model (verified via ListModels)
      { apiVersion: "v1" }
    );

    // Manual injection to avoid "systemInstruction" field errors
    const finalPrompt = `CONTEXT: ${systemPrompt}\n\nUSER REQUEST: ${userPrompt}`;

    const result = await model.generateContent(finalPrompt);
    const response = result.response;

    return response.text();
  } catch (error) {
    // Log the actual error for you to see in the terminal
    console.error("DEBUG - Full API Error:", error);

    // Return a fallback message so the delivery process doesn't break
    return "AI Summary unavailable at the moment.";
  }
};