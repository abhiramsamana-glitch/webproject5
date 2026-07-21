import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, Info } from 'lucide-react';

interface DisclaimerBannerProps {
  onOpenEmergencyModal: () => void;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ onOpenEmergencyModal }) => {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-950 dark:text-amber-100">Medical Disclaimer:</strong>{' '}
            Consult a medical professional. This tool provides wellness guidance for educational purposes only.
          </span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={onOpenEmergencyModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Red Flags</span>
          </button>
        </div>
      </div>
    </div>
  );
};
