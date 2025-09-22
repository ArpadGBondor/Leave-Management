type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  highlight?: boolean;
  onClick?: () => void;
};

export default function Button({
  label,
  variant = 'primary',
  highlight = false,
  onClick,
}: ButtonProps) {
  const baseClasses =
    'w-full flex items-center justify-center gap-3 px-4 py-2 rounded-xl transition font-medium';
  const variants = {
    primary: `${
      highlight ? 'bg-brand-green-800' : 'bg-brand-green-700'
    } hover:bg-brand-green-600 text-white`,
    secondary: `${
      highlight ? 'bg-brand-purple-800' : 'bg-brand-purple-700'
    } hover:bg-brand-purple-600 text-white`,
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      <span>{label}</span>
    </button>
  );
}
