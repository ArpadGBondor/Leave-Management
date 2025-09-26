import React from 'react';

interface TextInputProps {
  id: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  id,
  label,
  type = 'text',
  name,
  value,
  placeholder,
  error,
  autoComplete,
  onChange,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label htmlFor={id} className="block text-brand-green-800 text-medium">
        {label}
      </label>

      {/* Input */}
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`block w-full py-2 px-4 rounded-full border ${
          error
            ? 'border-red-700 hover:border-red-600 bg-red-200 hover:bg-red-100 text-red-900'
            : 'border-transparent bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900'
        }`}
      />

      {/* Error message */}
      {error && (
        <span className="text-sm text-red-600 font-medium">{error}</span>
      )}
    </div>
  );
}
