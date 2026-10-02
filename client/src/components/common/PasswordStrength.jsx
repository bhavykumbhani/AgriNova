import React from 'react';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PasswordStrength = ({ password = '' }) => {
  const { t } = useTranslation(['auth']);

  const rules = [
    { key: 'minChars', label: t('passwordRules.minChars', { defaultValue: 'Minimum 8 characters' }), valid: password.length >= 8 },
    { key: 'upper', label: t('passwordRules.upper', { defaultValue: 'At least one uppercase letter' }), valid: /[A-Z]/.test(password) },
    { key: 'lower', label: t('passwordRules.lower', { defaultValue: 'At least one lowercase letter' }), valid: /[a-z]/.test(password) },
    { key: 'number', label: t('passwordRules.number', { defaultValue: 'At least one number' }), valid: /[0-9]/.test(password) },
    { key: 'special', label: t('passwordRules.special', { defaultValue: 'At least one special character (!@#$)' }), valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const validCount = rules.filter((r) => r.valid).length;

  let strengthLabel = t('passwordRules.weak', { defaultValue: 'Weak' });
  let strengthColor = 'bg-red-500';
  let strengthWidth = 'w-1/3';

  if (validCount >= 5) {
    strengthLabel = t('passwordRules.strong', { defaultValue: 'Strong' });
    strengthColor = 'bg-agri-success';
    strengthWidth = 'w-full';
  } else if (validCount >= 3) {
    strengthLabel = t('passwordRules.medium', { defaultValue: 'Medium' });
    strengthColor = 'bg-agri-orange';
    strengthWidth = 'w-2/3';
  }

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
      {/* Strength Bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-agri-textSecondary">
          {t('passwordRules.strength', { defaultValue: 'Password Strength' })}:
        </span>
        <span className={`font-bold ${validCount >= 5 ? 'text-agri-success' : validCount >= 3 ? 'text-agri-orange' : 'text-red-500'}`}>
          {strengthLabel}
        </span>
      </div>

      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
        <div className={`h-full ${strengthColor} ${strengthWidth} transition-all duration-300`} />
      </div>

      {/* Rules Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {rules.map((rule) => (
          <div key={rule.key} className="flex items-center gap-1.5 text-[11px]">
            {rule.valid ? (
              <Check className="w-3.5 h-3.5 text-agri-success shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            )}
            <span className={rule.valid ? 'text-agri-dark font-medium' : 'text-gray-400'}>
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
