
import { GoogleGenAI, Type } from "@google/genai";
import { Book } from "../types";

// ใช้ process.env.API_KEY เสมอ
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getBookInsights = async (book: Book) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `กรุณาวิเคราะห์หนังสือเรื่อง "${book.title}" โดย ${book.author} ซึ่งอยู่ในหมวดหมู่ ${book.category}.
                 ให้ระบุเหตุผล 3 ข้อว่าทำไมควรแนะนำให้อ่านหนังสือเล่มนี้
                 กรุณาตอบเป็นภาษาไทยในรูปแบบสรุปที่เป็นทางการและน่าสนใจ`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "ขออภัย ไม่สามารถสร้างบทวิเคราะห์ได้ในขณะนี้";
  } catch (error) {
    console.error("AI Error:", error);
    return "ระบบ AI บรรณารักษ์กำลังขัดข้อง โปรดลองใหม่ภายหลัง";
  }
};

export const suggestCategory = async (title: string, author: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ช่วยแนะนำหมวดหมู่ที่เหมาะสมที่สุดสำหรับหนังสือชื่อ: "${title}" แต่งโดย ${author}. 
                 ส่งกลับเฉพาะชื่อหมวดหมู่เป็นภาษาไทย (ความยาว 2-3 คำเท่านั้น)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { 
              type: Type.STRING,
              description: 'The suggested library category in Thai.'
            }
          },
          propertyOrdering: ["category"]
        }
      }
    });
    const result = JSON.parse(response.text.trim());
    return result.category;
  } catch (error) {
    console.error("AI Category Suggestion Error:", error);
    return "วรรณกรรมทั่วไป";
  }
};

/**
 * สร้างรูปหน้าปกหนังสือด้วย AI
 */
export const generateBookCover = async (title: string, category: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Beautiful book cover illustration for a book titled "${title}" in the category of "${category}". Professional design, high quality, artistic. No text on the cover, just the illustration.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("AI Image Generation Error:", error);
    return null;
  }
};
