import { LandDetails } from "../../types";
import { getAI, MODELS, parseJSON, extractDataUrl } from "../../lib/gemini";
import { Type } from "@google/genai";

export async function analyzeLand(land: LandDetails): Promise<{ zones: { name: string; color: string; description: string; soil_health: string; moisture_level: string; soil_health_score: number; x: number; y: number; width: number; height: number }[]; usable_acres: number }> {
  const serviceUrl = import.meta.env.VITE_LAND_AGENT_URL;
  if (serviceUrl && serviceUrl.startsWith('http')) {
    try {
      const cleanUrl = serviceUrl.replace(/\/$/, '');
      const response = await fetch(`${cleanUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ land }),
      });
      if (response.ok) return await response.json();
      console.warn(`Land service returned ${response.status}: ${response.statusText}`);
    } catch (e) {
      console.warn("Land service failed, falling back to local AI logic:", e);
    }
  }

  if (!land.land_image) {
    return {
      zones: [
        { name: "Irrigated North", color: "#10b981", description: "High moisture area", soil_health: "Excellent", moisture_level: "High", soil_health_score: 92, x: 0, y: 0, width: 100, height: 33 },
        { name: "Dry South-East", color: "#f59e0b", description: "Well-drained soil", soil_health: "Good", moisture_level: "Low", soil_health_score: 78, x: 50, y: 33, width: 50, height: 67 },
        { name: "Livestock Pasture", color: "#3b82f6", description: "Grazing area", soil_health: "Fair", moisture_level: "Moderate", soil_health_score: 65, x: 0, y: 33, width: 50, height: 67 }
      ],
      usable_acres: land.size_acres * 0.95,
    };
  }

  const { data, mimeType } = extractDataUrl(land.land_image);

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.FLASH,
    contents: {
      parts: [
        { text: "Analyze this land sketch/image for farming. Perform OCR on any text or labels. Identify the outlines of the land and segregate it into 3-4 distinct zones for different crops or livestock based on the sketch's visual cues (e.g., drawn boundaries, labels). For each zone, provide a name, a hex color code, a brief description, soil assessment, moisture level, and a score. CRITICAL: Provide spatial coordinates (x, y, width, height as percentages 0-100) for where this zone is located on the image so it can be overlaid accurately." },
        { inlineData: { data, mimeType: mimeType || "image/jpeg" } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          zones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                color: { type: Type.STRING },
                description: { type: Type.STRING },
                soil_health: { type: Type.STRING },
                moisture_level: { type: Type.STRING },
                soil_health_score: { type: Type.NUMBER },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                width: { type: Type.NUMBER },
                height: { type: Type.NUMBER }
              },
              required: ["name", "color", "description", "soil_health", "moisture_level", "soil_health_score", "x", "y", "width", "height"]
            }
          },
          usable_percentage: { type: Type.NUMBER }
        },
        required: ["zones", "usable_percentage"]
      }
    }
  });

  const result = parseJSON(response.text);
  return {
    zones: result.zones || [],
    usable_acres: land.size_acres * (result.usable_percentage / 100 || 0.95),
  };
}
