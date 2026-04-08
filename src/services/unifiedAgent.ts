import { getAI, MODELS, parseJSON, extractDataUrl } from "../lib/gemini";
import { Type } from "@google/genai";
import { FarmerProfile, LandDetails, Preferences, FarmingPlan } from "../types";
import { getRandomMockPlan } from "../constants/mockData";

export async function generateUnifiedPlan(
  profile: FarmerProfile,
  land: LandDetails,
  preferences: Preferences
): Promise<FarmingPlan> {
  try {
    const ai = getAI();
    const parts: any[] = [];

    // 1. Text Context
    const prompt = `
      You are GramAI Advisor — a multi-agent AI system with MCP (Model Context Protocol) tool integration.
      
      Your role is to act as an orchestrator coordinating multiple agents:
      - Crop Planning Agent: Recommends crops based on soil and climate.
      - Land Optimization Agent: Reconstructs land shape and allocates zones.
      - Finance Agent: Calculates investment, income, and ROI.
      - Government Scheme Agent: Identifies relevant subsidies.
      
      ---
      TASK 1: MULTI-AGENT REASONING
      Coordinate between these agents to produce a unified farming plan.
      
      TASK 2: LAND SHAPE RECONSTRUCTION (CRITICAL)
      - Extract the OUTER boundary from the sketch.
      - Reconstruct it as a clean polygon (0-100 coordinates).
      - STRICT RULE: The original sketch must NOT be visible. Reconstruct a clean parcel map.
      
      TASK 3: TRIPLE-LAYER INTEGRATED FARMING (STRICT CONSTRAINTS)
      - TOTAL LAND SIZE: The sum of acres in 'allocation' MUST EXACTLY EQUAL ${land.size_acres} acres.
      - BUDGET: The farmer has a total budget of INR ${profile.budget}. All 'total_investment' calculations MUST be within this limit.
      - REVENUE TARGET: The 'total_income' MUST BE GREATER THAN OR EQUAL TO INR ${profile.revenue_target}. This is the core priority.
      - 60-70% Land: Major traditional crop (Paddy/Wheat).
      - Livestock Zone: Dairy, Poultry, or Goat farming.
      - High-Value Zones: Vetiver, Moringa, Mushroom, Saffron, etc. to meet the revenue target.
      
      TASK 4: FULL ADVISORY REPORT (12 MONTHS)
      - Provide a month-by-month strategy for 12 months.
      - Include detailed soil management advice.
      - Include comprehensive pest control schedules.
      - Include market linkage advice (where to sell, price trends).
      
      TASK 5: MCP TOOL INTEGRATION (SIMULATED)
      Simulate usage of:
      - task_manager: Create actionable tasks (sowing, harvesting).
      - calendar: Schedule events based on crop cycles.
      - notes: Save a summary of the final plan.
      
      ---
      OUTPUT REQUIREMENTS:
      - Return ONLY a valid JSON object matching the requested schema.
      - Ensure all MCP tool calls are meaningful and relevant to the specific plan.
      - Provide a 'mcp_summary' object that accurately counts the simulated tool calls.
      - For 'land_zones', provide a 'points' array for irregular polygon reconstruction.
      - Ensure 'land_zones' areas (width/height/points) visually represent the acre distribution.
    `;
    parts.push({ text: prompt });

    // 2. Multimedia Context
    if (land.land_image) {
      const { data, mimeType } = extractDataUrl(land.land_image);
      parts.push({ text: "Analyze this land image for zoning and OCR labels:" });
      parts.push({ inlineData: { data, mimeType: mimeType || "image/jpeg" } });
    }

    if (land.soil_report) {
      const { data, mimeType } = extractDataUrl(land.soil_report);
      parts.push({ text: "Analyze this soil report for crop suitability:" });
      parts.push({ inlineData: { data, mimeType: mimeType || "image/jpeg" } });
    }

    if (profile.audio_instructions) {
      const { data, mimeType } = extractDataUrl(profile.audio_instructions);
      parts.push({ text: "Consider these audio instructions from the farmer:" });
      parts.push({ inlineData: { data, mimeType: mimeType || "audio/wav" } });
    }

    const response = await ai.models.generateContent({
      model: MODELS.PRO,
      contents: { parts },
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
            total_investment: { type: Type.NUMBER },
            roi: { type: Type.NUMBER },
            loan_eligibility: { type: Type.NUMBER },
            confidence_score: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            recommendation_reason: { type: Type.STRING },
            agent_outputs: {
              type: Type.OBJECT,
              properties: {
                crop_agent: { type: Type.STRING },
                land_agent: { type: Type.STRING },
                finance_agent: { type: Type.STRING },
                scheme_agent: { type: Type.STRING },
              },
              required: ["crop_agent", "land_agent", "finance_agent", "scheme_agent"],
            },
            orchestrator_summary: { type: Type.STRING },
            schemes: {
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
            land_zones: {
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
                  height: { type: Type.NUMBER },
                  linked_crop_name: { type: Type.STRING },
                  points: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER },
                      },
                      required: ["x", "y"],
                    },
                  },
                },
                required: ["name", "color", "description", "soil_health", "moisture_level", "soil_health_score", "x", "y", "width", "height", "linked_crop_name", "points"],
              },
            },
            mcp_tool_calls: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tool: { type: Type.STRING, enum: ["task_manager", "calendar", "notes"] },
                  action: { type: Type.STRING },
                  data: { type: Type.OBJECT },
                },
                required: ["tool", "action", "data"],
              },
            },
            mcp_summary: {
              type: Type.OBJECT,
              properties: {
                tasks_created: { type: Type.NUMBER },
                events_scheduled: { type: Type.NUMBER },
                notes_saved: { type: Type.NUMBER },
              },
              required: ["tasks_created", "events_scheduled", "notes_saved"],
            },
            advisory_report: {
              type: Type.OBJECT,
              properties: {
                monthly_strategy: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.NUMBER },
                      tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                      focus: { type: Type.STRING },
                    },
                    required: ["month", "tasks", "focus"],
                  },
                },
                soil_management: { type: Type.STRING },
                pest_control: { type: Type.STRING },
                market_linkage: { type: Type.STRING },
              },
              required: ["monthly_strategy", "soil_management", "pest_control", "market_linkage"],
            },
          },
          required: ["allocation", "revenue_timeline", "total_income", "total_investment", "roi", "loan_eligibility", "schemes", "land_zones", "confidence_score", "recommendation_reason", "agent_outputs", "orchestrator_summary", "mcp_tool_calls", "mcp_summary", "advisory_report"],
        },
      },
    });

    const result = parseJSON(response.text);
    if (!result || !result.allocation) throw new Error("Invalid AI response");

    // Land Size Consistency Check
    const totalAllocatedAcres = result.allocation.reduce((sum: number, item: any) => sum + item.acres, 0);
    const landSizeMismatch = Math.abs(totalAllocatedAcres - land.size_acres) > 0.01;
    
    if (landSizeMismatch) {
      console.warn(`Land size mismatch: Allocated ${totalAllocatedAcres} acres, but input was ${land.size_acres} acres.`);
    }

    return {
      ...result,
      farmer_uid: "ai-generated",
      timestamp: new Date().toISOString(),
      revenue_target: profile.revenue_target,
      land_image: land.land_image,
      is_demo: false,
    };
  } catch (error: any) {
    if (error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("429")) {
      console.warn("Gemini API Quota Exceeded. Falling back to demo plan.");
    } else {
      console.error("Unified Agent Error:", error);
    }
    
    // Fallback to high-quality mock data if AI fails
    return {
      ...getRandomMockPlan(),
      timestamp: new Date().toISOString(),
      revenue_target: profile.revenue_target,
      land_image: land.land_image,
      is_demo: true,
    };
  }
}
