interface CheckboxInputProps {
  id: string;
  label: string;
  name: string;
  checked: boolean;
  disabled?: boolean;
  hidden?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  flatten?: boolean;
}

export default function CheckboxInput({
  id,
  label,
  name,
  checked,
  disabled,
  hidden,
  error,
  onChange,
  flatten,
}: CheckboxInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${hidden ? 'hidden' : ''}`}>
      {!flatten && <div className="h-6"></div>}
      <label
        htmlFor={id}
        className={`flex items-center gap-2 text-base rounded-full border py-2 px-4 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-green-700  ${
          disabled
            ? 'text-brand-purple-800 border-brand-purple-700 bg-brand-purple-100'
            : error
            ? 'text-red-900 border-brand-red-700 bg-red-200'
            : 'text-brand-green-800 border-brand-green-700 bg-brand-green-200 hover:bg-brand-green-100'
        }`}
      >
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="h-5 w-5 focus:outline-none  accent-brand-purple-700 "
        />
        {label}
      </label>

      {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
    </div>
  );
}
