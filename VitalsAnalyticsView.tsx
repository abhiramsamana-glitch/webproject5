import React, { useState } from 'react';
import { UserProfile, HealthMetricLog, VitalsAnalysisResult } from '../types';
import { LineChart as LineChartIcon, Plus, Activity, HeartPulse, Droplets, Moon, Sparkles, Loader2, Calendar, TrendingUp, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

interface VitalsAnalyticsViewProps {
  userProfile: UserProfile;
  vitalsLogs: HealthMetricLog[];
  setVitalsLogs: React.Dispatch<React.SetStateAction<HealthMetricLog[]>>;
}

export const VitalsAnalyticsView: React.FC<VitalsAnalyticsViewProps> = ({
  userProfile,
  vitalsLogs,
  setVitalsLogs,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [systolicBP, setSystolicBP] = useState<number>(120);
  const [diastolicBP, setDiastolicBP] = useState<number>(80);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [waterIntake, setWaterIntake] = useState<number>(2000);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [bloodSugar, setBloodSugar] = useState<number>(95);
  const [notes, setNotes] = useState<string>('');

  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<VitalsAnalysisResult | null>(null);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: HealthMetricLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      systolicBP,
      diastolicBP,
      heartRateBpm: heartRate,
      waterIntakeMl: waterIntake,
      sleepHours,
      bloodSugarMgDl: bloodSugar,
      notes,
    };

    setVitalsLogs((prev) => [newLog, ...prev]);
    setShowLogModal(false);
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vitalsLogs,
          userProfile,
        }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to analyze vitals:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Reformat logs for recharts in chronological order
  const chartData = [...vitalsLogs].reverse().map((log) => ({
    date: log.date.slice(5), // MM-DD
    Systolic: log.systolicBP || 120,
    Diastolic: log.diastolicBP || 80,
    HeartRate: log.heartRateBpm || 70,
    Water: (log.waterIntakeMl || 2000) / 1000, // convert to L
    Sleep: log.sleepHours || 7,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <LineChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Vitals & Analytics Tracker</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Log daily cardiovascular metrics, sleep patterns, and hydration to discover health trends.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setShowLogModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily Vitals</span>
          </button>
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-teal-300" />}
            <span>Analyze with AI</span>
          </button>
        </div>
      </div>

      {/* AI Analysis Summary Result */}
      {analysis && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-teal-500 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Vitals Trend Summary</h3>
            </div>
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Status: {analysis.overallStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>Observational Insights</span>
              </h4>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                {analysis.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40 space-y-2">
              <h4 className="font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-600" />
                <span>Lifestyle Guidance</span>
              </h4>
              <ul className="space-y-1.5 text-teal-900 dark:text-teal-200">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cardiovascular Chart: Blood Pressure & Heart Rate */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Blood Pressure & Heart Rate Trends</h3>
            </div>
            <span className="text-[11px] text-slate-400">mmHg / bpm</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} domain={[50, 160]} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Systolic" stroke="#e11d48" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Diastolic" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="HeartRate" stroke="#0d9488" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lifestyle Chart: Water Intake & Sleep Duration */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Hydration & Sleep Recovery</h3>
            </div>
            <span className="text-[11px] text-slate-400">Liters / Hours</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} domain={[0, 12]} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Water" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Water (Liters)" />
                <Bar dataKey="Sleep" fill="#818cf8" radius={[4, 4, 0, 0]} name="Sleep (Hours)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Logs Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Vitals Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Blood Pressure</th>
                <th className="py-2 px-3">Heart Rate</th>
                <th className="py-2 px-3">Water</th>
                <th className="py-2 px-3">Sleep</th>
                <th className="py-2 px-3">Glucose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
              {vitalsLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <td className="py-2.5 px-3 font-semibold">{log.date}</td>
                  <td className="py-2.5 px-3">
                    {log.systolicBP}/{log.diastolicBP} mmHg
                  </td>
                  <td className="py-2.5 px-3">{log.heartRateBpm} bpm</td>
                  <td className="py-2.5 px-3">{(log.waterIntakeMl || 0) / 1000} L</td>
                  <td className="py-2.5 px-3">{log.sleepHours} hrs</td>
                  <td className="py-2.5 px-3">{log.bloodSugarMgDl || '--'} mg/dL</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Log Today's Vitals</h3>
            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={systolicBP}
                    onChange={(e) => setSystolicBP(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={diastolicBP}
                    onChange={(e) => setDiastolicBP(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Water Intake (mL)</label>
                  <input
                    type="number"
                    value={waterIntake}
                    onChange={(e) => setWaterIntake(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Sleep (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Fasting Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
