import { useState, useRef, useEffect } from "react";
import { FarmerProfile, LandDetails, Preferences } from "../types";
import { User, MapPin, Sprout, Droplets, Wallet, Layers, Tractor, Mic, MicOff, Camera, FileText, X, CheckCircle2, Play, Pause, TrendingUp, Volume2 } from "lucide-react";
import { cn } from "../lib/utils";
import { getTranslation } from "../constants/translations";

interface Props {
  onSubmit: (profile: FarmerProfile, land: LandDetails, preferences: Preferences) => void;
  loading: boolean;
}

const LANGUAGES = [
  { name: "English", code: "en-IN" },
  { name: "Hindi (हिन्दी)", code: "hi-IN" },
  { name: "Tamil (தமிழ்)", code: "ta-IN" },
  { name: "Telugu (తెలుగు)", code: "te-IN" },
  { name: "Kannada (ಕನ್ನಡ)", code: "kn-IN" },
  { name: "Malayalam (മലയാളം)", code: "ml-IN" },
  { name: "Marathi (मराठी)", code: "mr-IN" },
  { name: "Bengali (বাংলা)", code: "bn-IN" },
  { name: "Gujarati (ગુજરાતી)", code: "gu-IN" },
];

// Helper component for voice input/output on each field
function VoiceField({ 
  label, 
  instruction, 
  onResult, 
  langCode = "en-IN" 
}: { 
  label: string; 
  instruction: string; 
  onResult: (val: string) => void;
  langCode?: string;
}) {
  const [isListening, setIsListening] = useState(false);
  const t = getTranslation(langCode);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(instruction);
    utterance.lang = langCode;
    window.speechSynthesis.speak(utterance);
  };

  const listen = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langCode;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.start();
  };

  return (
    <div className="flex items-center gap-1.5 mb-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <button 
        type="button" 
        onClick={speak}
        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
        title="Hear instruction"
      >
        <Volume2 className="w-3 h-3" />
      </button>
      <button 
        type="button" 
        onClick={listen}
        className={cn(
          "p-1 rounded-full transition-all",
          isListening ? "bg-red-500 text-white animate-pulse" : "text-emerald-600 hover:bg-emerald-50"
        )}
        title="Speak input"
      >
        <Mic className="w-3 h-3" />
      </button>
    </div>
  );
}

