import WorkdaysOfTheWeek from './workdaysOfTheWeek.interface';

export default interface HolidayEntitlement {
  base: number;
  additional: number;
  multiplier: number;
  total: number;
}

export interface UserHolidayEntitlement
  extends HolidayEntitlement,
    WorkdaysOfTheWeek {
  id: string; // year
  bankHolidayRegionId: string;
}
