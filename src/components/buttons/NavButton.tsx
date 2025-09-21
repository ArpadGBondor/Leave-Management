type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export default function NavButton({
  label,
  variant = 'primary',
  onClick,
}: ButtonProps) {
  const baseClasses =
    'flex items-center gap-3 p-2 rounded-xl transition font-medium';
  const variants = {
    primary: 'bg-brand-green-700 hover:bg-brand-green-600 text-white',
    secondary: 'bg-brand-purple-700 hover:bg-brand-purple-600 text-white',
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      <span>{label}</span>
    </button>
  );
}
