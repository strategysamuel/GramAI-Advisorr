import { getAI, MODELS, parseJSON } from "../../lib/gemini";
import { Type } from "@google/genai";
import { CropRecommendation, LandAllocation, RevenueTimeline } from "../../types";

export async function optimizeLand(
  crops: CropRecommendation[],
  totalAcres: number,
  budget: number,
  includeLivestock: boolean,
  revenueTarget: number
): Promise<{ allocation: LandAllocation[]; revenue_timeline: RevenueTimeline[]; total_income: number }> {
  const serviceUrl = import.meta.env.VITE_OPTIMIZER_URL;
  if (serviceUrl && serviceUrl.startsWith('http')) {
    try {
      const cleanUrl = serviceUrl.replace(/\/$/, '');
      const response = await fetch(`${cleanUrl}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crops, totalAcres, budget, includeLivestock, revenueTarget }),
      });
      if (response.ok) return await response.json();
      console.warn(`Optimizer service returned ${response.status}: ${response.statusText}`);
    } catch (e) {
      console.warn("Optimizer service failed, falling back to local AI logic:", e);
    }
  }

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.FLASH,
    contents: `Optimize land allocation for ${totalAcres} acres with a budget of ${budget} and a target annual revenue of ${revenueTarget}. 
    Crops: ${JSON.stringify(crops)}. 
    Include livestock: ${includeLivestock}.
    Objective: Meet or exceed the revenue target while maximizing overall income and ensuring continuous cash flow.
    Return allocation (crop name, acres, expected revenue, yield time) and a 12-month revenue timeline.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          allocation: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                crop_name: { type: Type.STRING },
                acres: { type: Type.NUMBER },
                expected_revenue: { type: Type.NUMBER },
                yield_time: { type: Type.NUMBER },
              },
              required: ["crop_name", "acres", "expected_revenue", "yield_time"],
            },
          },
          revenue_timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.NUMBER },
                revenue: { type: Type.NUMBER },
                source: { type: Type.STRING },
              },
              required: ["month", "revenue", "source"],
            },
          },
          total_income: { type: Type.NUMBER },
        },
        required: ["allocation", "revenue_timeline", "total_income"],
      },
    },
  });

  return parseJSON(response.text);
}
