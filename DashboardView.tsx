import React from 'react';
import { NavTab } from './Navbar';
import { UserProfile, HealthMetricLog, PreventivePlanItem, MedicationItem } from '../types';
import { Activity, Stethoscope, MessageSquareHeart, ShieldCheck, HeartPulse, Droplets, Moon, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Clock, Calendar } from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  setActiveTab: (tab: NavTab) => void;
  vitalsLogs: HealthMetricLog[];
  preventivePlan: PreventivePlanItem[];
  medications: MedicationItem[];
  onOpenEmergency: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  setActiveTab,
  vitalsLogs,
  preventivePlan,
  medications,
  onOpenEmergency,
}) => {
  const latestVitals = vitalsLogs[0] || {
    systolicBP: 120,
    diastolicBP: 80,
    heartRateBpm: 72,
    waterIntakeMl: 1800,
    sleepHours: 7.5,
  };

  const completedPreventiveCount = preventivePlan.filter((p) => p.completed).length;
  const totalPreventiveCount = preventivePlan.length;
  const preventiveProgress = totalPreventiveCount > 0 ? Math.round((completedPreventiveCount / totalPreventiveCount) * 100) : 60;

  const medsTakenCount = medications.filter((m) => m.takenToday).length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Personalized Health Guidance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {userProfile.name || 'Friend'}!
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-2xl">
            Monitor your vital metrics, check symptoms, receive AI preventive recommendations, and maintain a proactive lifestyle.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('symptoms')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-900 hover:bg-teal-50 font-semibold text-xs sm:text-sm shadow-md transition-all transform active:scale-95"
            >
              <Stethoscope className="w-4 h-4 text-teal-700" />
              <span>Assess Symptoms Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-800 border border-teal-500/30 text-white font-semibold text-xs sm:text-sm transition-all"
            >
              <MessageSquareHeart className="w-4 h-4 text-teal-300" />
              <span>Ask AI Healthmate</span>
            </button>
          </div>
        </div>
        {/* Background Decorative Rings */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 top-0 w-40 h-40 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />
      </div>

      {/* Quick Vitals Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Blood Pressure */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Blood Pressure</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {latestVitals.systolicBP || 120}/{latestVitals.diastolicBP || 80}
            </span>
            <span className="text-xs font-medium text-slate-500">mmHg</span>
          </div>
          <span className="inline-block mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
            Optimal Range
          </span>
        </div>

        {/* Heart Rate */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Resting Heart Rate</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {latestVitals.heartRateBpm || 72}
            </span>
            <span className="text-xs font-medium text-slate-500">bpm</span>
          </div>
          <span className="inline-block mt-2 text-[11px] font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md">
            Normal Rhythm
          </span>
        </div>

        {/* Daily Hydration */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Hydration</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {((latestVitals.waterIntakeMl || 1800) / 1000).toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-500">/ 2.5 L</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round(((latestVitals.waterIntakeMl || 1800) / 2500) * 100))}%` }}
            />
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sleep Duration</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {latestVitals.sleepHours || 7.5}
            </span>
            <span className="text-xs font-medium text-slate-500">hrs</span>
          </div>
          <span className="inline-block mt-2 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
            Restful Recovery
          </span>
        </div>
      </div>

      {/* Feature Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Symptom Checker Module */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between hover:border-teal-300 dark:hover:border-teal-700 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Symptom Assessment & Triage</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Select current symptoms and severity to receive immediate AI triage matrix guidance, red flag indicators, and questions for your doctor.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('symptoms')}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Launch Triage Evaluator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Preventive Care Roadmap */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Preventive Care Roadmap</h3>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                {preventiveProgress}% Completed
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Age & gender aligned screenings, vaccination milestones, and dietary habits tailored to your family history.
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${preventiveProgress}%` }} />
            </div>
          </div>
          <button
            onClick={() => setActiveTab('preventive')}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>View Preventive Checklist</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* AI Health Assistant */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between hover:border-sky-300 dark:hover:border-sky-700 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Health Consultation</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Ask evidence-backed health questions, explore nutrition advice, understand test results, and learn lifestyle habits.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('assistant')}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-800 dark:text-sky-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Start Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today's Health Habits & Medication Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preventive Action Items */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Preventive Care Checklist</h3>
            </div>
            <button
              onClick={() => setActiveTab('preventive')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              See all
            </button>
          </div>
          <div className="space-y-2.5">
            {preventivePlan.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.priority === 'high' ? 'bg-rose-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{item.description}</p>
                </div>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                  {item.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Medications & Reminders */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Medication Schedule</h3>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {medsTakenCount} of {medications.length} taken today
            </span>
          </div>

          <div className="space-y-2.5">
            {medications.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${med.takenToday ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{med.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{med.dosage} • {med.frequency}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${med.takenToday ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                  {med.takenToday ? 'Taken' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab('meds')}
            className="w-full text-center text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline pt-1"
          >
            Manage Medications & Interactions →
          </button>
        </div>
      </div>
    </div>
  );
};
