import React from 'react';
import { ShieldAlert, PhoneCall, X, AlertTriangle, Hospital, HeartPulse } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border-2 border-rose-500 shadow-2xl relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400">Emergency Red Flag Guide</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate medical evaluation is required for red flag symptoms.
            </p>
          </div>
        </div>

        {/* Urgent Warning Box */}
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-950 dark:text-rose-200 space-y-2">
          <strong className="font-bold flex items-center gap-1.5 text-sm text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Seek Emergency Care Immediately (Call 911 / 112) If You Notice:</span>
          </strong>
          <ul className="space-y-1.5 pl-5 list-disc text-slate-800 dark:text-slate-200">
            <li>Sudden, severe chest pain, pressure, or tightness radiating to arm, neck, or jaw.</li>
            <li>Sudden weakness, numbness, or drooping on one side of face/body (Stroke FAST warning).</li>
            <li>Severe, sudden shortness of breath or inability to catch breath while resting.</li>
            <li>Sudden loss of consciousness, fainting, or severe mental confusion.</li>
            <li>Uncontrolled severe bleeding or acute severe abdominal pain.</li>
          </ul>
        </div>

        {/* Call Emergency Numbers */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Quick Hotline Actions:</span>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:911"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911 (US/CA)</span>
            </a>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white font-bold text-sm shadow-md transition-all text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 112 (EU/Global)</span>
            </a>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <p className="text-[11px] text-center text-slate-400 italic border-t border-slate-100 dark:border-slate-700 pt-3">
          Consult a medical professional. This tool provides wellness guidance for educational purposes only.
        </p>
      </div>
    </div>
  );
};
