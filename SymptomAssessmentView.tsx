import React, { useState } from 'react';
import { UserProfile, SymptomTriageResult, TriageLevel } from '../types';
import { Stethoscope, AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert, Thermometer, Clock, Sparkles, Loader2, Info, ArrowRight } from 'lucide-react';

interface SymptomAssessmentViewProps {
  userProfile: UserProfile;
  onOpenEmergency: () => void;
}

const COMMON_SYMPTOMS = [
  'Headache',
  'Fever',
  'Cough',
  'Fatigue',
  'Sore Throat',
  'Nausea',
  'Shortness of Breath',
  'Chest Tightness',
  'Abdominal Pain',
  'Joint Stiffness',
  'Dizziness',
  'Back Pain',
  'Skin Rash',
  'Muscle Aches',
  'Chills',
  'Loss of Taste/Smell',
  'Anxiety / Palpitations',
];

export const SymptomAssessmentView: React.FC<SymptomAssessmentViewProps> = ({ userProfile, onOpenEmergency }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Headache', 'Fatigue']);
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState<number>(4);
  const [duration, setDuration] = useState<string>('1-3 Days');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SymptomTriageResult | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleAssess = async () => {
    if (selectedSymptoms.length === 0 && !description.trim()) {
      alert('Please select or describe at least one symptom.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/assess-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          duration,
          severity,
          description,
          userProfile,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Failed to assess symptoms:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTriageBadge = (level: TriageLevel) => {
    switch (level) {
      case 'emergency':
        return {
          label: 'EMERGENCY EVALUATION ADVISED',
          bg: 'bg-rose-600 text-white',
          border: 'border-rose-500',
          icon: ShieldAlert,
        };
      case 'urgent_care':
        return {
          label: 'URGENT CARE CLINIC RECOMMENDED',
          bg: 'bg-amber-600 text-white',
          border: 'border-amber-500',
          icon: AlertTriangle,
        };
      case 'primary_care':
        return {
          label: 'SCHEDULE PRIMARY CARE DOCTOR VISIT',
          bg: 'bg-sky-600 text-white',
          border: 'border-sky-500',
          icon: Stethoscope,
        };
      default:
        return {
          label: 'SELF-CARE & MONITORING',
          bg: 'bg-emerald-600 text-white',
          border: 'border-emerald-500',
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Symptom Assessment & Triage</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identify symptom severity, triage matrix level, potential causes, and doctor consultation questions.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEmergency}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 text-xs font-semibold hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Emergency Red Flags</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>1. Select Symptoms</span>
            </h3>

            {/* Common Symptom Chips */}
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>

            {/* Custom Symptom Input */}
            <form onSubmit={handleAddCustomSymptom} className="flex gap-2">
              <input
                type="text"
                placeholder="Add other symptom (e.g. Ear pressure)..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-medium hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Add
              </button>
            </form>

            {/* Selected Symptoms Tag List */}
            {selectedSymptoms.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Active Selected ({selectedSymptoms.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSymptoms.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 text-xs font-medium border border-teal-200/60 dark:border-teal-800"
                    >
                      <span>{s}</span>
                      <button
                        onClick={() => toggleSymptom(s)}
                        className="hover:text-rose-600 text-slate-400 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Severity Slider */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>2. Severity Rating:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      severity <= 3
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : severity <= 6
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : severity <= 8
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {severity} / 10 ({severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : severity <= 8 ? 'Severe' : 'Acute Emergency'})
                  </span>
                </label>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 (Mild)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe)</span>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>3. Onset Duration:</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Today', '1-3 Days', '1 Week', '2+ Weeks'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                      duration === d
                        ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 dark:text-white">
                4. Additional Context / Description (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Pain gets worse when taking a deep breath or lying down..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Evaluate Button */}
            <button
              onClick={handleAssess}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Symptoms with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>Evaluate Symptoms with AI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-xs text-center space-y-4 flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready for AI Symptom Assessment</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select your symptoms and severity score on the left, then click "Evaluate Symptoms with AI" to receive structured triage matrix advice.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs text-left max-w-md">
                <strong className="font-semibold block mb-1">Notice:</strong>
                Consult a medical professional. This tool provides wellness guidance for educational purposes only.
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-xs text-center space-y-4 flex flex-col items-center justify-center min-h-[380px]">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Analyzing symptom indicators against clinical triage guidelines...
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Generating educational potential causes, home care guidelines, red flags, and doctor consultation questions.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Triage Badge Card */}
              {(() => {
                const badge = getTriageBadge(result.triageLevel);
                const BadgeIcon = badge.icon;
                return (
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 ${badge.border} shadow-md space-y-4`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider ${badge.bg}`}>
                        <BadgeIcon className="w-4 h-4" />
                        <span>{badge.label}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Triage Matrix Level</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{result.urgencyTitle}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{result.urgencySummary}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Potential Educational Causes */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-teal-600" />
                  <span>Potential Educational Causes</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.potentialCauses?.map((cause, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{cause.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${
                          cause.likelihood === 'high' ? 'bg-rose-100 text-rose-800' : cause.likelihood === 'moderate' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                        }`}>
                          {cause.likelihood}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{cause.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags & Recommended Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Red Flags */}
                <div className="bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl p-5 border border-rose-200/60 dark:border-rose-900/60 space-y-3">
                  <h4 className="font-bold text-rose-950 dark:text-rose-200 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Red Flags (Seek Immediate Emergency Care If):</span>
                  </h4>
                  <ul className="space-y-2">
                    {result.redFlagsToWatch?.map((flag, idx) => (
                      <li key={idx} className="text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Next Actions */}
                <div className="bg-teal-50/60 dark:bg-teal-950/30 rounded-2xl p-5 border border-teal-200/60 dark:border-teal-900/60 space-y-3">
                  <h4 className="font-bold text-teal-950 dark:text-teal-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Recommended Guidance Steps:</span>
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendedActions?.map((action, idx) => (
                      <li key={idx} className="text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Questions for Doctor */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  <span>Questions to Ask Your Healthcare Provider:</span>
                </h4>
                <div className="space-y-2">
                  {result.questionsForDoctor?.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 text-xs text-slate-800 dark:text-slate-200">
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer footer */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs text-center font-medium">
                {result.disclaimer || 'Consult a medical professional. This tool provides wellness guidance for educational purposes only.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
