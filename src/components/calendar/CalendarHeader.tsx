import { format } from 'date-fns';
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from '../../icons/fa';

export interface CalendarHeaderProps {
  currentMonth: Date;
  prevMonth: () => void;
  nextMonth: () => void;
  prevYear: () => void;
  nextYear: () => void;
}

export default function CalendarHeader({
  currentMonth,
  nextMonth,
  prevMonth,
  nextYear,
  prevYear,
}: CalendarHeaderProps) {
  return (
    <div className="flex justify-between items-center gap-4 mb-2 sm:mb-4 text-brand-purple-600">
      <div className="flex flex-col-reverse sm:flex-row gap-1">
        <button
          onClick={prevYear}
          className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
          aria-label="Previous year"
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
          aria-label="Previous month"
        >
          <FaAngleLeft />
        </button>
      </div>
      <h2 className="text-2xl font-semibold  text-center">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <div className="flex flex-col sm:flex-row gap-1">
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
          aria-label="Next month"
        >
          <FaAngleRight />
        </button>
        <button
          onClick={nextYear}
          className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
          aria-label="Next year"
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
}
