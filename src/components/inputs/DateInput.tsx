import { format } from 'date-fns';
import React from 'react';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';

interface DateInputProps {
  id: string;
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DateInput({
  id,
  label,
  name,
  value,
  placeholder,
  error,
  disabled,
  onChange,
}: DateInputProps) {
  const handleChange = (date: Date | null) => {
    // Mimic a standard input change event
    const syntheticEvent = {
      target: {
        name,
        value: date ? format(date, 'yyyy-MM-dd') : '',
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label htmlFor={id} className="block text-brand-green-800 text-medium">
        {label}
      </label>

      {/* Date Picker */}
      <DatePicker
        oneTap
        id={id}
        name={name}
        value={value ? new Date(value) : null}
        onChange={handleChange}
        placeholder={placeholder || 'Select a date'}
        disabled={disabled}
        format="yyyy-MM-dd"
        editable={false}
        className={`w-full rounded-full border ${
          disabled
            ? 'border-brand-purple-700 bg-brand-purple-100 text-brand-purple-700 cursor-not-allowed pointer-events-none'
            : error
            ? 'border-red-700 hover:border-red-600 bg-red-200 hover:bg-red-100 text-red-900'
            : 'border-brand-green-700 hover:border-brand-green-600 bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900'
        }`}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          width: '100%',
        }}
      />

      {/* Error message */}
      {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
    </div>
  );
}
