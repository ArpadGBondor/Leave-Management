import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { CALENDAR_STATUS_CONFIG, CalendarStatus } from './types';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import { Leave } from '../../interface/Leave.interface';

export interface CalendarCellsProps {
  currentMonth: Date;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
  bankHolidays: Leave[];
  requests: Leave[];
  approved: Leave[];
}

export default function CalendarCells({
  currentMonth,
  workdaysOfTheWeek,
  bankHolidays,
  requests,
  approved,
}: CalendarCellsProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  let day = startDate;

  function isWorkday(date: Date): boolean {
    const dayIndex = date.getDay(); // 0=Sun, 1=Mon, ...
    const dayMap: (keyof WorkdaysOfTheWeek)[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return workdaysOfTheWeek[dayMap[dayIndex]];
  }

  function isDateInRanges(date: Date, ranges: Leave[]): boolean {
    return ranges.some(({ from, to }) => {
      // Exact match on 'from' or 'to'
      if (isSameDay(date, from) || isSameDay(date, to)) return true;
      // Check if date falls inside interval (exclusive of exact match)
      if (from < to && isWithinInterval(date, { start: from, end: to }))
        return true;
      return false;
    });
  }

  function isBankHoliday(date: Date) {
    return isDateInRanges(date, bankHolidays);
  }

  function isRequested(date: Date) {
    return isDateInRanges(date, requests);
  }

  function isApproved(date: Date) {
    return isDateInRanges(date, approved);
  }

  const getDayColor = (date: Date): string => {
    if (!isWorkday(date)) return CALENDAR_STATUS_CONFIG.dayOff.color;
    if (isBankHoliday(date)) return CALENDAR_STATUS_CONFIG.bankHoliday.color;
    if (isRequested(date)) return CALENDAR_STATUS_CONFIG.requested.color;
    if (isApproved(date)) return CALENDAR_STATUS_CONFIG.approved.color;
    return CALENDAR_STATUS_CONFIG.workday.color;
  };

  const weeks: Date[][] = [];
  let week: Date[] = [];

  while (day <= endDate) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    day = addDays(day, 1);
  }

  return (
    <div className="flex-grow mt-3 space-y-1">
      {weeks.map((weekDates) => (
        <div
          key={weekDates[0].toISOString()}
          className="grid grid-cols-7 gap-1"
        >
          {weekDates.map((dayDate) => {
            const bgColor = getDayColor(dayDate);
            const textColor = isSameMonth(dayDate, monthStart)
              ? 'text-brand-green-600'
              : 'text-brand-green-400';
            return (
              <div
                key={dayDate.toISOString()}
                className={`h-16 border border-brand-green-600 rounded-lg flex items-center justify-center ${bgColor} ${textColor}`}
              >
                <span className="text-sm font-bold">
                  {format(dayDate, 'd')}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