export function FarmerForm({ onSubmit, loading }: Props) {
  const [profile, setProfile] = useState<FarmerProfile>({
    name: "",
    location: "",
    language: "en-IN",
    risk_appetite: "medium",
    budget: 50000,
    revenue_target: 200000,
  });
  const t = getTranslation(profile.language);

  const [land, setLand] = useState<LandDetails>({
    size_acres: 5,
    soil_type: "",
    water_availability: "medium",
  });

  const [preferences, setPreferences] = useState<Preferences>({
    include_livestock: true,
    interested_crops: [],
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'land_image' | 'soil_report') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setLand(prev => ({ ...prev, [field]: reader.result as string }));
      };
    }
  };

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cropInput, setCropInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const COMMON_CROPS = [
    "Vetiver (Vettiveru)", "Moringa", "Saffron", "Mushroom", "Sandalwood", 
    "Vanilla", "Dragon Fruit", "Stevia", "Lavender", "Agarwood", "Bamboo", 
    "Ginseng", "Turmeric (Organic)", "Ginger", "Aloe Vera", "Ashwagandha",
    "Paddy (Traditional)", "Wheat (Traditional)", "Maize", "Cotton", "Sugarcane"
  ];

  useEffect(() => {
    if (cropInput.trim()) {
      const filtered = COMMON_CROPS.filter(c => 
        c.toLowerCase().includes(cropInput.toLowerCase()) && 
        !preferences.interested_crops.includes(c)
      ).slice(0, 10);
      setSuggestions(filtered);
    } else {
      // Show all available common crops that aren't already selected
      setSuggestions(COMMON_CROPS.filter(c => !preferences.interested_crops.includes(c)));
    }
  }, [cropInput, preferences.interested_crops]);

  const addCrop = (cropName?: string) => {
    const cropToAdd = cropName || cropInput;
    if (cropToAdd && !preferences.interested_crops.includes(cropToAdd)) {
      setPreferences({ ...preferences, interested_crops: [...preferences.interested_crops, cropToAdd] });
      setCropInput("");
      setSuggestions([]);
    }
  };

  const removeCrop = (crop: string) => {
    setPreferences({ ...preferences, interested_crops: preferences.interested_crops.filter((c) => c !== crop) });
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-50 overflow-hidden">
      <div className="bg-emerald-600 p-8 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Tractor className="w-8 h-8" />
          {t.labels.headerTitle}
        </h2>
        <p className="text-emerald-100 mt-2">{t.labels.headerDesc}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(profile, land, preferences);
        }}
        className="p-8 space-y-8"
      >
        {/* Empowerment Caption */}
        <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100 flex items-center justify-center">
          <p className="text-xl md:text-2xl font-bold text-emerald-800 text-center leading-tight">
            "Empowering Farmers with Smarter Income Decisions"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-900 flex items-center gap-2 border-b border-emerald-100 pb-2">
              <User className="w-5 h-5" /> {t.labels.personalInfo}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.labels.preferredLanguage}</label>
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <VoiceField 
                  label={t.labels.fullName} 
                  instruction={t.instructions.fullName} 
                  onResult={(val) => setProfile({ ...profile, name: val })}
                  langCode={profile.language}
                />
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  placeholder={t.labels.namePlaceholder}
                />
              </div>
              <div>
                <VoiceField 
                  label={t.labels.location} 
                  instruction={t.instructions.location} 
                  onResult={(val) => setProfile({ ...profile, location: val })}
                  langCode={profile.language}
                />
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    placeholder={t.labels.locationPlaceholder}
                  />
                </div>
              </div>
              <div>
                <VoiceField 
                  label={t.labels.riskAppetite} 
                  instruction={t.instructions.riskAppetite} 
                  onResult={(val) => {
                    const v = val.toLowerCase();
                    if (v.includes('low')) setProfile({ ...profile, risk_appetite: 'low' });
                    else if (v.includes('high')) setProfile({ ...profile, risk_appetite: 'high' });
                    else setProfile({ ...profile, risk_appetite: 'medium' });
                  }}
                  langCode={profile.language}
                />
                <select
                  value={profile.risk_appetite}
                  onChange={(e) => setProfile({ ...profile, risk_appetite: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                >
                  <option value="low">{t.options.risk.low}</option>
                  <option value="medium">{t.options.risk.medium}</option>
                  <option value="high">{t.options.risk.high}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <VoiceField 
                    label={t.labels.budget} 
                    instruction={t.instructions.budget} 
                    onResult={(val) => {
                      const num = parseInt(val.replace(/[^0-9]/g, ''));
                      if (!isNaN(num)) setProfile({ ...profile, budget: num });
                    }}
                    langCode={profile.language}
                  />
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      value={profile.budget}
                      onChange={(e) => setProfile({ ...profile, budget: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <VoiceField 
                    label={t.labels.revenueTarget} 
                    instruction={t.instructions.revenueTarget} 
                    onResult={(val) => {
                      const num = parseInt(val.replace(/[^0-9]/g, ''));
                      if (!isNaN(num)) setProfile({ ...profile, revenue_target: num });
                    }}
                    langCode={profile.language}
                  />
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      value={profile.revenue_target}
                      onChange={(e) => setProfile({ ...profile, revenue_target: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-emerald-50/30"
                    />
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">* Primary planning driver</p>
                </div>
              </div>
            </div>
          </div>

          {/* Land Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-900 flex items-center gap-2 border-b border-emerald-100 pb-2">
              <Layers className="w-5 h-5" /> {t.labels.landDetails}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <VoiceField 
                    label={t.labels.landSize} 
                    instruction={t.instructions.landSize} 
                    onResult={(val) => {
                      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
                      if (!isNaN(num)) setLand({ ...land, size_acres: num });
                    }}
                    langCode={profile.language}
                  />
                  <input
                    type="number"
                    required
                    value={land.size_acres}
                    onChange={(e) => setLand({ ...land, size_acres: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-emerald-50/30"
                  />
                  <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">* Core for integrated calculation</p>
                </div>
                <div>
                  <VoiceField 
                    label={t.labels.soilType} 
                    instruction={t.instructions.soilType} 
                    onResult={(val) => {
                      const v = val.toLowerCase();
                      const found = ["Alluvial", "Black", "Red", "Laterite", "Arid", "Mountain", "Peaty", "Saline", "Loamy", "Sandy", "Clayey"].find(s => v.includes(s.toLowerCase()));
                      if (found) setLand({ ...land, soil_type: found });
                      else setLand({ ...land, soil_type: val });
                    }}
                    langCode={profile.language}
                  />
                  <select
                    required
                    value={land.soil_type}
                    onChange={(e) => setLand({ ...land, soil_type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  >
                    <option value="">{t.options.soil.placeholder}</option>
                    <option value="Alluvial">{t.options.soil.alluvial}</option>
                    <option value="Black">{t.options.soil.black}</option>
                    <option value="Red">{t.options.soil.red}</option>
                    <option value="Laterite">{t.options.soil.laterite}</option>
                    <option value="Arid">{t.options.soil.arid}</option>
                    <option value="Mountain">{t.options.soil.mountain}</option>
                    <option value="Peaty">{t.options.soil.peaty}</option>
                    <option value="Saline">{t.options.soil.saline}</option>
                    <option value="Loamy">{t.options.soil.loamy}</option>
                    <option value="Sandy">{t.options.soil.sandy}</option>
                    <option value="Clayey">{t.options.soil.clayey}</option>
                  </select>
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labels.landPicture}</label>
                  <div className={cn(
                    "border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer hover:bg-emerald-50",
                    land.land_image ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
                  )}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'land_image')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {land.land_image ? (
                      <div className="flex flex-col items-center relative">
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLand(prev => ({ ...prev, land_image: undefined }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <img src={land.land_image} className="w-12 h-12 object-cover rounded-lg mb-2" />
                        <span className="text-xs font-bold text-emerald-600">Uploaded</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Camera className="w-8 h-8 mb-1" />
                        <span className="text-xs">{t.labels.uploadPhoto}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.labels.soilReportLabel}</label>
                  <div className={cn(
                    "border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer hover:bg-emerald-50",
                    land.soil_report ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
                  )}>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e, 'soil_report')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {land.soil_report ? (
                      <div className="flex flex-col items-center relative">
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLand(prev => ({ ...prev, soil_report: undefined }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <FileText className="w-8 h-8 text-emerald-600 mb-1" />
                        <span className="text-xs font-bold text-emerald-600">Uploaded</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <FileText className="w-8 h-8 mb-1" />
                        <span className="text-xs">{t.labels.uploadReport}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <VoiceField 
                  label={t.labels.waterAvailability} 
                  instruction={t.instructions.waterAvailability} 
                  onResult={(val) => {
                    const v = val.toLowerCase();
                    if (v.includes('low')) setLand({ ...land, water_availability: 'low' });
                    else if (v.includes('high')) setLand({ ...land, water_availability: 'high' });
                    else setLand({ ...land, water_availability: 'medium' });
                  }}
                  langCode={profile.language}
                />
                <div className="relative">
                  <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={land.water_availability}
                    onChange={(e) => setLand({ ...land, water_availability: e.target.value as any })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  >
                    <option value="low">{t.options.water.low}</option>
                    <option value="medium">{t.options.water.medium}</option>
                    <option value="high">{t.options.water.high}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-emerald-900 flex items-center gap-2 border-b border-emerald-100 pb-2">
            <Sprout className="w-5 h-5" /> {t.labels.preferences}
          </h3>
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <input
                type="checkbox"
                id="livestock"
                checked={preferences.include_livestock}
                onChange={(e) => setPreferences({ ...preferences, include_livestock: e.target.checked })}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="livestock" className="font-medium text-emerald-900">
                {t.labels.livestock}
              </label>
              <button 
                type="button" 
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(t.instructions.livestock);
                  utterance.lang = profile.language;
                  window.speechSynthesis.speak(utterance);
                }}
                className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-full"
              >
                <Volume2 className="w-3 h-3" />
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
                  if (SpeechRecognition) {
                    const recognition = new SpeechRecognition();
                    recognition.lang = profile.language;
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript.toLowerCase();
                      if (transcript.includes('yes') || transcript.includes('ha') || transcript.includes('include')) {
                        setPreferences({ ...preferences, include_livestock: true });
                      } else if (transcript.includes('no') || transcript.includes('nahi')) {
                        setPreferences({ ...preferences, include_livestock: false });
                      }
                    };
                    recognition.start();
                  }
                }}
                className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-full"
              >
                <Mic className="w-3 h-3" />
              </button>
            </div>
            <div>
              <VoiceField 
                label={t.labels.interestedCrops} 
                instruction={t.instructions.interestedCrops} 
                onResult={(val) => addCrop(val)}
                langCode={profile.language}
              />
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cropInput}
                    onChange={(e) => setCropInput(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCrop())}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    placeholder={t.labels.cropPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => addCrop()}
                    className="px-6 py-2.5 bg-emerald-100 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-200 transition-colors"
                  >
                    {t.labels.addCrop}
                  </button>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addCrop(s)}
                        className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-medium text-gray-700 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {preferences.interested_crops.map((crop) => (
                  <span
                    key={crop}
                    className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-emerald-100"
                  >
                    {crop}
                    <button type="button" onClick={() => removeCrop(crop)} className="hover:text-emerald-900">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t.labels.generating}
              </>
            ) : (
              <>
                <Tractor className="w-6 h-6" />
                {t.labels.generatePlan}
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-4">
            <button 
              type="button" 
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(t.instructions.submit);
                utterance.lang = profile.language;
                window.speechSynthesis.speak(utterance);
              }}
              className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-all"
            >
              <Volume2 className="w-4 h-4" /> {t.labels.hearInstructions}
            </button>
            <button 
              type="button" 
              onClick={() => {
                const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
                if (SpeechRecognition) {
                  const recognition = new SpeechRecognition();
                  recognition.lang = profile.language;
                  recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript.toLowerCase();
                    if (transcript.includes('submit') || transcript.includes('generate') || transcript.includes('start') || transcript.includes('shuru')) {
                      onSubmit(profile, land, preferences);
                    }
                  };
                  recognition.start();
                }
              }}
              className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-all"
            >
              <Mic className="w-4 h-4" /> {t.labels.voiceSubmit}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
