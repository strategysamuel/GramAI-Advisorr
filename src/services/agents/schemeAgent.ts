import { Scheme, FarmerProfile, FarmingPlan, Preferences } from "../../types";
import { getAI, MODELS, parseJSON } from "../../lib/gemini";
import { Type } from "@google/genai";

export async function fetchSchemes(profile: FarmerProfile, preferences: Preferences, plan: Partial<FarmingPlan>): Promise<Scheme[]> {
  const serviceUrl = import.meta.env.VITE_SCHEME_AGENT_URL;
  if (serviceUrl && serviceUrl.startsWith('http')) {
    try {
      const cleanUrl = serviceUrl.replace(/\/$/, '');
      const response = await fetch(`${cleanUrl}/schemes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, preferences, plan }),
      });
      if (response.ok) return await response.json();
      console.warn(`Scheme service returned ${response.status}: ${response.statusText}`);
    } catch (e) {
      console.warn("Scheme service failed, falling back to local AI logic:", e);
    }
  }

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.FLASH,
    contents: `Find 3-4 Indian government schemes that support a farmer in ${profile.location} growing ${plan.allocation?.map(a => a.crop_name).join(", ")}. 
    Include livestock: ${preferences.include_livestock}.
    Provide scheme name, subsidy amount (estimate in INR), and eligibility criteria.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            subsidy_amount: { type: Type.NUMBER },
            eligibility: { type: Type.STRING },
          },
          required: ["name", "subsidy_amount", "eligibility"],
        },
      },
    },
  });

  return parseJSON(response.text, []);
}
