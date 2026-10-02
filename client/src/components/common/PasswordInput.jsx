import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  error,
  helperText,
  autoComplete = 'current-password',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-agri-textDark">
          {label} {required && <span className="text-agri-danger">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={id}
          name={name || id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={`
            w-full rounded-xl border bg-white text-sm text-agri-textDark placeholder:text-gray-400
            transition-all duration-200 focus:outline-none focus:ring-2 py-2.5 sm:py-3 pl-10 pr-10
            ${error ? 'border-agri-danger focus:border-agri-danger focus:ring-agri-danger/20' : 'border-agri-border focus:border-agri-primary focus:ring-agri-primary/20'}
          `}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-agri-textDark focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error ? (
        <p className="text-xs text-agri-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-agri-textSecondary">{helperText}</p>
      ) : null}
    </div>
  );
};
