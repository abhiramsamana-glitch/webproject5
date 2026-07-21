import React, { useState } from 'react';
import { UserProfile, HealthMetricLog, PreventivePlanItem, MedicationItem } from '../types';
import { User, Printer, FileText, CheckCircle2, HeartPulse, Stethoscope, ShieldCheck, AlertCircle, Save } from 'lucide-react';

interface ProfileReportViewProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  vitalsLogs: HealthMetricLog[];
  preventivePlan: PreventivePlanItem[];
  medications: MedicationItem[];
}

export const ProfileReportView: React.FC<ProfileReportViewProps> = ({
  userProfile,
  setUserProfile,
  vitalsLogs,
  preventivePlan,
  medications,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const latestVitals = vitalsLogs[0] || {
    systolicBP: 120,
    diastolicBP: 80,
    heartRateBpm: 72,
    waterIntakeMl: 2000,
    sleepHours: 7.5,
  };

  return (
    <div className="space-y-6">
      {/* Printable Report Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-doctor-report, #printable-doctor-report * { visibility: visible; }
          #printable-doctor-report { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: white; color: black; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Health Profile & Doctor Visit Report</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your baseline profile context and print a formatted summary report for your doctor.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Doctor Visit Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        {/* Profile Edit Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Personal Health Baseline</h3>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Biological Sex</label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Chronic Conditions (comma separated)</label>
              <input
                type="text"
                value={formData.medicalConditions.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medicalConditions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Allergies (comma separated)</label>
              <input
                type="text"
                value={formData.allergies.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allergies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Family Medical History (comma separated)</label>
              <input
                type="text"
                value={formData.familyHistory.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    familyHistory: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile Context</span>
            </button>
          </form>
        </div>

        {/* Doctor Visit Summary Report Preview */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Doctor Visit Summary Preview</h3>
            </div>
            <button
              onClick={handlePrintReport}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Patient Header */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{userProfile.name || 'Anonymous Patient'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Sex</span>
                <span className="font-bold text-slate-900 dark:text-white">{userProfile.age}y / {userProfile.sex}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Height / Weight</span>
                <span className="font-bold text-slate-900 dark:text-white">{userProfile.heightCm} cm / {userProfile.weightKg} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date</span>
                <span className="font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Vitals & Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Recent Vitals Log</h4>
                <p>Blood Pressure: {latestVitals.systolicBP}/{latestVitals.diastolicBP} mmHg</p>
                <p>Resting Heart Rate: {latestVitals.heartRateBpm} bpm</p>
                <p>Sleep Average: {latestVitals.sleepHours} hrs/night</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Pre-existing Context</h4>
                <p>Conditions: {userProfile.medicalConditions?.join(', ') || 'None listed'}</p>
                <p>Allergies: {userProfile.allergies?.join(', ') || 'None listed'}</p>
                <p>Family History: {userProfile.familyHistory?.join(', ') || 'None listed'}</p>
              </div>
            </div>

            {/* Current Medications */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Active Medications & Supplements</h4>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                {medications.map((m) => (
                  <li key={m.id}>
                    <strong>{m.name}</strong> ({m.dosage}) — {m.frequency} [{m.purpose}]
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 text-amber-900 dark:text-amber-200 text-[11px] text-center font-medium">
              Consult a medical professional. This tool provides wellness guidance for educational purposes only.
            </div>
          </div>
        </div>
      </div>

      {/* Printable Paper Version (Hidden except on print) */}
      <div id="printable-doctor-report" className="hidden">
        <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', color: '#1e293b' }}>
          <div style={{ borderBottom: '2px solid #0d9488', paddingBottom: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', margin: 0, color: '#0f766e' }}>AI Healthmate — Health Guidance Summary</h1>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Patient Clinical Discussion & Preventive Care Overview</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
              <strong>Report Date:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Patient Name:</strong> {userProfile.name || 'Anonymous'}</p>
              <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Age / Sex:</strong> {userProfile.age} / {userProfile.sex}</p>
            </div>
            <div>
              <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Height / Weight:</strong> {userProfile.heightCm} cm / {userProfile.weightKg} kg</p>
              <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Conditions:</strong> {userProfile.medicalConditions?.join(', ') || 'None'}</p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', color: '#0f766e' }}>1. Recent Vital Metrics</h3>
            <p style={{ fontSize: '13px', margin: '6px 0' }}>• Blood Pressure: {latestVitals.systolicBP}/{latestVitals.diastolicBP} mmHg</p>
            <p style={{ fontSize: '13px', margin: '6px 0' }}>• Resting Heart Rate: {latestVitals.heartRateBpm} bpm</p>
            <p style={{ fontSize: '13px', margin: '6px 0' }}>• Sleep Duration: {latestVitals.sleepHours} hrs/night</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', color: '#0f766e' }}>2. Active Medications & Supplements</h3>
            <ul style={{ fontSize: '13px', paddingLeft: '20px' }}>
              {medications.map((m) => (
                <li key={m.id} style={{ marginBottom: '4px' }}>
                  <strong>{m.name}</strong> - {m.dosage} ({m.frequency}) - Purpose: {m.purpose}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', color: '#0f766e' }}>3. Preventive Roadmap Items</h3>
            <ul style={{ fontSize: '13px', paddingLeft: '20px' }}>
              {preventivePlan.map((p) => (
                <li key={p.id} style={{ marginBottom: '4px' }}>
                  [{p.completed ? 'COMPLETED' : 'PENDING'}] <strong>{p.title}</strong>: {p.description} ({p.frequency})
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '30px', padding: '12px', border: '1px solid #cbd5e1', background: '#fef3c7', borderRadius: '6px', fontSize: '12px', color: '#78350f', textAlign: 'center' }}>
            <strong>Mandatory Medical Disclaimer:</strong> Consult a medical professional. This tool provides wellness guidance for educational purposes only.
          </div>
        </div>
      </div>
    </div>
  );
};
