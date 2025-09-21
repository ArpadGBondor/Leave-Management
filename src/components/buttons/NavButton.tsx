import { Link, useLocation } from 'react-router-dom';

type ButtonProps = {
  label: string;
  link: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export default function NavButton({
  label,
  link,
  variant = 'primary',
  onClick,
}: ButtonProps) {
  const location = useLocation();
  const highlight = location.pathname === link;

  const baseClasses =
    'w-full flex items-center gap-3 px-4 py-2 rounded-xl transition font-medium';
  const variants = {
    primary: `${
      highlight ? 'bg-brand-green-800' : 'bg-brand-green-700'
    } hover:bg-brand-green-600 text-white`,
    secondary: `${
      highlight ? 'bg-brand-purple-800' : 'bg-brand-purple-700'
    } hover:bg-brand-purple-600 text-white`,
  };

  return (
    <Link to={link}>
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]}`}
      >
        <span>{label}</span>
      </button>
    </Link>
  );
}
