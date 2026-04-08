import { FarmingPlan } from "../types";

export const MOCK_PLANS: FarmingPlan[] = [
  {
    farmer_uid: "demo-user",
    timestamp: new Date().toISOString(),
    allocation: [
      { crop_name: "Paddy (Traditional)", acres: 3.5, expected_revenue: 140000, yield_time: 4 },
      { crop_name: "Dairy (3 Cows)", acres: 0.5, expected_revenue: 120000, yield_time: 1 },
      { crop_name: "Vetiver (Vettiveru)", acres: 0.5, expected_revenue: 150000, yield_time: 12 },
      { crop_name: "Moringa", acres: 0.5, expected_revenue: 200000, yield_time: 6 }
    ],
    revenue_timeline: [
      { month: 1, revenue: 10000, source: "Milk Sales" },
      { month: 4, revenue: 140000, source: "Paddy Harvest" },
      { month: 6, revenue: 200000, source: "Moringa Harvest" },
      { month: 12, revenue: 150000, source: "Vetiver Harvest" }
    ],
    total_income: 610000,
    total_investment: 240000,
    roi: 254,
    loan_eligibility: 360000,
    schemes: [
      { name: "PM-Kisan Samman Nidhi", subsidy_amount: 6000, eligibility: "Small/Marginal Farmers" },
      { name: "National Livestock Mission", subsidy_amount: 100000, eligibility: "Dairy Setup" },
      { name: "RKVY - Raftar", subsidy_amount: 50000, eligibility: "High-value crops" }
    ],
    land_zones: [
      { name: "Plot A: Traditional Paddy", color: "#10b981", description: "Major crop (60% land)", soil_health: "Excellent", moisture_level: "High", soil_health_score: 92, x: 0, y: 0, width: 60, height: 100, linked_crop_name: "Paddy (Traditional)", points: [{x: 0, y: 0}, {x: 60, y: 0}, {x: 60, y: 100}, {x: 0, y: 100}] },
      { name: "Plot B: Dairy Unit", color: "#3b82f6", description: "Integrated livestock", soil_health: "Fair", moisture_level: "Moderate", soil_health_score: 70, x: 60, y: 0, width: 40, height: 30, linked_crop_name: "Dairy (3 Cows)", points: [{x: 60, y: 0}, {x: 100, y: 0}, {x: 100, y: 30}, {x: 60, y: 30}] },
      { name: "Plot C: Vetiver Zone", color: "#f59e0b", description: "High-value cash crop", soil_health: "Good", moisture_level: "Moderate", soil_health_score: 82, x: 60, y: 30, width: 40, height: 35, linked_crop_name: "Vetiver (Vettiveru)", points: [{x: 60, y: 30}, {x: 100, y: 30}, {x: 100, y: 65}, {x: 60, y: 65}] },
      { name: "Plot D: Moringa Zone", color: "#8b5cf6", description: "High-value cash crop", soil_health: "Good", moisture_level: "Moderate", soil_health_score: 75, x: 60, y: 65, width: 40, height: 35, linked_crop_name: "Moringa", points: [{x: 60, y: 65}, {x: 100, y: 65}, {x: 100, y: 100}, {x: 60, y: 100}] }
    ],
    confidence_score: 'High',
    recommendation_reason: "Triple-layer model: Paddy for food security, Dairy for daily cash, and Vetiver/Moringa for high bulk revenue.",
    agent_outputs: {
      crop_agent: "Selected Paddy as major crop and Vetiver/Moringa for high ROI.",
      land_agent: "Zoned land to maximize traditional crop area while integrating livestock.",
      finance_agent: "Optimized for a 254% ROI with diversified revenue streams.",
      scheme_agent: "Identified livestock and high-value crop subsidies."
    },
    orchestrator_summary: "Coordinated Triple-Layer strategy: Traditional paddy ensures stability, dairy provides liquidity, and high-value crops maximize profit.",
    revenue_target: 500000,
    mcp_tool_calls: [
      {
        tool: "task_manager",
        action: "create_task",
        data: { task: "Sow Paddy (Traditional)", date: "2026-06-15" }
      },
      {
        tool: "calendar",
        action: "schedule_event",
        data: { event: "Harvest Moringa", date: "2026-12-01" }
      },
      {
        tool: "notes",
        action: "save_note",
        data: { title: "Integrated Farm Summary", content: "Triple-layer model implemented with 60% Paddy, 10% Dairy, and 30% High-value crops." }
      }
    ],
    mcp_summary: {
      tasks_created: 1,
      events_scheduled: 1,
      notes_saved: 1
    },
    advisory_report: {
      monthly_strategy: [
        { month: 1, focus: "Land Preparation & Sowing", tasks: ["Deep plowing", "Soil testing", "Sowing Paddy"] },
        { month: 2, focus: "Weed Management", tasks: ["Manual weeding", "Fertilizer application"] },
        { month: 3, focus: "Pest Monitoring", tasks: ["Check for stem borer", "Maintain water level"] },
        { month: 4, focus: "Harvest Preparation", tasks: ["Drain field", "Prepare storage"] },
        { month: 5, focus: "Post-Harvest & Next Crop", tasks: ["Harvest Paddy", "Sow Moringa"] },
        { month: 6, focus: "Moringa Maintenance", tasks: ["Pruning", "Organic manure application"] },
        { month: 7, focus: "Livestock Expansion", tasks: ["Vaccination drive", "Fodder storage"] },
        { month: 8, focus: "Monsoon Management", tasks: ["Drainage check", "Mulching"] },
        { month: 9, focus: "High-value Crop Care", tasks: ["Vetiver planting", "Drip irrigation check"] },
        { month: 10, focus: "Pest Control", tasks: ["Neem oil spray", "Pheromone traps"] },
        { month: 11, focus: "Market Linkage", tasks: ["Contact local mandis", "Quality grading"] },
        { month: 12, focus: "Final Harvest & ROI", tasks: ["Harvest Vetiver", "Year-end accounting"] }
      ],
      soil_management: "Implement green manuring and crop rotation. Use vermicompost to improve soil structure and moisture retention.",
      pest_control: "Focus on Integrated Pest Management (IPM). Use neem-based biopesticides and light traps to minimize chemical usage.",
      market_linkage: "Connect with local FPOs (Farmer Producer Organizations) for bulk sales. Use e-NAM platform for competitive pricing."
    }
  },
  {
    farmer_uid: "demo-user",
    timestamp: new Date().toISOString(),
    allocation: [
      { crop_name: "Cotton (Bt)", acres: 3, expected_revenue: 350000, yield_time: 6 },
      { crop_name: "Maize", acres: 1.5, expected_revenue: 90000, yield_time: 4 },
      { crop_name: "Poultry (500 Birds)", acres: 0.5, expected_revenue: 150000, yield_time: 2 }
    ],
    revenue_timeline: [
      { month: 2, revenue: 50000, source: "Poultry Sales" },
      { month: 4, revenue: 140000, source: "Maize & Poultry" },
      { month: 6, revenue: 350000, source: "Cotton Harvest" }
    ],
    total_income: 590000,
    total_investment: 200000,
    roi: 295,
    loan_eligibility: 300000,
    schemes: [
      { name: "RKVY - Raftar", subsidy_amount: 40000, eligibility: "Agri-infrastructure" },
      { name: "Crop Insurance (PMFBY)", subsidy_amount: 15000, eligibility: "Cotton/Maize farmers" }
    ],
    land_zones: [
      { name: "Zone 1: Dry Plateau", color: "#f59e0b", description: "Cotton cultivation", soil_health: "Good", moisture_level: "Low", soil_health_score: 85, x: 0, y: 0, width: 60, height: 60, linked_crop_name: "Cotton (Bt)", points: [{x: 0, y: 0}, {x: 60, y: 0}, {x: 60, y: 60}, {x: 0, y: 60}] },
      { name: "Zone 2: Lowland", color: "#10b981", description: "Maize field", soil_health: "Excellent", moisture_level: "High", soil_health_score: 90, x: 60, y: 0, width: 40, height: 60, linked_crop_name: "Maize", points: [{x: 60, y: 0}, {x: 100, y: 0}, {x: 100, y: 60}, {x: 60, y: 60}] },
      { name: "Zone 3: Utility Area", color: "#ef4444", description: "Poultry farm", soil_health: "N/A", moisture_level: "Low", soil_health_score: 50, x: 0, y: 60, width: 100, height: 40, linked_crop_name: "Poultry (500 Birds)", points: [{x: 0, y: 60}, {x: 100, y: 60}, {x: 100, y: 100}, {x: 0, y: 100}] }
    ],
    confidence_score: 'Medium',
    recommendation_reason: "High-yield commercial plan focusing on cotton with poultry for risk diversification.",
    agent_outputs: {
      crop_agent: "Commercial focus on Cotton and Maize for established market links.",
      land_agent: "Allocated dry zones to cotton and moisture-rich areas to maize.",
      finance_agent: "Strong ROI driven by poultry turnover and cotton bulk.",
      scheme_agent: "Focused on infrastructure and insurance schemes."
    },
    orchestrator_summary: "Balanced commercial strategy: Poultry provides early cash flow to support cotton inputs.",
    revenue_target: 500000,
    mcp_tool_calls: [
      {
        tool: "task_manager",
        action: "create_task",
        data: { task: "Sow Cotton (Bt)", date: "2026-05-20" }
      },
      {
        tool: "calendar",
        action: "schedule_event",
        data: { event: "Poultry Batch 1 Arrival", date: "2026-06-01" }
      },
      {
        tool: "notes",
        action: "save_note",
        data: { title: "Commercial Strategy", content: "Focus on Bt Cotton for bulk revenue and Poultry for short-term liquidity." }
      }
    ],
    mcp_summary: {
      tasks_created: 1,
      events_scheduled: 1,
      notes_saved: 1
    },
    advisory_report: {
      monthly_strategy: [
        { month: 1, focus: "Poultry Setup", tasks: ["Clean shed", "Order chicks", "Buy feed"] },
        { month: 2, focus: "Cotton Sowing", tasks: ["Seed treatment", "Sow Cotton", "Irrigate"] },
        { month: 3, focus: "Maize Care", tasks: ["Fertilize Maize", "Check for pests"] },
        { month: 4, focus: "Poultry Harvest", tasks: ["Sell first batch", "Sanitize shed"] },
        { month: 5, focus: "Cotton Weeding", tasks: ["Manual weeding", "Top dressing"] },
        { month: 6, focus: "Maize Harvest", tasks: ["Harvest Maize", "Dry and store"] },
        { month: 7, focus: "Cotton Pest Control", tasks: ["Spray for bollworm", "Monitor traps"] },
        { month: 8, focus: "Poultry Batch 2", tasks: ["New batch arrival", "Vaccination"] },
        { month: 9, focus: "Cotton Maturation", tasks: ["Reduce water", "Check boll opening"] },
        { month: 10, focus: "Cotton Picking", tasks: ["First picking", "Grade quality"] },
        { month: 11, focus: "Market Linkage", tasks: ["Transport to ginning mill", "Negotiate price"] },
        { month: 12, focus: "Field Cleanup", tasks: ["Remove stalks", "Prepare for next season"] }
      ],
      soil_management: "Apply gypsum to improve soil structure. Maintain soil organic matter through crop residue management.",
      pest_control: "Use pheromone traps for cotton bollworm. Implement biological control for poultry pests.",
      market_linkage: "Direct linkage with ginning mills for cotton. Local wholesale market for poultry and maize."
    }
  }
];

export const getRandomMockPlan = (): FarmingPlan => {
  const plan = MOCK_PLANS[Math.floor(Math.random() * MOCK_PLANS.length)];
  return { ...plan, timestamp: new Date().toISOString() };
};

export const MOCK_PLAN = MOCK_PLANS[0];
