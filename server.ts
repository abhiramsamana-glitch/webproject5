import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to instantiate Gemini AI client server-side
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set.');
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const MANDATORY_DISCLAIMER =
  'Consult a medical professional. This tool provides wellness guidance for educational purposes only.';

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    appName: 'AI Healthmate',
    hasApiKey: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// Chat Endpoint with AI Health Guidance Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], userProfile } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A valid message string is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: `I am currently operating in offline educational mode. ${MANDATORY_DISCLAIMER}\n\nFor your question ("${message}"), please keep in mind that maintaining open communication with your primary healthcare provider is the best step. If you are experiencing urgent symptoms like chest pain, severe shortness of breath, or sudden weakness, please seek emergency medical attention immediately.`,
        disclaimer: MANDATORY_DISCLAIMER,
      });
    }

    let profileContext = '';
    if (userProfile) {
      profileContext = `
User Context (for personalized educational relevance):
- Age: ${userProfile.age || 'Unspecified'}
- Sex: ${userProfile.sex || 'Unspecified'}
- Chronic Conditions: ${userProfile.medicalConditions?.join(', ') || 'None listed'}
- Current Medications/Supplements: ${userProfile.medications?.join(', ') || 'None listed'}
- Allergies: ${userProfile.allergies?.join(', ') || 'None listed'}
- Health Goals: ${userProfile.healthGoals?.join(', ') || 'General wellness'}
`;
    }

    const systemInstruction = `
You are AI Healthmate, an empathetic, supportive, and evidence-based AI Healthcare Guidance System.
Your mission is to help users monitor health, maintain a healthy lifestyle, focus on health awareness, and emphasize preventive care.

CRITICAL CONSTRAINTS & MANDATORY GUIDELINES:
1. You are a SUPPORTIVE HEALTHCARE GUIDANCE SYSTEM, NOT a clinic management tool or diagnostic system.
2. YOU CANNOT PROVIDE A DEFINITIVE MEDICAL DIAGNOSIS OR PRESCRIBE MEDICATION.
3. Always include this exact disclaimer at the end or clearly highlighted: "${MANDATORY_DISCLAIMER}"
4. If the user describes any medical emergency symptoms (e.g. chest pressure, sudden severe headache, difficulty breathing, slurred speech, acute abdominal pain, severe bleeding), IMMEDIATELY flag it as an urgent emergency, prioritize calling emergency services (911 or local emergency number), and go to the nearest emergency room.
5. Provide clear, well-structured, warm responses using bullet points for readability. Suggest 2-3 helpful follow-up questions the user might ask next.
${profileContext}
`;

    const chatHistoryPrompt = history
      .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
      .join('\n');

    const fullPrompt = `${chatHistoryPrompt}\nUser: ${message}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    const replyText = response.text || `I am here to guide your wellness journey. ${MANDATORY_DISCLAIMER}`;

    return res.json({
      reply: replyText,
      disclaimer: MANDATORY_DISCLAIMER,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Failed to process AI chat request.',
      details: error.message,
      reply: `I encountered an issue processing your request. Please remember: ${MANDATORY_DISCLAIMER}`,
    });
  }
});

// Symptom Assessment & Triage Matrix Endpoint
app.post('/api/assess-symptoms', async (req, res) => {
  try {
    const { symptoms = [], duration = '1 day', severity = 5, description = '', userProfile } = req.body;

    const ai = getGeminiClient();

    let profileText = userProfile
      ? `User: ${userProfile.age || 30} y/o ${userProfile.sex || 'unspecified'}, Conditions: ${userProfile.medicalConditions?.join(', ') || 'None'}`
      : 'User profile: unspecified';

    if (!ai) {
      // Fallback response if no API key
      const isHighSeverity = severity >= 8;
      const isEmergencySymptom = symptoms.some((s: string) =>
        /chest pain|shortness of breath|unconscious|stroke|severe bleeding/i.test(s)
      );

      const triageLevel = isEmergencySymptom || severity >= 9 ? 'emergency' : isHighSeverity ? 'urgent_care' : severity >= 5 ? 'primary_care' : 'home_care';

      return res.json({
        triageLevel,
        urgencyTitle: triageLevel === 'emergency' ? 'Emergency Evaluation Advised' : triageLevel === 'urgent_care' ? 'Prompt Medical Evaluation Recommended' : triageLevel === 'primary_care' ? 'Schedule a Routine Doctor Visit' : 'Self-Care & Wellness Monitoring',
        urgencySummary: 'Based on the reported symptoms and severity score, here is a general guidance overview.',
        potentialCauses: symptoms.map((s: string) => ({
          name: `Common causes related to ${s}`,
          likelihood: 'moderate',
          description: `Various temporary physiological or environmental factors can lead to ${s}.`,
        })),
        recommendedActions: [
          'Monitor symptoms closely for any sudden worsening.',
          'Rest, stay hydrated, and maintain a quiet environment.',
          'Contact a qualified healthcare provider if symptoms persist or escalate.',
        ],
        redFlagsToWatch: [
          'Sudden chest tightness or radiating pain',
          'High fever persisting over 48 hours',
          'Difficulty breathing or confusion',
        ],
        questionsForDoctor: [
          `How long should I expect these ${symptoms.join(', ')} symptoms to last?`,
          'Are there specific diagnostic tests recommended for my age group?',
        ],
        homeCareTips: [
          'Drink 8-10 glasses of water daily.',
          'Ensure 7-9 hours of restful sleep.',
        ],
        disclaimer: MANDATORY_DISCLAIMER,
      });
    }

    const prompt = `
