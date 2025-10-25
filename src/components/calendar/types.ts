export type CalendarStatus =
  | 'workday'
  | 'dayOff'
  | 'bankHoliday'
  | 'requested'
  | 'approved';

export const CALENDAR_STATUS_CONFIG: Record<
  CalendarStatus,
  { label: string; color: string }
> = {
  workday: { label: 'Workday', color: 'bg-brand-purple-100' },
  dayOff: { label: 'Day Off', color: 'bg-blue-100' },
  bankHoliday: { label: 'Bank Holiday', color: 'bg-red-200' },
  requested: { label: 'Requested', color: 'bg-yellow-100' },
  approved: { label: 'Approved', color: 'bg-green-100' },
};
