import { useState, useEffect } from "react";
import { Cloud, CheckCircle2, XCircle, RefreshCw, ExternalLink, Activity } from "lucide-react";
import { ServiceStatus } from "../types";
import { cn } from "../lib/utils";

const SERVICES = [
  { id: "crop-agent", name: "Crop Agent Service", env: "VITE_CROP_AGENT_URL" },
  { id: "land-agent", name: "Land Agent Service", env: "VITE_LAND_AGENT_URL" },
  { id: "finance-agent", name: "Finance Agent Service", env: "VITE_FINANCE_AGENT_URL" },
  { id: "land-optimizer", name: "Land Optimizer Service", env: "VITE_OPTIMIZER_URL" },
  { id: "orchestrator", name: "Orchestrator Service", env: "VITE_ORCHESTRATOR_URL" },
  { id: "scheme-agent", name: "Scheme Agent Service", env: "VITE_SCHEME_AGENT_URL" },
  { id: "document-agent", name: "Document Agent Service", env: "VITE_DOCUMENT_AGENT_URL" },
];

export function CloudStatus() {
  const [statuses, setStatuses] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const checkStatuses = async () => {
    setLoading(true);
    const newStatuses: ServiceStatus[] = await Promise.all(
      SERVICES.map(async (service) => {
        const url = import.meta.env[service.env] || "";
        let status: 'online' | 'offline' | 'unknown' = 'unknown';

        if (url) {
          try {
            // Try to fetch a health endpoint or just the root
            const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
            // With no-cors, we can't see the status code, but if it doesn't throw, it's likely reachable
            status = 'online';
          } catch (e) {
            status = 'offline';
          }
        }

        return {
          name: service.name,
          url,
          status,
          lastChecked: new Date().toLocaleTimeString(),
        };
      })
    );
    setStatuses(newStatuses);
    setLoading(false);
  };

  useEffect(() => {
    checkStatuses();
    const interval = setInterval(checkStatuses, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden">
      <div className="bg-slate-900 p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/20 p-3 rounded-2xl">
              <Cloud className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Cloud Infrastructure</h2>
              <p className="text-slate-400 text-sm font-medium">Microservices Status Monitor</p>
            </div>
          </div>
          <button 
            onClick={checkStatuses}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn("w-6 h-6", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statuses.map((service, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  service.status === 'online' ? "bg-emerald-100 text-emerald-600" : 
                  service.status === 'offline' ? "bg-red-100 text-red-600" : "bg-slate-200 text-slate-400"
                )}>
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{service.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                      service.status === 'online' ? "bg-emerald-500 text-white" : 
                      service.status === 'offline' ? "bg-red-500 text-white" : "bg-slate-400 text-white"
                    )}>
                      {service.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      Checked at {service.lastChecked}
                    </span>
                  </div>
                </div>
              </div>
              
              {service.url ? (
                <a 
                  href={service.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white shadow-sm rounded-xl text-slate-400 hover:text-emerald-600 hover:shadow-md transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              ) : (
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Not Configured
                </div>
              )}
            </div>
          ))}
        </div>

        {!statuses.some(s => s.url) && (
          <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
            <div className="bg-amber-500 text-white p-2 rounded-xl mt-1">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900">Configuration Required</h4>
              <p className="text-sm text-amber-700 leading-relaxed mt-1">
                To enable remote microservices, please provide the Cloud Run service URLs in the application secrets. 
                The application will automatically switch to cloud-native mode once configured.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
