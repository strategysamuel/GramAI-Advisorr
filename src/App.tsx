import { useState, useEffect } from "react";
import { Auth } from "./components/Auth";
import { FarmerForm } from "./components/FarmerForm";
import { PlanDisplay } from "./components/PlanDisplay";
import { CloudStatus } from "./components/CloudStatus";
import { generateFullPlan } from "./services/agents/orchestrator";
import { FarmerProfile, LandDetails, Preferences, FarmingPlan } from "./types";
import { auth, db } from "./lib/firebase";
import { collection, query, where, orderBy, onSnapshot, getDocFromServer, doc } from "firebase/firestore";
import { Tractor, History, LayoutDashboard, ChevronRight, AlertCircle, Cloud, WifiOff } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<FarmingPlan | null>(null);
  const [history, setHistory] = useState<FarmingPlan[]>([]);
  const [view, setView] = useState<'form' | 'plan' | 'history' | 'cloud'>('form');
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setQuotaExceeded(false);
      setError(null);
    }
  };

  useEffect(() => {
    async function testConnection() {
      try {
        const dbId = (db as any)._databaseId?.database || "unknown";
        console.log("Testing Firestore connection to database:", dbId);
        // Use a collection that we know exists or at least should be accessible
        await getDocFromServer(doc(db, 'plans', 'connection-test'));
        console.log("Firestore connection test successful.");
        setIsOffline(false);
      } catch (error: any) {
        console.error("Firestore Connection Test Failed:", error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        
        if (errorMsg.includes('the client is offline') || 
            errorMsg.includes('api-key-not-valid')) {
          console.warn("Firestore is considered offline/inaccessible due to:", errorMsg);
          setIsOffline(true);
        } else {
          setIsOffline(false);
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (!u) {
        setHistory([]);
        setCurrentPlan(null);
        setView('form');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "plans"),
        where("farmer_uid", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FarmingPlan));
        setHistory(plans);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleGenerate = async (profile: FarmerProfile, land: LandDetails, preferences: Preferences) => {
    if (!user) {
      setError("Please sign in to generate a plan.");
      return;
    }
    setLoading(true);
    setError(null);
    setQuotaExceeded(false);
    try {
      const plan = await generateFullPlan(profile, land, preferences);
      setCurrentPlan(plan);
      setView('plan');
      
      // If we got a demo plan, it might be because of a quota issue
      // We check if there was a recent quota error logged (we can't easily check the catch block of unifiedAgent from here)
      // But we can check if the plan is a demo plan
      if (plan.is_demo) {
        setQuotaExceeded(true);
        setError("The AI service is currently at capacity. Showing a demo plan instead.");
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Plan Generation Error:", err);
      let message = "We encountered an issue generating your custom plan. Please check your connection or try again later.";
      
      if (err.message?.includes("RESOURCE_EXHAUSTED") || err.message?.includes("429") || err.message?.includes("spending cap")) {
        setQuotaExceeded(true);
        message = "The AI service is currently at capacity. You can continue by selecting your own API key.";
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-emerald-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl shadow-inner">
              <Tractor className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none">GramAI</h1>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-1">Advisor System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-1 bg-emerald-800/50 p-1 rounded-full border border-emerald-600/50">
              <button 
                onClick={() => setView('form')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  view === 'form' ? "bg-white text-emerald-700 shadow-md" : "text-emerald-100 hover:bg-white/10"
                )}
              >
                New Plan
              </button>
              <button 
                onClick={() => setView('history')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  view === 'history' ? "bg-white text-emerald-700 shadow-md" : "text-emerald-100 hover:bg-white/10"
                )}
              >
                History
              </button>
              <button 
                onClick={() => setView('cloud')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  view === 'cloud' ? "bg-white text-emerald-700 shadow-md" : "text-emerald-100 hover:bg-white/10"
                )}
              >
                System
              </button>
            </nav>
            <Auth />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {isOffline && (
          <div className="mb-8 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700 animate-in fade-in slide-in-from-top-2">
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold">Database Connection Issue</p>
              <p className="text-sm">The application is having trouble connecting to Firestore. This might be due to an incorrect Firebase configuration or network issues.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 p-6 rounded-[2rem] flex flex-col items-center gap-4 text-center animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-red-700 font-bold">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p className="text-lg">{error}</p>
            </div>
            {quotaExceeded && (
              <div className="space-y-4 pt-2 border-t border-red-100 w-full max-w-lg">
                <p className="text-sm text-red-600">
                  The AI service has reached its usage limit for the shared key. 
                  To continue generating plans, please select your own Gemini API key.
                </p>
                <button
                  onClick={handleSelectKey}
                  className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 active:scale-95"
                >
                  Select Your API Key
                </button>
                <p className="text-xs text-gray-400">
                  You can get a key at <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500">ai.google.dev</a>
                </p>
              </div>
            )}
          </div>
        )}

        {!user ? (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50">
            <div className="max-w-md mx-auto px-6">
              <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <Tractor className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Smart Farming Starts Here</h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Connect your account to access personalized AI-driven farming strategies, financial planning, and government subsidies.
              </p>
              <Auth />
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {view === 'form' && (
              <div className="max-w-4xl mx-auto">
                <FarmerForm onSubmit={handleGenerate} loading={loading} />
              </div>
            )}

            {view === 'plan' && currentPlan && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Your Custom Strategy</h2>
                  <button 
                    onClick={() => setView('form')}
                    className="text-emerald-600 font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Generate Another <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <PlanDisplay plan={currentPlan} />
              </div>
            )}

            {view === 'history' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <History className="w-8 h-8 text-emerald-600" />
                  Previous Plans
                </h2>
                {history.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No plans generated yet.</p>
                    <button 
                      onClick={() => setView('form')}
                      className="mt-4 text-emerald-600 font-bold hover:underline"
                    >
                      Create your first plan
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((plan) => (
                      <div 
                        key={plan.id} 
                        className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
                        onClick={() => {
                          setCurrentPlan(plan);
                          setView('plan');
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <LayoutDashboard className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(plan.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Plan for {plan.allocation[0]?.crop_name} & more
                        </h3>
                        <div className="flex items-center justify-between mt-6">
                          <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Income</div>
                            <div className="text-lg font-black text-emerald-600">₹{plan.total_income.toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ROI</div>
                            <div className="text-lg font-black text-amber-500">{plan.roi.toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {view === 'cloud' && (
              <div className="max-w-5xl mx-auto">
                <CloudStatus />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-40">
            <Tractor className="w-6 h-6" />
            <span className="font-black tracking-tighter text-xl">GramAI</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">
            &copy; 2026 GramAI Advisor System. Empowering farmers with intelligent data.
          </p>
        </div>
      </footer>
    </div>
  );
}
