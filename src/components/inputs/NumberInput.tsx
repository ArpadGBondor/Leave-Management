import React from 'react';

interface NumberInputProps {
  id: string;
  label: string;
  name: string;
  value: number;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
  hidden?: boolean;
  min?: number;
  max?: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NumberInput({
  id,
  label,
  name,
  value,
  placeholder,
  error,
  autoComplete,
  disabled,
  hidden,
  min,
  max,
  step,
  onChange,
}: NumberInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${hidden ? 'hidden' : ''}`}>
      {/* Label */}
      <label htmlFor={id} className="block text-brand-green-800 text-medium">
        {label}
      </label>

      {/* Input */}
      <input
        id={id}
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        hidden={hidden}
        min={min}
        max={max}
        step={step}
        className={`block w-full py-2 px-4 rounded-full border focus:outline-none ring-offset-brand-purple-50 focus:ring-2 focus:ring-offset-2 ${
          disabled
            ? 'border-brand-purple-700 bg-brand-purple-100 text-brand-purple-700 cursor-not-allowed pointer-events-none'
            : error
            ? 'focus:ring-red-700 border-red-700 hover:border-red-600 bg-red-200 hover:bg-red-100 text-red-900'
            : 'focus:ring-brand-green-700 border-brand-green-700 hover:border-brand-green-600 bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900'
        }`}
      />

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 font-medium text-wrap">
          {error}
        </div>
      )}
    </div>
  );
}
