import { isSameDay, isWithinInterval } from 'date-fns';
import { Leave } from '../interface/Leave.interface';

export default function isDateInRanges(date: Date, ranges: Leave[]): boolean {
  return ranges.some(({ from, to }) => {
    // Exact match on 'from' or 'to'
    if (isSameDay(date, from) || isSameDay(date, to)) return true;
    // Check if date falls inside interval (exclusive of exact match)
    if (from < to && isWithinInterval(date, { start: from, end: to }))
      return true;
    return false;
  });
}
