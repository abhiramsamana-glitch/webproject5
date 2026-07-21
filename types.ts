export type BiologicalSex = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface UserProfile {
  name: string;
  age: number;
  sex: BiologicalSex;
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  medicalConditions: string[];
  medications: string[];
  allergies: string[];
  familyHistory: string[];
  healthGoals: string[];
}

export type TriageLevel = 'home_care' | 'primary_care' | 'urgent_care' | 'emergency';

export interface SymptomAssessment {
  symptoms: string[];
  duration: string;
  severity: number; // 1 to 10
  description: string;
  associatedSymptoms?: string[];
}

export interface SymptomTriageResult {
  triageLevel: TriageLevel;
  urgencyTitle: string;
  urgencySummary: string;
  potentialCauses: { name: string; likelihood: 'low' | 'moderate' | 'high'; description: string }[];
  recommendedActions: string[];
  redFlagsToWatch: string[];
  questionsForDoctor: string[];
  homeCareTips: string[];
  disclaimer: string;
}

export interface HealthMetricLog {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  systolicBP?: number;
  diastolicBP?: number;
  heartRateBpm?: number;
  waterIntakeMl?: number;
  sleepHours?: number;
  mood?: 'excellent' | 'good' | 'fair' | 'stressed' | 'fatigued';
  bloodSugarMgDl?: number;
  notes?: string;
}

export interface PreventivePlanItem {
  id: string;
  category: 'screening' | 'vaccination' | 'nutrition' | 'exercise' | 'mental_wellbeing';
  title: string;
  description: string;
  frequency: string; // e.g. "Annual", "Every 5 years"
  priority: 'high' | 'medium' | 'routine';
  completed: boolean;
  dueDate?: string;
  evidenceSource?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "Once daily", "Twice daily with meals"
  times: string[]; // e.g., ["08:00", "20:00"]
  purpose: string;
  notes?: string;
  takenToday: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  triageBadge?: TriageLevel;
  suggestedQuestions?: string[];
  sources?: string[];
}

export interface VitalsAnalysisResult {
  overallStatus: 'normal' | 'attention_needed' | 'improving';
  keyInsights: string[];
  recommendations: string[];
  disclaimer: string;
}
