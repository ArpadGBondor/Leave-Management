import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from '../../icons/fa';

type ButtonProps = {
  label: string;
  link: string;
  icon?: keyof typeof FaIcons;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
};

export default function NavButton({
  label,
  link,
  icon,
  variant = 'primary',
  onClick,
  className,
}: ButtonProps) {
  const location = useLocation();
  const highlight =
    location.pathname === link ||
    (link !== '/' && // I don't want Home button to always stay highlighted
      location.pathname.startsWith(link));
  const IconComponent = icon ? FaIcons[icon] : null;
  const baseClasses =
    'w-full flex flex-row items-center gap-2 px-4 py-2 rounded-xl transition font-medium focus:outline-none ring-offset-brand-purple-50 focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: `${
      highlight
        ? 'bg-brand-green-800 focus:ring-brand-green-800'
        : 'bg-brand-green-700 focus:ring-brand-green-700'
    } hover:bg-brand-green-600 text-white`,
    secondary: `${
      highlight
        ? 'bg-brand-purple-800 focus:ring-brand-purple-800'
        : 'bg-brand-purple-700 focus:ring-brand-purple-700'
    } hover:bg-brand-purple-600 text-white`,
  };

  return (
    <Link
      to={link}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {IconComponent && <IconComponent />}
      <span>{label}</span>
    </Link>
  );
}
