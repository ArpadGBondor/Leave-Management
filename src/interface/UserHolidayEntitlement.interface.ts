import BankHolidayRegion from './BankHolidayRegion.interface';
import HolidayEntitlement from './HolidayEntitlement.interface';
import WorkdaysOfTheWeek from './WorkdaysOfTheWeek.interface';

export default interface UserHolidayEntitlement
  extends HolidayEntitlement,
    WorkdaysOfTheWeek,
    BankHolidayRegion {
  id: string; // year
}
