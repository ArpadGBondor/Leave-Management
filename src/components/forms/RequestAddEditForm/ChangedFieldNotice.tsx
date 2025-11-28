import { ReactNode } from 'react';

interface ChangedFieldNoticeProps {
  oldValue: any;
  newValue: any;
  format?: (value: any) => ReactNode;
}

export default function ChangedFieldNotice({
  oldValue,
  newValue,
  format,
}: ChangedFieldNoticeProps) {
  if (oldValue === undefined || oldValue === null) return null;
  if (oldValue === newValue) return null;

  const displayValue = format ? format(oldValue) : oldValue;

  return (
    <p className="bg-brand-purple-100 text-brand-purple-800 border border-brand-purple-700 mt-2 py-2 px-4">
      Changed from: <span className="font-medium">{displayValue}</span>
    </p>
  );
}