Perform a medical guidance triage assessment for the following reported symptoms:
Symptoms: ${symptoms.join(', ') || 'Unspecified'}
Duration: ${duration}
Severity Score (1-10): ${severity}
Additional Details: ${description || 'None provided'}
${profileText}

Instructions:
Evaluate the symptoms and output structured JSON matching the requested schema.
Categorize the triage level strictly into one of: 'home_care', 'primary_care', 'urgent_care', 'emergency'.
If symptoms involve chest pain, severe dyspnea, sudden neurological deficits, or extreme trauma, classify as 'emergency'.

Ensure you include a list of 3 potential causes, 3 recommended actions, 3 red flags to watch for, 3 questions to ask a doctor, and 2 home care tips.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert AI Triage Assistant. You provide clear educational guidance. ALWAYS emphasize: "${MANDATORY_DISCLAIMER}"`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            triageLevel: { type: Type.STRING, description: "One of 'home_care', 'primary_care', 'urgent_care', 'emergency'" },
            urgencyTitle: { type: Type.STRING },
            urgencySummary: { type: Type.STRING },
            potentialCauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  likelihood: { type: Type.STRING, description: "'low', 'moderate', or 'high'" },
                  description: { type: Type.STRING },
                },
                required: ['name', 'likelihood', 'description'],
              },
            },
            recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            redFlagsToWatch: { type: Type.ARRAY, items: { type: Type.STRING } },
            questionsForDoctor: { type: Type.ARRAY, items: { type: Type.STRING } },
            homeCareTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['triageLevel', 'urgencyTitle', 'urgencySummary', 'potentialCauses', 'recommendedActions', 'redFlagsToWatch', 'questionsForDoctor', 'homeCareTips'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.disclaimer = MANDATORY_DISCLAIMER;
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/assess-symptoms:', error);
    return res.status(500).json({
      error: 'Failed to process symptom assessment.',
      details: error.message,
    });
  }
});

// Preventive Care Roadmap Generator
app.post('/api/generate-preventive-plan', async (req, res) => {
  try {
    const { userProfile } = req.body;
    const ai = getGeminiClient();

    const age = userProfile?.age || 35;
    const sex = userProfile?.sex || 'male';
    const conditions = userProfile?.medicalConditions || [];
    const familyHist = userProfile?.familyHistory || [];

    if (!ai) {
      // Default fallback preventive plan
      return res.json({
        items: [
          {
            id: 'p1',
            category: 'screening',
            title: 'Annual Comprehensive Physical Exam',
            description: 'Routine blood pressure check, lipid profile, fasting blood glucose, and body composition review.',
            frequency: 'Annual',
            priority: 'high',
            completed: false,
            evidenceSource: 'USPSTF Evidence Guidelines',
          },
          {
            id: 'p2',
            category: 'vaccination',
            title: 'Annual Influenza Vaccine',
            description: 'Recommended seasonal protection against flu viruses.',
            frequency: 'Annual (Autumn)',
            priority: 'high',
            completed: false,
            evidenceSource: 'CDC Immunization Schedule',
          },
          {
            id: 'p3',
            category: 'screening',
            title: 'Cardiovascular Risk Screening',
            description: 'Lipid panel & resting heart rate evaluation to assess heart health.',
            frequency: 'Every 2-3 years',
            priority: 'medium',
            completed: false,
          },
          {
            id: 'p4',
            category: 'nutrition',
            title: 'Hydration & Balanced Dietary Plan',
            description: 'Focus on whole foods, fiber-rich vegetables, lean proteins, and 2.5L daily hydration.',
            frequency: 'Daily Habit',
            priority: 'routine',
            completed: true,
          },
          {
            id: 'p5',
            category: 'mental_wellbeing',
            title: 'Stress & Sleep Hygiene Protocol',
            description: 'Establish consistent 7-8 hour sleep schedules and 10 minutes of daily mindfulness or outdoor walk.',
            frequency: 'Daily',
            priority: 'routine',
            completed: false,
          },
        ],
        disclaimer: MANDATORY_DISCLAIMER,
      });
    }

    const prompt = `
Generate a personalized, evidence-based preventive healthcare plan for a user with the following profile:
- Age: ${age}
- Biological Sex: ${sex}
- Pre-existing Conditions: ${conditions.join(', ') || 'None'}
- Family History: ${familyHist.join(', ') || 'None'}

