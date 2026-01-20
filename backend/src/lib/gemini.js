import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAiResponse = async (systemPrompt, userPrompt) => {
    const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
  });
  const response = await model.generateContent(userPrompt);
  return response.text();
};
