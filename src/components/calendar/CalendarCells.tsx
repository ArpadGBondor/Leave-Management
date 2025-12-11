import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { CALENDAR_STATUS_CONFIG } from './types';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import { Leave } from '../../interface/Leave.interface';
import isWorkday from '../../utils/isWorkday';
import isDateInRanges from '../../utils/isDateInRanges';

export interface CalendarCellsProps {
  currentMonth: Date;
  previousYearWorkdaysOfTheWeek: WorkdaysOfTheWeek;
  currentYearWorkdaysOfTheWeek: WorkdaysOfTheWeek;
  nextYearWorkdaysOfTheWeek: WorkdaysOfTheWeek;
  bankHolidays: Leave[];
  requests: Leave[];
  approved: Leave[];
  serviceStartDate?: Date;
  serviceEndDate?: Date;
}

export default function CalendarCells({
  currentMonth,
  previousYearWorkdaysOfTheWeek,
  currentYearWorkdaysOfTheWeek,
  nextYearWorkdaysOfTheWeek,
  bankHolidays,
  requests,
  approved,
  serviceStartDate,
  serviceEndDate,
}: CalendarCellsProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  function notEmployed(date: Date) {
    return (
      (serviceStartDate &&
        !isSameDay(date, serviceStartDate) &&
        serviceStartDate > date) ||
      (serviceEndDate &&
        !isSameDay(date, serviceEndDate) &&
        serviceEndDate < date)
    );
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
    if (notEmployed(date)) return CALENDAR_STATUS_CONFIG.notEmployed.color;
    // Previous year day off
    if (
      !isSameYear(currentMonth, date) &&
      isAfter(currentMonth, date) &&
      !isWorkday(date, previousYearWorkdaysOfTheWeek)
    )
      return CALENDAR_STATUS_CONFIG.dayOff.color;
    // Current year day off
    if (
      isSameYear(currentMonth, date) &&
      !isWorkday(date, currentYearWorkdaysOfTheWeek)
    )
      return CALENDAR_STATUS_CONFIG.dayOff.color;
    // Next year day off
    if (
      !isSameYear(currentMonth, date) &&
      isBefore(currentMonth, date) &&
      !isWorkday(date, nextYearWorkdaysOfTheWeek)
    )
      return CALENDAR_STATUS_CONFIG.dayOff.color;
    if (isBankHoliday(date)) return CALENDAR_STATUS_CONFIG.bankHoliday.color;
    if (isRequested(date)) return CALENDAR_STATUS_CONFIG.requested.color;
    if (isApproved(date)) return CALENDAR_STATUS_CONFIG.approved.color;
    return CALENDAR_STATUS_CONFIG.workday.color;
  };

  let day = startDate;
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
    <div className="flex-grow mt-1 space-y-1 min-h-[260px]  sm:min-h-[310px]">
      {weeks.map((weekDates) => (
        <div
          key={weekDates[0].toISOString()}
          className="grid grid-cols-7 gap-1"
        >
          {weekDates.map((dayDate) => {
            const bgColor = getDayColor(dayDate);
            const textColor = isSameMonth(dayDate, monthStart)
              ? 'text-brand-green-600'
              : 'text-brand-green-600 opacity-50';
            return (
              <div
                key={dayDate.toISOString()}
                className={`h-10 sm:h-12 border border-brand-green-600 rounded-lg sm:rounded-xl flex items-center justify-center ${bgColor} ${textColor}`}
              >
                <span className="text-sm md:text-base font-bold">
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
