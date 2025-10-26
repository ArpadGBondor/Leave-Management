import { addDays, format, startOfWeek } from 'date-fns';

export interface CalendarDaysProps {
  currentMonth: Date;
}

export default function CalendarDays({ currentMonth }: CalendarDaysProps) {
  const weekStartDate = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Monday start

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(weekStartDate, i));
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {weekDays.map((day) => (
        <div
          className="sm:p-1 bg-brand-green-600 rounded-lg sm:rounded-xl text-center text-brand-green-100 sm:font-medium"
          key={day.toISOString()}
        >
          {format(day, 'EEE')}
        </div>
      ))}
    </div>
  );
}
