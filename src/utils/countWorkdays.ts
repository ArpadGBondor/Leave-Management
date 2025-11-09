import { addDays } from 'date-fns';
import { Leave } from '../interface/Leave.interface';
import WorkdaysOfTheWeek from '../interface/WorkdaysOfTheWeek.interface';
import isDateInRanges from './isDateInRanges';
import isWorkday from './isWorkday';

export default function countWorkdays(
  startDate: Date,
  endDate: Date,
  notWorkdays: Leave[], // Bankholidays + other leaves that should be excluded from calculation
  workdaysOfTheWeek: WorkdaysOfTheWeek
) {
  let numberOfWorkdays = 0;

  let day = startDate;

  while (day <= endDate) {
    if (!isDateInRanges(day, notWorkdays) && isWorkday(day, workdaysOfTheWeek))
      ++numberOfWorkdays;
    day = addDays(day, 1);
  }
  return numberOfWorkdays;
}
