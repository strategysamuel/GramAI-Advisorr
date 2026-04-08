import { getAI, MODELS, parseJSON, extractDataUrl } from "../../lib/gemini";
import { Type } from "@google/genai";
import { FarmerProfile, LandDetails, Preferences, CropRecommendation } from "../../types";

export async function recommendCrops(
  profile: FarmerProfile,
  land: LandDetails,
  preferences: Preferences
): Promise<CropRecommendation[]> {
  const serviceUrl = import.meta.env.VITE_CROP_AGENT_URL;
  if (serviceUrl && serviceUrl.startsWith('http')) {
    try {
      const cleanUrl = serviceUrl.replace(/\/$/, '');
      const response = await fetch(`${cleanUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, land, preferences }),
      });
      if (response.ok) return await response.json();
      console.warn(`Crop service returned ${response.status}: ${response.statusText}`);
    } catch (e) {
      console.warn("Crop service failed, falling back to local AI logic:", e);
    }
  }

  const parts: any[] = [
    { text: `Recommend 5 suitable crops for a farmer in ${profile.location} with ${land.soil_type} soil and ${land.water_availability} water availability. 
    Risk appetite: ${profile.risk_appetite}. 
    Interested crops: ${preferences.interested_crops.join(", ")}.` }
  ];

  if (profile.audio_instructions) {
    const { data, mimeType } = extractDataUrl(profile.audio_instructions);
    parts.push({ text: "The farmer also provided these audio instructions (transcribed):" });
    parts.push({ inlineData: { data, mimeType: mimeType || "audio/wav" } });
  }

  if (land.soil_report) {
    const { data, mimeType } = extractDataUrl(land.soil_report);
    parts.push({ text: "Here is a soil report for analysis:" });
    parts.push({ inlineData: { data, mimeType: mimeType || "image/jpeg" } });
  }

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.FLASH,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            yield_time_months: { type: Type.NUMBER },
            roi_level: { type: Type.STRING, enum: ["low", "medium", "high"] },
            water_requirement: { type: Type.STRING, enum: ["low", "medium", "high"] },
          },
          required: ["name", "yield_time_months", "roi_level", "water_requirement"],
        },
      },
    },
  });

  return parseJSON(response.text, []);
}
