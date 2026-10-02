import React from 'react';
import { Phone } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'USA (+1)' },
  { code: '+44', country: 'UK', label: 'UK (+44)' },
  { code: '+971', country: 'UAE', label: 'UAE (+971)' },
];

export const PhoneInput = ({
  id = 'phone',
  name = 'phone',
  label = 'Phone Number',
  value = '',
  onChange,
  countryCode = '+91',
  onCountryCodeChange,
  required = false,
  error,
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-agri-textDark">
          {label} {required && <span className="text-agri-danger">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {/* Country Code Selector */}
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange && onCountryCodeChange(e.target.value)}
          aria-label="Country Code"
          className="w-24 sm:w-28 rounded-xl border border-agri-border bg-gray-50 text-xs sm:text-sm font-bold text-agri-textDark py-2.5 sm:py-3 px-2 focus:outline-none focus:ring-2 focus:ring-agri-primary/20"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} {c.country}
            </option>
          ))}
        </select>

        {/* 10-Digit Phone Input */}
        <div className="relative flex-1">
          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id={id}
            name={name}
            type="tel"
            maxLength={10}
            value={value}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '');
              onChange(cleaned);
            }}
            placeholder="98765 43210"
            className={`
              w-full rounded-xl border bg-white text-sm text-agri-textDark placeholder:text-gray-400
              transition-all duration-200 focus:outline-none focus:ring-2 py-2.5 sm:py-3 pl-10 pr-3.5
              ${error ? 'border-agri-danger focus:border-agri-danger focus:ring-agri-danger/20' : 'border-agri-border focus:border-agri-primary focus:ring-agri-primary/20'}
            `}
          />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-agri-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-agri-textSecondary">{helperText}</p>
      ) : null}
    </div>
  );
};
