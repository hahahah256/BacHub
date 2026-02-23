import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

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

export const generateQCMs = async (topic: string, count: number = 5) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} multiple choice questions (QCM) about the following topic in biology: "${topic}". All content MUST be in Arabic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The question text in Arabic.",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four options for the question in Arabic.",
            },
            correctAnswer: {
              type: Type.STRING,
              description: "The correct answer (A, B, C, or D).",
            },
            explanation: {
              type: Type.STRING,
              description: "A brief explanation in Arabic.",
            },
          },
          required: ["text", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]") as Question[];
};

