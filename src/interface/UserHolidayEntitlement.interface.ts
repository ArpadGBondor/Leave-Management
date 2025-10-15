import HolidayEntitlement from './HolidayEntitlement.interface';
import WorkdaysOfTheWeek from './WorkdaysOfTheWeek.interface';

export default interface UserHolidayEntitlement
  extends HolidayEntitlement,
    WorkdaysOfTheWeek {
  id: string; // year
  bankHolidayRegionId: string;
}
