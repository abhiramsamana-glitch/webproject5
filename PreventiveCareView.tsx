import React, { useState } from 'react';
import { UserProfile, PreventivePlanItem } from '../types';
import { ShieldCheck, CheckCircle2, Circle, AlertCircle, RefreshCw, Filter, Sparkles, Award, HeartPulse, Stethoscope, Loader2 } from 'lucide-react';

interface PreventiveCareViewProps {
  userProfile: UserProfile;
  preventivePlan: PreventivePlanItem[];
  setPreventivePlan: React.Dispatch<React.SetStateAction<PreventivePlanItem[]>>;
}

export const PreventiveCareView: React.FC<PreventiveCareViewProps> = ({
  userProfile,
  preventivePlan,
  setPreventivePlan,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);

  const toggleComplete = (id: string) => {
    setPreventivePlan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleRegeneratePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-preventive-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile }),
      });
      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        setPreventivePlan(data.items);
      }
    } catch (err) {
      console.error('Failed to regenerate preventive plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = preventivePlan.filter((item) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'high_priority') return item.priority === 'high';
    return item.category === filterCategory;
  });

  const completedCount = preventivePlan.filter((p) => p.completed).length;
  const totalCount = preventivePlan.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Preventive Care Roadmap</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200">
                  {userProfile.age || 35} Y/O {userProfile.sex?.toUpperCase() || 'ADULT'} PROTOCOL
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evidence-backed health screenings, immunizations, and preventive lifestyle habits.
              </p>
            </div>
          </div>

          <button
            onClick={handleRegeneratePlan}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Regenerate AI Roadmap</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Preventive Health Progress</span>
            </span>
            <span>
              {completedCount} of {totalCount} Completed ({percentComplete}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>

        {[
          { id: 'all', label: 'All Items' },
          { id: 'high_priority', label: 'High Priority' },
          { id: 'screening', label: 'Screenings' },
          { id: 'vaccination', label: 'Vaccines' },
          { id: 'nutrition', label: 'Nutrition & Lifestyle' },
          { id: 'exercise', label: 'Exercise' },
          { id: 'mental_wellbeing', label: 'Mental Wellbeing' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === tab.id
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all ${
              item.completed
                ? 'border-slate-200 dark:border-slate-800 opacity-80'
                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleComplete(item.id)}
                className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`font-bold text-sm text-slate-900 dark:text-white ${
                      item.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {item.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.priority === 'high'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : item.priority === 'medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/50">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Frequency: {item.frequency}</span>
                  {item.evidenceSource && (
                    <span className="italic text-slate-400">{item.evidenceSource}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
