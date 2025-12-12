import { Link } from 'react-router-dom';
import * as FaIcons from '../../icons/fa';

type PageBackButtonProps = {
  label: string;
  link: string;
  icon?: keyof typeof FaIcons;
  onClick?: () => void;
  className?: string;
};

export default function PageBackButton({
  label,
  link,
  icon,
  onClick,
  className,
}: PageBackButtonProps) {
  const IconComponent = icon ? FaIcons[icon] : null;
  const baseClasses =
    'w-full flex flex-row items-center gap-2 px-2 md:px-4 py-1 md:py-2 rounded-xl transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white focus:ring-white hover:bg-brand-green-100 text-brand-green-800 ring-offset-brand-green-700 border-4 border border-b-brand-green-600 border-r-brand-green-600 border-t-brand-green-800 border-l-brand-green-800';

  return (
    <Link to={link} onClick={onClick} className={`${baseClasses} ${className}`}>
      {IconComponent && <IconComponent />}
      <span>{label}</span>
    </Link>
  );
}
