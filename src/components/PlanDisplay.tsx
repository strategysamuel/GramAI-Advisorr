import { useState } from "react";
import { FarmingPlan } from "../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";
import { Download, TrendingUp, PieChart, Landmark, FileText, CheckCircle2, IndianRupee, Info, Map as MapIcon, X, ZoomIn, ZoomOut, Maximize, Sprout, Layers, Tractor, Bot, ListTodo, CalendarDays, StickyNote, ShieldAlert, ShoppingBag, Microscope } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface Props {
  plan: FarmingPlan;
}

export function PlanDisplay({ plan }: Props) {
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setSelectedZone(null);
  };

  // Find matching allocation for a zone if possible (by name heuristic)
  const getZoneAllocation = (zone: any) => {
    if (!zone || !plan.allocation) return undefined;
    if (zone.linked_crop_name) {
      return plan.allocation.find(a => a.crop_name === zone.linked_crop_name);
    }
    return plan.allocation.find(a => {
      if (!a.crop_name || !zone.name) return false;
      return zone.name.toLowerCase().includes(a.crop_name.toLowerCase()) || 
             a.crop_name.toLowerCase().includes(zone.name.toLowerCase());
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Demo & Confidence Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {plan.is_demo && (
          <div className="bg-amber-50 border border-amber-200 px-6 py-3 rounded-2xl flex items-center gap-3 text-amber-800 font-bold shadow-sm animate-pulse">
            <Info className="w-5 h-5 text-amber-600" />
            <span>Demo Plan (Generated due to high system load)</span>
          </div>
        )}
        {plan.confidence_score && (
          <div className={cn(
            "px-6 py-3 rounded-2xl flex items-center gap-3 font-bold shadow-sm ml-auto",
            plan.confidence_score === 'High' ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-blue-50 border border-blue-200 text-blue-800"
          )}>
            <CheckCircle2 className={cn("w-5 h-5", plan.confidence_score === 'High' ? "text-emerald-600" : "text-blue-600")} />
            <span>AI Confidence: {plan.confidence_score}</span>
          </div>
        )}
      </div>

      {/* Recommendation Reason */}
      {plan.recommendation_reason && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-emerald-50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText className="w-24 h-24 text-emerald-900" />
          </div>
          <h3 className="text-xl font-black text-emerald-900 mb-4 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            Why this plan is recommended
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed relative z-10 font-medium">
            {plan.recommendation_reason}
          </p>
        </div>
      )}

      {/* Multi-Agent Intelligence Section */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Layers className="w-32 h-32 text-emerald-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-500 p-2 rounded-xl">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Multi-Agent Intelligence</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Coordinated Reasoning Engine</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-tighter text-emerald-400">Crop Agent</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {plan.agent_outputs?.crop_agent || "Analyzing optimal crop varieties for your soil and climate."}
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <MapIcon className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-black uppercase tracking-tighter text-blue-400">Land Agent</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {plan.agent_outputs?.land_agent || "Optimizing land zoning and resource allocation."}
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-tighter text-amber-400">Finance Agent</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {plan.agent_outputs?.finance_agent || "Calculating ROI, investment needs, and credit eligibility."}
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <Landmark className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-black uppercase tracking-tighter text-purple-400">Scheme Agent</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {plan.agent_outputs?.scheme_agent || "Matching your profile with government subsidies and support."}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-black uppercase tracking-widest text-emerald-400">Orchestrator Summary</span>
            </div>
            <p className="text-slate-200 font-medium italic">
              "{plan.orchestrator_summary || "Successfully synthesized multi-agent insights into a cohesive farming strategy."}"
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-emerald-50 relative overflow-hidden">
          {plan.total_income >= plan.revenue_target && (
            <div className="absolute top-0 right-0 bg-emerald-500 text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-bl-lg shadow-sm">
              Target Met
            </div>
          )}
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Total Income</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">₹{plan.total_income.toLocaleString()}</div>
          <div className="text-sm text-emerald-600 mt-1 font-medium">Expected Annual</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-blue-50">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <IndianRupee className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Investment</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">₹{plan.total_investment.toLocaleString()}</div>
          <div className="text-sm text-blue-600 mt-1 font-medium">Estimated Cost</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-amber-50">
          <div className="flex items-center gap-3 text-amber-600 mb-2">
            <PieChart className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">ROI</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{plan.roi.toFixed(1)}%</div>
          <div className="text-sm text-amber-600 mt-1 font-medium">Return on Investment</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-purple-50">
          <div className="flex items-center gap-3 text-purple-600 mb-2">
            <Landmark className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Loan Limit</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">₹{plan.loan_eligibility.toLocaleString()}</div>
          <div className="text-sm text-purple-600 mt-1 font-medium">Eligible Credit</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Allocation Chart & Interactive Map */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-emerald-600" />
              Interactive Land Allocation Map
            </h3>
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                Zoom & Pan enabled
              </div>
            </div>
          </div>
          
          {/* Visual Land Map */}
          {plan.land_zones && (
            <div className="mb-8 space-y-6">
              <div className="relative h-96 w-full rounded-[2rem] overflow-hidden shadow-inner border-4 border-white ring-1 ring-slate-200 bg-slate-100">
                {/* Map Controls */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <button 
                    onClick={handleZoomIn}
                    className="p-2 bg-white/90 backdrop-blur shadow-md rounded-xl hover:bg-white transition-colors border border-slate-200 group"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
                  </button>
                  <button 
                    onClick={handleZoomOut}
                    className="p-2 bg-white/90 backdrop-blur shadow-md rounded-xl hover:bg-white transition-colors border border-slate-200 group"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
                  </button>
                  <button 
                    onClick={handleReset}
                    className="p-2 bg-white/90 backdrop-blur shadow-md rounded-xl hover:bg-white transition-colors border border-slate-200 group"
                    title="Reset View"
                  >
                    <Maximize className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
                  </button>
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredZone !== null && plan.land_zones?.[hoveredZone] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute top-4 right-4 z-30 pointer-events-none"
                    >
                      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/50 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.land_zones[hoveredZone].color }} />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{plan.land_zones[hoveredZone].name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium leading-tight mb-3">
                          {plan.land_zones[hoveredZone].soil_health} Soil • {plan.land_zones[hoveredZone].moisture_level} Moisture
                        </div>
                        
                        {getZoneAllocation(plan.land_zones[hoveredZone]) && (
                          <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Sprout className="w-3 h-3 text-emerald-600" />
                              <span className="text-[10px] font-black text-emerald-700 uppercase">{getZoneAllocation(plan.land_zones[hoveredZone])?.crop_name}</span>
                            </div>
                            <div className="flex justify-between text-[9px] font-bold">
                              <span className="text-slate-400 uppercase">Revenue</span>
                              <span className="text-emerald-600">₹{getZoneAllocation(plan.land_zones[hoveredZone])?.expected_revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[9px] font-bold">
                              <span className="text-slate-400 uppercase">Yield Time</span>
                              <span className="text-blue-600">{getZoneAllocation(plan.land_zones[hoveredZone])?.yield_time} Months</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div 
                  drag
                  dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                  animate={{ scale: zoom }}
                  className="w-full h-full flex items-center justify-center origin-center"
                >
                  <div className="relative inline-block max-h-full max-w-full cursor-grab active:cursor-grabbing">
                    {/* Background (Clean Base) */}
                    <div className="absolute inset-0 bg-white" />
                    
                    {/* Hidden Image for Aspect Ratio */}
                    {plan.land_image && (
                      <img 
                        src={plan.land_image} 
                        alt="Land Sketch" 
                        className="max-h-full max-w-full block opacity-0 pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {!plan.land_image && (
                      <div className="w-96 h-96 bg-white rounded-2xl" />
                    )}

                    {/* Irregular Polygon Overlays (SVG) */}
                    <svg 
                      className="absolute inset-0 w-full h-full" 
                      viewBox="0 0 100 100" 
                      preserveAspectRatio="none"
                    >
                      {plan.land_zones?.filter(z => z.points && z.points.length > 0).map((zone, idx) => (
                        <polygon
                          key={`poly-${idx}`}
                          points={zone.points?.map(p => `${p.x},${p.y}`).join(' ')}
                          fill={zone.color}
                          fillOpacity="1"
                          stroke="white"
                          strokeWidth="0.3"
                          className="transition-all duration-300"
                        />
                      ))}
                    </svg>

                    {/* Zone Interaction Overlays (Buttons) */}
                    {plan.land_zones?.map((zone, idx) => (
                      <motion.button 
                        key={idx} 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onMouseEnter={() => setHoveredZone(idx)}
                        onMouseLeave={() => setHoveredZone(null)}
                        onClick={() => setSelectedZone(idx)}
                        className={cn(
                          "absolute group overflow-hidden rounded-xl transition-all duration-300 border-2 border-white/50 shadow-lg",
                          selectedZone === idx ? "ring-4 ring-white ring-inset shadow-2xl z-10" : "opacity-60 hover:opacity-80",
                          zone.points && zone.points.length > 0 ? "opacity-0" : "" // Hide if using polygon rendering
                        )}
                        style={{ 
                          backgroundColor: zone.color,
                          left: `${zone.x}%`,
                          top: `${zone.y}%`,
                          width: `${zone.width}%`,
                          height: `${zone.height}%`
                        }}
                      >
                        {!zone.points && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-black text-white uppercase tracking-tighter">{zone.name}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Dynamic Legend & Zone Details Panel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Legend */}
                <div className="md:col-span-1 space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Map Legend</h4>
                  {plan.land_zones?.map((zone, idx) => {
                    const allocation = getZoneAllocation(zone);
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedZone(idx)}
                        className={cn(
                          "w-full flex flex-col gap-1 p-3 rounded-xl transition-all border text-left group",
                          selectedZone === idx 
                            ? "bg-white border-emerald-200 shadow-md scale-105 ring-1 ring-emerald-50" 
                            : "bg-white/50 border-slate-100 hover:bg-white hover:border-emerald-100"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-inner border border-black/5" style={{ backgroundColor: zone.color }} />
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-tight",
                            selectedZone === idx ? "text-slate-900" : "text-slate-500"
                          )}>
                            {zone.name}
                          </span>
                        </div>
                        {allocation && (
                          <div className={cn(
                            "ml-7 text-[9px] font-bold transition-all",
                            selectedZone === idx ? "text-emerald-600 opacity-100" : "text-slate-400 opacity-70 group-hover:opacity-100"
                          )}>
                            {allocation.crop_name} • ₹{allocation.expected_revenue.toLocaleString()}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Details Panel */}
                <div className="md:col-span-3">
                  <AnimatePresence mode="wait">
                    {selectedZone !== null ? (
                      <motion.div
                        key={selectedZone}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200 relative h-full"
                      >
                        <button 
                          onClick={() => setSelectedZone(null)}
                          className="absolute top-4 right-4 p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                          <div 
                            className="w-20 h-20 rounded-3xl shadow-xl flex-shrink-0 border-4 border-white" 
                            style={{ backgroundColor: plan.land_zones[selectedZone].color }} 
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-xl font-black text-slate-900">{plan.land_zones[selectedZone].name}</h4>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-md uppercase">Active Zone</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm mb-6">
                              {plan.land_zones[selectedZone].description}
                            </p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Soil Health</div>
                                <div className="text-sm font-black text-emerald-600 uppercase">{plan.land_zones[selectedZone].soil_health}</div>
                                <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-500" 
                                    style={{ width: `${plan.land_zones[selectedZone].soil_health_score}%` }} 
                                  />
                                </div>
                              </div>
                              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Moisture</div>
                                <div className="text-sm font-black text-blue-600 uppercase">{plan.land_zones[selectedZone].moisture_level}</div>
                              </div>
                              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Zone Score</div>
                                <div className="text-sm font-black text-slate-600 uppercase tracking-tight">{plan.land_zones[selectedZone].soil_health_score}/100</div>
                              </div>
                            </div>

                            {/* Linked Crop Info */}
                            {getZoneAllocation(plan.land_zones[selectedZone].name) && (
                              <div className="bg-emerald-600/5 border border-emerald-600/10 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Sprout className="w-4 h-4 text-emerald-600" />
                                  <span className="text-xs font-black text-emerald-900 uppercase">Primary Crop Analysis</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-lg font-black text-emerald-900">{getZoneAllocation(plan.land_zones[selectedZone].name)?.crop_name}</div>
                                    <div className="text-xs text-emerald-700 font-medium">{getZoneAllocation(plan.land_zones[selectedZone].name)?.acres} Acres Allocated</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-black text-emerald-900">₹{getZoneAllocation(plan.land_zones[selectedZone].name)?.expected_revenue.toLocaleString()}</div>
                                    <div className="text-xs text-emerald-700 font-medium">Est. Revenue</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 text-center h-full flex flex-col justify-center items-center bg-slate-50/50">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <MapIcon className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium text-sm italic max-w-[240px]">
                          Select a zone on the map or legend to view detailed land usage and crop optimization insights.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plan.allocation}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="crop_name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="expected_revenue" radius={[8, 8, 0, 0]}>
                  {plan.allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto mt-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Crop Name</th>
                  <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Area</th>
                  <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Revenue</th>
                  <th className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle</th>
                </tr>
              </thead>
              <tbody>
                {plan.allocation.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="font-bold text-slate-900">{item.crop_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 font-medium text-slate-600">{item.acres} Acres</td>
                    <td className="py-4 px-2 font-bold text-emerald-600">₹{item.expected_revenue.toLocaleString()}</td>
                    <td className="py-4 px-2 font-medium text-blue-600">{item.yield_time} Months</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Timeline */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            Cash Flow Timeline
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={plan.revenue_timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4 italic">
            * Monthly revenue distribution based on crop harvest cycles and livestock output.
          </p>
        </div>
      </div>

      {/* AI Agent Coordination & MCP Tool Integration */}
      {plan.mcp_tool_calls && plan.mcp_tool_calls.length > 0 && (
        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-slate-800 mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">GramAI Advisor</h3>
                <p className="text-slate-400 text-sm font-medium">Multi-Agent Orchestration & MCP Tool Integration</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Agent Reasoning */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Orchestrator Summary</h4>
                  <p className="text-slate-200 leading-relaxed italic">
                    "{plan.orchestrator_summary}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.agent_outputs && Object.entries(plan.agent_outputs).map(([agent, output], idx) => (
                    <div key={idx} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter mb-1">
                        {agent.replace('_', ' ')}
                      </div>
                      <p className="text-slate-300 text-xs leading-snug">{output}</p>
                    </div>
                  ))}
                </div>

                {plan.mcp_summary && (
                  <div className="bg-slate-800/80 border border-emerald-500/20 p-6 rounded-[2rem] mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🛠</span>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">AI Tools Activated</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-300">Task Manager</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-xs font-black text-emerald-400">{plan.mcp_summary.tasks_created} tasks created</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-300">Calendar</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-xs font-black text-blue-400">{plan.mcp_summary.events_scheduled} events scheduled</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-300">Notes</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-xs font-black text-purple-400">{plan.mcp_summary.notes_saved} plan saved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* MCP Tool Calls */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Simulated MCP Tool Calls</h4>
                {plan.mcp_tool_calls.map((call, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className={cn(
                      "p-2 rounded-xl",
                      call.tool === 'task_manager' ? "bg-amber-500/20 text-amber-400" :
                      call.tool === 'calendar' ? "bg-blue-500/20 text-blue-400" :
                      "bg-purple-500/20 text-purple-400"
                    )}>
                      {call.tool === 'task_manager' ? <ListTodo className="w-4 h-4" /> :
                       call.tool === 'calendar' ? <CalendarDays className="w-4 h-4" /> :
                       <StickyNote className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{call.tool}</span>
                        <span className="text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">Executed</span>
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {call.action}: {call.data.task || call.data.event || call.data.title}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {call.data.date || call.data.content?.substring(0, 30) + '...'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Advisory Report Section */}
      {plan.advisory_report && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-emerald-50">
            <h3 className="text-2xl font-black text-emerald-900 mb-8 flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-600" />
              12-Month Farming Strategy
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plan.advisory_report.monthly_strategy.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Month {item.month}</span>
                    <CalendarDays className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-2">{item.focus}</div>
                  <ul className="space-y-1.5">
                    {item.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Microscope className="w-20 h-20 text-blue-900" />
              </div>
              <h4 className="text-lg font-black text-blue-900 mb-4 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-blue-600" />
                Soil Management
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {plan.advisory_report.soil_management}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-red-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert className="w-20 h-20 text-red-900" />
              </div>
              <h4 className="text-lg font-black text-red-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Pest Control
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {plan.advisory_report.pest_control}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-amber-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShoppingBag className="w-20 h-20 text-amber-900" />
              </div>
              <h4 className="text-lg font-black text-amber-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                Market Linkage
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {plan.advisory_report.market_linkage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Government Schemes */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-600" />
            Recommended Schemes
          </h3>
          <div className="space-y-4">
            {plan.schemes.map((scheme, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                <div className="bg-emerald-600 p-2 rounded-xl text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-emerald-900 text-lg">{scheme.name}</div>
                  <div className="text-emerald-700 font-semibold mb-1">Subsidy: ₹{scheme.subsidy_amount.toLocaleString()}</div>
                  <div className="text-sm text-emerald-600/80">{scheme.eligibility}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Download */}
        <div className="bg-emerald-600 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Full Advisory Report
            </h3>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Download your comprehensive 12-month farming strategy, including detailed soil management, pest control schedules, and market linkage advice.
            </p>
          </div>
          <div className="mt-8">
            {plan.report_url ? (
              <a
                href={plan.report_url}
                download="GramAI_Farming_Plan.pdf"
                className="inline-flex items-center gap-3 bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-lg active:scale-95"
              >
                <Download className="w-6 h-6" />
                Download PDF Report
              </a>
            ) : (
              <div className="text-emerald-200 italic">Generating report...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
