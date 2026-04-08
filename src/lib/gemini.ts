import { GoogleGenAI, Type } from "@google/genai";

export function getAI() {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No Gemini API key found in environment (checked API_KEY and GEMINI_API_KEY).");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
}

export const MODELS = {
  FLASH: "gemini-3-flash-preview",
  PRO: "gemini-3.1-pro-preview",
};

export function parseJSON(text: string | undefined, fallback: any = {}): any {
  if (!text) return fallback;
  try {
    // Strip markdown code blocks if present
    const cleanText = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", text);
    return fallback;
  }
}

export function extractDataUrl(dataUrl: string): { data: string; mimeType: string } {
  if (!dataUrl.startsWith('data:')) {
    return { data: dataUrl, mimeType: 'image/jpeg' }; // Fallback
  }
  const [header, data] = dataUrl.split(',');
  const mimeType = header.split(':')[1].split(';')[0];
  return { data, mimeType };
}
