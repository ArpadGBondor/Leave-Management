import { useState } from 'react';

type SwitchButtonProps = {
  label: string;
  name: string;
  checked?: boolean;
  variant?: 'primary' | 'secondary';
  onChange?: (name: string, value: boolean) => void;
};

export default function SwitchButton({
  label,
  name,
  checked = false,
  variant = 'primary',
  onChange,
}: SwitchButtonProps) {
  const [isOn, setIsOn] = useState(checked);

  const handleClick = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(name, newState);
  };

  const baseClasses =
    'w-full flex items-center justify-center gap-3 px-4 py-2 rounded-xl transition font-medium transform active:scale-95';
  const variants = {
    primary: isOn
      ? 'bg-brand-green-700 border-2 border-brand-green-700 text-white hover:bg-brand-green-600'
      : 'bg-brand-green-200 text-brand-green-900 border-2 border-brand-green-900 hover:bg-brand-green-100',
    secondary: isOn
      ? 'bg-brand-purple-700 border-2 border-brand-purple-700 text-white hover:bg-brand-purple-600'
      : 'bg-brand-purple-200 text-brand-purple-900 border-2 border-brand-purple-900 hover:bg-brand-purple-100',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${variants[variant]} ${
        isOn ? 'translate-y-[1px]' : ''
      }`}
    >
      <span>{label}</span>
    </button>
  );
}
