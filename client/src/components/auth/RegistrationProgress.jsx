import React from 'react';
import { Check } from 'lucide-react';

export const RegistrationProgress = ({ currentStep = 1, totalSteps = 3, steps = [] }) => {
  return (
    <div className="mb-8">
      {/* Step Numbers & Title */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-agri-textSecondary mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span className="text-agri-primary font-bold">
          {steps[currentStep - 1] || `Phase ${currentStep}`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-agri-primary to-agri-teal h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Interactive Step Circles */}
      <div className="grid grid-cols-3 gap-2">
        {steps.map((label, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center text-center">
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 mb-1
                  ${
                    isCompleted
                      ? 'bg-agri-primary text-white'
                      : isCurrent
                      ? 'bg-agri-dark text-white ring-4 ring-agri-softGreen'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }
                `}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </div>
              <span
                className={`text-[11px] leading-tight font-semibold hidden sm:block ${
                  isCurrent ? 'text-agri-textDark' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
