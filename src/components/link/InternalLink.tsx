import { Link } from 'react-router-dom';

interface InternalLinkProps {
  to: string;
  label: string;
}

export default function InternalLink({ to, label }: InternalLinkProps) {
  return (
    <Link
      to={to}
      className="text-brand-purple-600 hover:text-brand-purple-800 hover:underline transition duration-200 cursor-pointer"
    >
      {label}
    </Link>
  );
}
