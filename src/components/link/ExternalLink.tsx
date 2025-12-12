import { Link } from 'react-router-dom';

interface InternalLinkProps {
  to: string;
  label: string;
}

export default function ExternalLink({ to, label }: InternalLinkProps) {
  return (
    <a
      href={to}
      target="_blank"
      rel="noreferrer"
      className="text-brand-purple-600 hover:text-brand-purple-800 hover:underline transition duration-200 cursor-pointer"
    >
      {label}
    </a>
  );
}
