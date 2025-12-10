type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  highlight?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'submit' | 'reset' | 'button' | undefined;
  size?: 'md' | 'sm';
  className?: string;
};

export default function Button({
  label,
  variant = 'primary',
  highlight = false,
  disabled,
  onClick,
  type,
  size = 'md',
  className,
}: ButtonProps) {
  const baseClasses = `w-full flex items-center justify-center rounded-xl transition duration-200 focus:outline-none ring-offset-brand-purple-50 focus:ring-2 focus:ring-offset-2 ${
    size === 'sm' ? 'px-2 py-1 font-small' : 'px-4 py-2 font-medium'
  }`;
  const variants = {
    primary: `${
      highlight
        ? 'bg-brand-green-800 focus:ring-brand-green-800'
        : 'bg-brand-green-700 focus:ring-brand-green-700'
    }  text-white`,
    secondary: `${
      highlight ? 'bg-brand-green-50' : 'bg-brand-green-100'
    }  text-brand-green-700 border-2 border-brand-green-700 focus:ring-brand-green-700`,
    danger: `${
      highlight
        ? 'bg-brand-purple-800 focus:ring-brand-purple-800'
        : 'bg-brand-purple-700 focus:ring-brand-purple-700'
    }  text-white`,
  };

  const hoverEffect = {
    primary: 'hover:bg-brand-green-600 cursor-pointer',
    secondary: 'hover:bg-brand-green-200 cursor-pointer',
    danger: 'hover:bg-brand-purple-600 cursor-pointer',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${
        disabled ? disabledClasses : hoverEffect[variant]
      } ${className}`}
      disabled={disabled}
      type={type}
    >
      <span>{label}</span>
    </button>
  );
}
