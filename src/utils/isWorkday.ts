import WorkdaysOfTheWeek from '../interface/WorkdaysOfTheWeek.interface';

export default function isWorkday(
  date: Date,
  workdaysOfTheWeek: WorkdaysOfTheWeek
): boolean {
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
