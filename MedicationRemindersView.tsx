import React, { useState } from 'react';
import { UserProfile, MedicationItem } from '../types';
import { Pill, Plus, CheckCircle2, Circle, ShieldCheck, Sparkles, Loader2, Clock, AlertCircle } from 'lucide-react';

interface MedicationRemindersViewProps {
  userProfile: UserProfile;
  medications: MedicationItem[];
  setMedications: React.Dispatch<React.SetStateAction<MedicationItem[]>>;
}

export const MedicationRemindersView: React.FC<MedicationRemindersViewProps> = ({
  userProfile,
  medications,
  setMedications,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [purpose, setPurpose] = useState('');

  const [checking, setChecking] = useState(false);
  const [safetyReport, setSafetyReport] = useState<any>(null);

  const toggleTaken = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, takenToday: !m.takenToday } : m))
    );
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMed: MedicationItem = {
      id: Date.now().toString(),
      name: name.trim(),
      dosage: dosage.trim() || '1 tablet',
      frequency,
      times: ['08:00'],
      purpose: purpose.trim() || 'General health supplement',
      takenToday: false,
    };

    setMedications((prev) => [...prev, newMed]);
    setName('');
    setDosage('');
    setPurpose('');
    setShowAddModal(false);
  };

  const handleRunSafetyCheck = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/medication-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medications,
          userProfile,
        }),
      });

      const data = await response.json();
      setSafetyReport(data);
    } catch (err) {
      console.error('Failed medication safety check:', err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Medication & Habit Companion</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track daily dosage schedules, maintain habit compliance, and run AI interaction safety checks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
          <button
            onClick={handleRunSafetyCheck}
            disabled={checking}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-teal-300" />}
            <span>Run AI Safety Check</span>
          </button>
        </div>
      </div>

      {/* Safety Report Output */}
      {safetyReport && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-teal-500 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Medication & Dietary Safety Check</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Educational Guidance</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">{safetyReport.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Dietary & Food Timing Considerations</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                {safetyReport.dietaryNotes?.map((note: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40 space-y-2">
              <h4 className="font-bold text-teal-950 dark:text-teal-200">Questions for Pharmacist / Doctor</h4>
              <ul className="space-y-1 text-teal-900 dark:text-teal-200">
                {safetyReport.questionsForDoctor?.map((q: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>"{q}"</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Medication Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medications.map((med) => (
          <div
            key={med.id}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all ${
              med.takenToday
                ? 'border-emerald-200/80 dark:border-emerald-900/80 bg-emerald-50/20'
                : 'border-slate-200 dark:border-slate-700 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{med.purpose}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{med.name}</h3>
                <p className="text-xs text-slate-500">{med.dosage} • {med.frequency}</p>
              </div>

              <button
                onClick={() => toggleTaken(med.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  med.takenToday
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {med.takenToday ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Taken</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5" />
                    <span>Log Dose</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Add Medication or Supplement</h3>
            <form onSubmit={handleAddMedication} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multivitamin, Lisinopril, Omega-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 10mg, 1 capsule"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Every morning with food">Every morning with food</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Health Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Heart health, blood pressure, vitamin support"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
