import React, { useState } from 'react';
import { NavTab, Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { DashboardView } from './components/DashboardView';
import { SymptomAssessmentView } from './components/SymptomAssessmentView';
import { ChatView } from './components/ChatView';
import { PreventiveCareView } from './components/PreventiveCareView';
import { VitalsAnalyticsView } from './components/VitalsAnalyticsView';
import { MedicationRemindersView } from './components/MedicationRemindersView';
import { ProfileReportView } from './components/ProfileReportView';
import { EmergencyModal } from './components/EmergencyModal';
import { AuthModal } from './components/AuthModal';
import { UserProfile, HealthMetricLog, PreventivePlanItem, MedicationItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Baseline User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Sarah',
    age: 38,
    sex: 'female',
    heightCm: 168,
    weightKg: 64,
    activityLevel: 'moderately_active',
    medicalConditions: ['Mild Seasonal Allergies'],
    medications: ['Daily Multivitamin', 'Omega-3 Fish Oil'],
    allergies: ['Penicillin'],
    familyHistory: ['Type 2 Diabetes', 'Hypertension'],
    healthGoals: ['Heart health', 'Improve sleep quality', 'Stress management'],
  });

  // Mock initial vitals logs
  const [vitalsLogs, setVitalsLogs] = useState<HealthMetricLog[]>([
    {
      id: 'l1',
      date: '2026-07-21',
      systolicBP: 118,
      diastolicBP: 78,
      heartRateBpm: 70,
      waterIntakeMl: 2200,
      sleepHours: 7.5,
      bloodSugarMgDl: 92,
    },
    {
      id: 'l2',
      date: '2026-07-20',
      systolicBP: 122,
      diastolicBP: 80,
      heartRateBpm: 72,
      waterIntakeMl: 1900,
      sleepHours: 7.0,
      bloodSugarMgDl: 95,
    },
    {
      id: 'l3',
      date: '2026-07-19',
      systolicBP: 120,
      diastolicBP: 82,
      heartRateBpm: 74,
      waterIntakeMl: 2000,
      sleepHours: 6.8,
      bloodSugarMgDl: 90,
    },
    {
      id: 'l4',
      date: '2026-07-18',
      systolicBP: 124,
      diastolicBP: 81,
      heartRateBpm: 75,
      waterIntakeMl: 1800,
      sleepHours: 7.2,
      bloodSugarMgDl: 94,
    },
  ]);

  // Initial Preventive Roadmap
  const [preventivePlan, setPreventivePlan] = useState<PreventivePlanItem[]>([
    {
      id: 'p1',
      category: 'screening',
      title: 'Annual Blood Pressure & Lipid Check',
      description: 'Cardiovascular risk evaluation and cholesterol spectrum review.',
      frequency: 'Annual',
      priority: 'high',
      completed: true,
      evidenceSource: 'USPSTF Screening Guidelines',
    },
    {
      id: 'p2',
      category: 'screening',
      title: 'Fasting Blood Glucose & HbA1c Test',
      description: 'Diabetes screening given family history of Type 2 Diabetes.',
      frequency: 'Every 2 Years',
      priority: 'high',
      completed: false,
      evidenceSource: 'American Diabetes Association (ADA)',
    },
    {
      id: 'p3',
      category: 'vaccination',
      title: 'Annual Influenza Vaccine',
      description: 'Seasonal flu immunization.',
      frequency: 'Annual',
      priority: 'high',
      completed: false,
      evidenceSource: 'CDC Immunization Schedule',
    },
    {
      id: 'p4',
      category: 'nutrition',
      title: 'Hydration Target (2.2L Daily)',
      description: 'Consistent fluid intake to support renal and cardiovascular function.',
      frequency: 'Daily',
      priority: 'routine',
      completed: true,
    },
    {
      id: 'p5',
      category: 'mental_wellbeing',
      title: 'Sleep Hygiene & Stress Recovery',
      description: 'Maintain 7-8 hours restful sleep and daily mindfulness walking.',
      frequency: 'Daily',
      priority: 'routine',
      completed: false,
    },
  ]);

  // Initial Medications List
  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: 'm1',
      name: 'Daily Multivitamin',
      dosage: '1 tablet',
      frequency: 'Once daily with breakfast',
      times: ['08:00'],
      purpose: 'General nutrition & micronutrients',
      takenToday: true,
    },
    {
      id: 'm2',
      name: 'Omega-3 Fish Oil',
      dosage: '1000 mg',
      frequency: 'Once daily with meal',
      times: ['12:00'],
      purpose: 'Cardiovascular & joint support',
      takenToday: false,
    },
  ]);

  // Modals state
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Prominent Medical Disclaimer Banner */}
      <DisclaimerBanner onOpenEmergencyModal={() => setEmergencyOpen(true)} />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenEmergency={() => setEmergencyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            setActiveTab={setActiveTab}
            vitalsLogs={vitalsLogs}
            preventivePlan={preventivePlan}
            medications={medications}
            onOpenEmergency={() => setEmergencyOpen(true)}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomAssessmentView
            userProfile={userProfile}
            onOpenEmergency={() => setEmergencyOpen(true)}
          />
        )}

        {activeTab === 'assistant' && <ChatView userProfile={userProfile} />}

        {activeTab === 'preventive' && (
          <PreventiveCareView
            userProfile={userProfile}
            preventivePlan={preventivePlan}
            setPreventivePlan={setPreventivePlan}
          />
        )}

        {activeTab === 'vitals' && (
          <VitalsAnalyticsView
            userProfile={userProfile}
            vitalsLogs={vitalsLogs}
            setVitalsLogs={setVitalsLogs}
          />
        )}

        {activeTab === 'meds' && (
          <MedicationRemindersView
            userProfile={userProfile}
            medications={medications}
            setMedications={setMedications}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileReportView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            vitalsLogs={vitalsLogs}
            preventivePlan={preventivePlan}
            medications={medications}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-white">AI Healthmate</span>
            <span>• Healthcare Guidance & Preventive Navigator</span>
          </div>
          <div className="text-[11px] max-w-lg text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-200/60 dark:border-amber-900/60">
            <strong>Mandatory Medical Disclaimer:</strong> Consult a medical professional. This tool provides wellness guidance for educational purposes only.
          </div>
        </div>
      </footer>

      {/* Emergency Red Flags Modal */}
      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />

      {/* Auth Modal Placeholder */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccessLogin={(name) => setUserProfile((prev) => ({ ...prev, name }))}
      />
    </div>
  );
}
