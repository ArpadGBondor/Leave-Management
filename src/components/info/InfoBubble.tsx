import { ReactNode } from 'react';
import { FaInfoCircle } from '../../icons/fa';

interface InfoBubbleProps {
  children: ReactNode;
}

export default function InfoBubble({ children }: InfoBubbleProps) {
  return (
    <div className="flex gap-2 sm:gap-4 border border-brand-green-700 bg-brand-green-50 p-2 sm:p-4 text-brand-green-800">
      <FaInfoCircle className="mt-1 text-brand-green-600 flex-shrink-0" />
      <p>{children}</p>
    </div>
  );
}
