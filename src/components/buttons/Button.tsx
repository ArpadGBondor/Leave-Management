type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  highlight?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'submit' | 'reset' | 'button' | undefined;
};

export default function Button({
  label,
  variant = 'primary',
  highlight = false,
  disabled,
  onClick,
  type,
}: ButtonProps) {
  const baseClasses =
    'w-full flex items-center justify-center gap-3 px-4 py-2 rounded-xl transition font-medium';
  const variants = {
    primary: `${
      highlight ? 'bg-brand-green-800' : 'bg-brand-green-700'
    }  text-white`,
    secondary: `${
      highlight ? 'bg-brand-purple-800' : 'bg-brand-purple-700'
    }  text-white`,
  };

  const hoverEffect = {
    primary: 'hover:bg-brand-green-600',
    secondary: 'hover:bg-brand-purple-600',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${
        disabled ? disabledClasses : hoverEffect[variant]
      }`}
      disabled={disabled}
      type={type}
    >
      <span>{label}</span>
    </button>
  );
}
