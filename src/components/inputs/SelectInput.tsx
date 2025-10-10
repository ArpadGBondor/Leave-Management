import React from 'react';

export interface SelectInputOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  name: string;
  value: string;
  options: SelectInputOption[] | readonly string[] | string[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectInput({
  id,
  label,
  name,
  value,
  options,
  error,
  disabled,
  placeholder,
  onChange,
}: SelectInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label htmlFor={id} className="block text-brand-green-800 text-medium">
        {label}
      </label>

      {/* Select */}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full py-2 px-4 rounded-full border focus:outline-none ring-offset-brand-purple-50 focus:ring-2 focus:ring-offset-2 ${
          disabled
            ? 'border-gray-700 bg-gray-200 text-gray-900'
            : error
            ? 'focus:ring-red-700 border-red-700 hover:border-red-600 bg-red-200 hover:bg-red-100 text-red-900'
            : 'focus:ring-brand-green-700 border-brand-green-700 hover:border-brand-green-600 bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900'
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>

      {/* Error message */}
      {error && (
        <span className="text-sm text-red-600 font-medium">{error}</span>
      )}
    </div>
  );
}
