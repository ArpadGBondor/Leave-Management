import { CALENDAR_STATUS_CONFIG } from './types';

export default function renderLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
      {Object.entries(CALENDAR_STATUS_CONFIG).map(([key, { color, label }]) => (
        <div key={key} className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded  border border-brand-green-600 ${color}`}
          ></div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
