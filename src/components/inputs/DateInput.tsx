import React, { useRef } from 'react';
import { format } from 'date-fns';
import { FaRegTimesCircle } from '../../icons/fa';

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
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const handleDisplayClick = () => {
    if (!disabled) hiddenInputRef.current?.showPicker?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const syntheticEvent = {
      target: { name, value: '' },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label htmlFor={id} className="block text-brand-green-800 text-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={handleDisplayClick}
          className={`relative flex flex-row justify-between items-center w-full rounded-full border px-4 py-2 cursor-pointer select-none ring-offset-brand-purple-50 focus:ring-2 focus:ring-offset-2 focus:outline-none
          ${
            disabled
              ? 'border-brand-purple-700 bg-brand-purple-100 text-brand-purple-700 cursor-not-allowed'
              : error
              ? 'focus:ring-red-700 border-red-700 hover:border-red-600 bg-red-200 hover:bg-red-100 text-red-900'
              : 'focus:ring-brand-green-700 border-brand-green-700 hover:border-brand-green-600 bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900'
          }`}
        >
          {/* Display value or placeholder */}
          <span className={`flex-1 text-left ${!value ? 'text-gray-500' : ''}`}>
            {value
              ? format(new Date(value), 'dd-MM-yyyy')
              : placeholder || 'Select a date'}
          </span>

          {/* Hidden native date input */}
          <input
            ref={hiddenInputRef}
            id={id}
            name={name}
            type="date"
            value={value || ''}
            onChange={handleChange}
            disabled={disabled}
            tabIndex={-1}
            className="absolute inset-0 opacity-0 pointer-events-none"
          />
        </button>

        {/* Clear button */}
        {!disabled && value && (
          <button
            type="button"
            aria-label="Clear date"
            onClick={handleClear}
            className="ring-offset-brand-purple-50 focus:outline-none focus:ring-red-700 focus:ring-2 focus:ring-offset-2  hover:text-red-700 rounded-full text-xl"
          >
            <FaRegTimesCircle />
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
    </div>
  );
}
