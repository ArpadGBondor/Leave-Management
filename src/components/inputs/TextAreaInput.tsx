import React from 'react';

interface TextAreaInputProps {
  id: string;
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextAreaInput({
  id,
  label,
  name,
  value,
  placeholder,
  error,
  autoComplete,
  disabled,
  rows = 4,
  onChange,
}: TextAreaInputProps) {
  const baseBorder =
    'transition-colors duration-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-offset-2 ring-offset-brand-purple-50';

  const stateStyles = disabled
    ? 'border-brand-purple-700 bg-brand-purple-100 cursor-not-allowed bg-brand-purple-100 text-brand-purple-700'
    : error
    ? 'border-red-700 focus-within:ring-red-700 hover:border-red-600 bg-red-200 hover:bg-red-100 text-red-900'
    : 'border-brand-green-700 focus-within:ring-brand-green-700 hover:border-brand-green-600 bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900';

  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label htmlFor={id} className="block text-brand-green-800 text-base">
        {label}
      </label>

      {/* Wrapper handles border, rounding, and ring */}
      <div className={`border ${baseBorder} ${stateStyles}`}>
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          rows={rows}
          className={`block w-full p-2 pl-4 bg-transparent text-brand-purple-900 resize-none focus:outline-none  ${
            disabled ? 'text-brand-purple-700' : ''
          }`}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 font-medium text-wrap">
          {error}
        </div>
      )}
    </div>
  );
}
