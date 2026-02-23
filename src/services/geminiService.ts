import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateExamContent = async (url: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract and summarize the main exam topics, sample questions, and study materials from this URL: ${url}. Provide the output in a structured JSON format that I can use to populate a learning hub application. Include categories like 'topics', 'sample_questions', and 'resources'. IMPORTANT: All content (titles, descriptions, questions) MUST be in Arabic.`,
    config: {
      tools: [{ urlContext: {} }],
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
};

