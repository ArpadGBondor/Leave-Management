import React from 'react';

export interface RadioInputOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioInputProps {
  id: string;
  label: string;
  name: string;
  value: string;
  options: RadioInputOption[] | readonly string[] | string[];
  error?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioInput({
  id,
  label,
  name,
  value,
  options,
  error,
  disabled,
  onChange,
}: RadioInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label className="block text-brand-green-800 text-medium" htmlFor={id}>
        {label}
      </label>

      {/* Radio group */}
      <div className="flex flex-col md:flex-row gap-2 ">
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const optDisabled = typeof opt === 'string' ? false : opt.disabled;

          const isSelected = value === optValue;

          return (
            <label
              key={optValue}
              className={` px-2 flex items-center gap-2 rounded-full cursor-pointer transition-colors
                ${
                  disabled || optDisabled
                    ? 'text-gray-500 cursor-not-allowed pointer-events-none'
                    : error
                    ? 'text-red-800 hover:underline'
                    : isSelected
                    ? 'text-brand-purple-800 hover:underline ring-offset-brand-purple-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-green-700 focus-within:bg-brand-green-50'
                    : 'text-brand-green-800 hover:underline'
                }`}
            >
              <input
                type="radio"
                id={`${id}-${optValue}`}
                name={name}
                value={optValue}
                checked={isSelected}
                onChange={onChange}
                disabled={disabled || optDisabled}
                className="h-4 w-4 text-brand-green-700 accent-brand-purple-700 focus:outline-none"
              />
              <span>{optLabel}</span>
            </label>
          );
        })}
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
