import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

type ButtonProps = {
  label: string;
  link: string;
  icon?: keyof typeof FaIcons;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export default function NavButton({
  label,
  link,
  icon,
  variant = 'primary',
  onClick,
}: ButtonProps) {
  const location = useLocation();
  const highlight =
    location.pathname === link ||
    (link !== '/' && // I don't want Home button to always stay highlighted
      location.pathname.startsWith(link));
  const IconComponent = icon ? FaIcons[icon] : null;
  const baseClasses =
    'w-full flex flex-row items-center gap-2 px-4 py-2 rounded-xl transition font-medium';
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
        {IconComponent && <IconComponent />}
        <span>{label}</span>
      </button>
    </Link>
  );
}
