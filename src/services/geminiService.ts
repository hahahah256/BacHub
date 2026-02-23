import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export const generateExamContent = async (url: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
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
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `قم بتوليد ${count} أسئلة متعددة الخيارات (QCM) حول الموضوع التالي في مادة العلوم الطبيعية: "${topic}". 
    يجب أن تكون الأسئلة دقيقة علمياً ومناسبة لمستوى البكالوريا.`,
    config: {
      systemInstruction: "أنت خبير في مادة العلوم الطبيعية للبكالوريا الجزائرية. مهمتك هي توليد أسئلة QCM عالية الجودة باللغة العربية الفصحى فقط. تأكد من أن كل سؤال له 4 خيارات وإجابة صحيحة واحدة وتفسير علمي دقيق.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "نص السؤال باللغة العربية.",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "أربعة خيارات للسؤال باللغة العربية.",
            },
            correctAnswer: {
              type: Type.STRING,
              description: "الحرف الذي يمثل الإجابة الصحيحة (A أو B أو C أو D).",
            },
            explanation: {
              type: Type.STRING,
              description: "تفسير علمي موجز للإجابة الصحيحة باللغة العربية.",
            },
          },
          required: ["text", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });

  const text = response.text;
  if (!text) return [];
  
  try {
    return JSON.parse(text) as Question[];
  } catch (e) {
    console.error("Failed to parse QCM response:", e);
    return [];
  }
};

