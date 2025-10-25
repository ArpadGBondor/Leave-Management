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
    <div className="grid grid-cols-7 text-center text-brand-purple-600 font-medium">
      {weekDays.map((day) => (
        <div key={day.toISOString()}>{format(day, 'EEE')}</div>
      ))}
    </div>
  );
}
