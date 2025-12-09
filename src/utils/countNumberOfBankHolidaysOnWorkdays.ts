import WorkdaysOfTheWeek from '../interface/WorkdaysOfTheWeek.interface';

export default function countNumberOfBankHolidaysOnWorkdays(
  bankHolidayDates: Date[],
  workdaysOfTheWeek: WorkdaysOfTheWeek,
  employmentStart?: Date,
  employmentEnd?: Date
): number {
  let numberOfBankHolidays: number = 0;

  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
    workdaysOfTheWeek;

  for (const date of bankHolidayDates) {
    // Do not count days outside of employment
    if (employmentStart && date < employmentStart) continue;
    if (employmentEnd && date > employmentEnd) continue;
    const day = date.getDay();
    switch (day) {
      case 0:
        if (sunday) ++numberOfBankHolidays;
        break;
      case 1:
        if (monday) ++numberOfBankHolidays;
        break;
      case 2:
        if (tuesday) ++numberOfBankHolidays;
        break;
      case 3:
        if (wednesday) ++numberOfBankHolidays;
        break;
      case 4:
        if (thursday) ++numberOfBankHolidays;
        break;
      case 5:
        if (friday) ++numberOfBankHolidays;
        break;
      case 6:
        if (saturday) ++numberOfBankHolidays;
        break;
      default:
        break;
    }
  }
  return numberOfBankHolidays;
}
