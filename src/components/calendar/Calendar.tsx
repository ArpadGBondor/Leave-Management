import { addMonths, subMonths, addYears, subYears } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarCells from './CalendarCells';
import CalendarLegend from './CalendarLegend';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import { Leave } from '../../interface/Leave.interface';

export interface CalendarProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
  bankHolidays: Leave[];
  requests: Leave[];
  approved: Leave[];
}
export default function Calendar({
  currentMonth,
  setCurrentMonth,
  workdaysOfTheWeek,
  bankHolidays,
  requests,
  approved,
}: CalendarProps) {
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextYear = () => setCurrentMonth(addYears(currentMonth, 1));
  const prevYear = () => setCurrentMonth(subYears(currentMonth, 1));

  return (
    <div className="min-h-[520px] flex flex-col justify-start items-stretch w-full max-w-2xl mx-auto">
      <CalendarHeader
        currentMonth={currentMonth}
        nextMonth={nextMonth}
        prevMonth={prevMonth}
        nextYear={nextYear}
        prevYear={prevYear}
      />
      <CalendarDays currentMonth={currentMonth} />
      <CalendarCells
        currentMonth={currentMonth}
        workdaysOfTheWeek={workdaysOfTheWeek}
        bankHolidays={bankHolidays}
        requests={requests}
        approved={approved}
      />
      <CalendarLegend />
    </div>
  );
}
