import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from '../../icons/fa';

interface TextInputProps {
  id: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
  hidden?: boolean;
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
  disabled,
  hidden,
  onChange,
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const togglePassword = () => setShowPassword((prev) => !prev);
  return (
    <div className={`flex flex-col gap-1 ${hidden ? 'hidden' : ''}`}>
      {label && (
        /* Label */
        <label htmlFor={id} className="block text-brand-green-800 text-medium">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {/* Input */}
        <input
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          hidden={hidden}
          className={`block w-full py-2 px-4 rounded-full border focus:outline-none ring-offset-brand-purple-50 focus:ring-2 focus:ring-offset-2 ${
            disabled
              ? 'border-brand-purple-700 bg-brand-purple-100 text-brand-purple-700 cursor-not-allowed pointer-events-none'
              : error
              ? 'focus:ring-red-700 border-red-700 hover:border-red-600 bg-red-200 hover:bg-red-100 text-red-900'
              : 'focus:ring-brand-green-700 border-brand-green-700 hover:border-brand-green-600 bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900'
          }`}
        />
        {/* Password toggle button */}
        {isPassword && !disabled && (
          <button
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 p-4 flex items-center text-sm text-brand-purple-900 hover:opacity-80 rounded-full"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
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
