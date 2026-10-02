import React from 'react';

export const TextInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  icon: Icon,
  className = '',
  autoComplete,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-agri-textDark flex items-center justify-between">
          <span>
            {label} {required && <span className="text-agri-danger">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`
            w-full rounded-xl border bg-white text-sm text-agri-textDark placeholder:text-gray-400
            transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed
            py-2.5 sm:py-3
            ${Icon ? 'pl-10 pr-3.5' : 'px-3.5'}
            ${error ? 'border-agri-danger focus:border-agri-danger focus:ring-agri-danger/20' : 'border-agri-border focus:border-agri-primary focus:ring-agri-primary/20'}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-agri-danger font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-agri-textSecondary">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
