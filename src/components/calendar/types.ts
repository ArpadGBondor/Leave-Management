export type CalendarStatus =
  | 'workday'
  | 'dayOff'
  | 'bankHoliday'
  | 'requested'
  | 'approved'
  | 'notEmployed';

export const CALENDAR_STATUS_CONFIG: Record<
  CalendarStatus,
  { label: string; color: string }
> = {
  workday: { label: 'Workday', color: 'bg-brand-purple-200' },
  dayOff: { label: 'Day Off', color: 'bg-blue-200' },
  bankHoliday: { label: 'Bank Holiday', color: 'bg-red-200' },
  requested: { label: 'Requested', color: 'bg-yellow-200' },
  approved: { label: 'Approved', color: 'bg-brand-green-300' },
  notEmployed: { label: 'Not Employed', color: 'bg-gray-200' },
};