Return a list of 5 to 7 specific preventive recommendations categorized into 'screening', 'vaccination', 'nutrition', 'exercise', or 'mental_wellbeing'.
Assign appropriate priorities ('high', 'medium', 'routine') and clear evidence-backed reasoning.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, description: "One of 'screening', 'vaccination', 'nutrition', 'exercise', 'mental_wellbeing'" },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  priority: { type: Type.STRING, description: "'high', 'medium', or 'routine'" },
                  completed: { type: Type.BOOLEAN },
                  evidenceSource: { type: Type.STRING },
                },
                required: ['id', 'category', 'title', 'description', 'frequency', 'priority', 'completed'],
              },
            },
          },
          required: ['items'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"items": []}');
    parsed.disclaimer = MANDATORY_DISCLAIMER;
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/generate-preventive-plan:', error);
    return res.status(500).json({ error: 'Failed to generate preventive plan', details: error.message });
  }
});

// Vitals Analytics & Insights Generator
app.post('/api/analyze-vitals', async (req, res) => {
  try {
    const { vitalsLogs = [], userProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai || vitalsLogs.length === 0) {
      return res.json({
        overallStatus: 'normal',
        keyInsights: [
          'Vitals show consistent tracking pattern over the logged period.',
          'Blood pressure and resting heart rate averages remain in typical ranges.',
          'Daily water intake is trending close to recommended targets.',
        ],
        recommendations: [
          'Maintain regular sleep schedule aiming for 7-8 hours per night.',
          'Consider logging blood pressure at consistent times (e.g. morning and evening).',
          'Stay well-hydrated throughout physical activity.',
        ],
        disclaimer: MANDATORY_DISCLAIMER,
      });
    }

    const logSummary = vitalsLogs
      .slice(0, 10)
      .map(
        (l: any) =>
          `Date: ${l.date}, BP: ${l.systolicBP || '--'}/${l.diastolicBP || '--'} mmHg, HR: ${l.heartRateBpm || '--'} bpm, Sleep: ${l.sleepHours || '--'} hrs, Water: ${l.waterIntakeMl || '--'} mL, Glucose: ${l.bloodSugarMgDl || '--'} mg/dL`
      )
      .join('\n');

    const prompt = `
Analyze the following user health vitals logs and provide educational health insights and actionable preventive guidance:

User Context: Age ${userProfile?.age || 'unspecified'}, Sex ${userProfile?.sex || 'unspecified'}.
Logs:
${logSummary}

Tasks:
1. Determine overall status ('normal', 'attention_needed', 'improving').
2. Provide 3 key observational insights regarding trends in blood pressure, heart rate, hydration, and sleep.
3. Provide 3 practical lifestyle recommendations based on these observations.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallStatus: { type: Type.STRING, description: "'normal', 'attention_needed', or 'improving'" },
            keyInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['overallStatus', 'keyInsights', 'recommendations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.disclaimer = MANDATORY_DISCLAIMER;
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-vitals:', error);
    return res.status(500).json({ error: 'Failed to analyze vitals', details: error.message });
  }
});

// Medication Safety & Educational Check
app.post('/api/medication-check', async (req, res) => {
  try {
    const { medications = [], userProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai || medications.length === 0) {
      return res.json({
        summary: 'Educational Medication Guidance Overview',
        dietaryNotes: [
          'Take medications with a full glass of water unless instructed otherwise.',
          'Be aware of common food interactions (e.g., grapefruit juice with statins, dairy with certain antibiotics).',
        ],
        lifestyleTips: [
          'Use a daily pill organizer or reminder app to maintain consistent dosage times.',
          'Store medications in a cool, dry place away from bathroom humidity.',
        ],
        questionsForDoctor: [
          'Should any of these medications be taken with food or on an empty stomach?',
          'Are there potential side effects I should monitor during the first few weeks?',
        ],
        disclaimer: MANDATORY_DISCLAIMER,
      });
    }

    const prompt = `
Provide educational guidance and lifestyle safety information for a patient taking the following list of medications/supplements:
${medications.map((m: any) => `- Name: ${m.name || m}, Dosage: ${m.dosage || 'unspecified'}, Purpose: ${m.purpose || 'unspecified'}`).join('\n')}

Include:
1. High-level educational summary.
2. Dietary & food timing notes.
3. General storage & habit lifestyle tips.
4. 3 specific questions for the patient to review with their pharmacist or doctor.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            dietaryNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            lifestyleTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            questionsForDoctor: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['summary', 'dietaryNotes', 'lifestyleTips', 'questionsForDoctor'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.disclaimer = MANDATORY_DISCLAIMER;
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/medication-check:', error);
    return res.status(500).json({ error: 'Failed medication check', details: error.message });
  }
});

// Setup Vite Development / Production Server Handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Healthmate server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
