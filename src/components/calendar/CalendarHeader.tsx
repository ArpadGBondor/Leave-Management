import { format } from 'date-fns';
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';

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
    <div className="flex justify-between items-center gap-4 mb-2 text-brand-purple-600">
      <div className="flex flex-row">
        <button
          onClick={prevYear}
          className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
        >
          <FaAngleLeft />
        </button>
      </div>
      <h2 className="text-2xl font-semibold ">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <div className="flex flex-row">
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
        >
          <FaAngleRight />
        </button>
        <button
          onClick={nextYear}
          className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
}
