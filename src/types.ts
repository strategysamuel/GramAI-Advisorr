export interface FarmerProfile {
  name: string;
  location: string;
  language: string;
  risk_appetite: 'low' | 'medium' | 'high';
  budget: number;
  revenue_target: number;
  audio_instructions?: string; // base64
}

export interface LandDetails {
  size_acres: number;
  soil_type: string;
  water_availability: 'low' | 'medium' | 'high';
  land_image?: string; // base64
  soil_report?: string; // base64
}

export interface Preferences {
  include_livestock: boolean;
  interested_crops: string[];
}

export interface CropRecommendation {
  name: string;
  yield_time_months: number;
  roi_level: 'low' | 'medium' | 'high';
  water_requirement: 'low' | 'medium' | 'high';
}

export interface LandAllocation {
  crop_name: string;
  acres: number;
  expected_revenue: number;
  yield_time: number;
}

export interface RevenueTimeline {
  month: number;
  revenue: number;
  source: string;
}

export interface Scheme {
  name: string;
  subsidy_amount: number;
  eligibility: string;
}

export interface ServiceStatus {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'unknown';
  lastChecked: string;
}

export interface MCPToolCall {
  tool: 'task_manager' | 'calendar' | 'notes';
  action: string;
  data: any;
}

export interface MonthlyStrategy {
  month: number;
  tasks: string[];
  focus: string;
}

export interface AdvisoryReport {
  monthly_strategy: MonthlyStrategy[];
  soil_management: string;
  pest_control: string;
  market_linkage: string;
}

export interface FarmingPlan {
  id?: string;
  farmer_uid: string;
  timestamp: string;
  allocation: LandAllocation[];
  revenue_timeline: RevenueTimeline[];
  total_income: number;
  total_investment: number;
  roi: number;
  loan_eligibility: number;
  schemes: Scheme[];
  report_url?: string;
  land_zones?: { 
    name: string; 
    color: string; 
    description: string; 
    soil_health: string; 
    moisture_level: string; 
    soil_health_score: number;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage 0-100
    height: number; // percentage 0-100
    linked_crop_name?: string;
    points?: { x: number; y: number }[]; // For irregular polygons
  }[];
  revenue_target: number;
  land_image?: string; // stored for history
  is_demo?: boolean;
  confidence_score?: 'High' | 'Medium' | 'Low';
  recommendation_reason?: string;
  agent_outputs?: {
    crop_agent: string;
    land_agent: string;
    finance_agent: string;
    scheme_agent: string;
  };
  orchestrator_summary?: string;
  mcp_tool_calls?: MCPToolCall[];
  mcp_summary?: {
    tasks_created: number;
    events_scheduled: number;
    notes_saved: number;
  };
  advisory_report?: AdvisoryReport;
}
