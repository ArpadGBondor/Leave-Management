import { ReactNode, useState } from 'react';
import { FaExclamationTriangle } from '../../icons/fa';

interface WarningBubbleProps {
  children: ReactNode;
  collapsedByDefault?: boolean;
}

export default function WarningBubble({
  children,
  collapsedByDefault,
}: WarningBubbleProps) {
  const [open, setOpen] = useState(!Boolean(collapsedByDefault));

  return (
    <div
      className="flex gap-2 sm:gap-4 border border-brand-purple-700 bg-brand-purple-100 p-2 sm:p-4 text-brand-purple-800 cursor-pointer overflow-hidden"
      onClick={() => setOpen(!open)}
    >
      <FaExclamationTriangle className="mt-1 text-brand-purple-600 flex-shrink-0" />

      <div className={`${open ? 'line-clamp-none' : 'line-clamp-1'}`}>
        {children}
      </div>
    </div>
  );
}
