import { useEffect, useState } from 'react';
import User from '../../../interface/User.interface';
import WorkdaysOfTheWeek from '../../../interface/WorkdaysOfTheWeek.interface';
import countWorkdays from '../../../utils/countWorkdays';

interface LeaveEntitlementMultiplierRecommendationProps<T> {
  user: User;
  formData: T;
  year: string;
}

export default function LeaveEntitlementMultiplierRecommendation<
  T extends WorkdaysOfTheWeek
>({ user, formData, year }: LeaveEntitlementMultiplierRecommendationProps<T>) {
  const [numberOfWorkdays, setNumberOfWorkdays] = useState(0);
  const [workdaysDuringTheYear, setWorkdaysDuringTheYear] = useState(0);
  const [workdaysDuringEmployment, setWorkdaysDuringEmployment] = useState(0);
  const [recommendedMultiplier, setRecommendedMultiplier] = useState<number>(0);
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
    formData;

  useEffect(() => {
    setNumberOfWorkdays(
      [monday, tuesday, wednesday, thursday, friday, saturday, sunday].filter(
        Boolean
      ).length
    );
  }, [monday, tuesday, wednesday, thursday, friday, saturday, sunday]);

  useEffect(() => {
    const employmentStartDate = user.serviceStartDate
      ? new Date(user.serviceStartDate)
      : null;
    const employmentEndDate = user.serviceEndDate
      ? new Date(user.serviceEndDate)
      : null;

    const firstDayOfTheYear = new Date(`${year}-01-01`);
    const lastDayOfTheYear = new Date(`${year}-12-31`);

    const employmentStartedCurrentYear =
      employmentStartDate &&
      employmentStartDate.getFullYear() === parseInt(year);
    const employmentEndedCurrentYear =
      employmentEndDate && employmentEndDate.getFullYear() === parseInt(year);

    const _workdaysDuringTheYear = countWorkdays(
      firstDayOfTheYear,
      lastDayOfTheYear,
      [],
      formData
    );

    setWorkdaysDuringTheYear(_workdaysDuringTheYear);

    const _workdaysDuringEmployment = countWorkdays(
      employmentStartedCurrentYear ? employmentStartDate : firstDayOfTheYear,
      employmentEndedCurrentYear ? employmentEndDate : lastDayOfTheYear,
      [],
      formData
    );

    setWorkdaysDuringEmployment(_workdaysDuringEmployment);

    setRecommendedMultiplier(
      (numberOfWorkdays / 5) *
        (_workdaysDuringEmployment / _workdaysDuringTheYear)
    );
  }, [user.serviceStartDate, user.serviceStartDate, numberOfWorkdays]);

  return (
    <>
      <h4 className="text-xl font-medium text-brand-green-700">
        Leave entitlement multiplier calculation
      </h4>
      <p className=" text-brand-green-800">
        Selected <span className="font-bold">{numberOfWorkdays}</span> workdays
        per week.
        <br />
        {workdaysDuringEmployment === workdaysDuringTheYear ? (
          <>Team member is employed all year.</>
        ) : (
          <>
            Team member is only employed for{' '}
            <span className="font-bold">{workdaysDuringEmployment}</span> out of{' '}
            <span className="font-bold">{workdaysDuringTheYear}</span> workdays
            in {year}.
          </>
        )}
        <br />
        Recommended leave entitlement multiplier: {numberOfWorkdays / 5} *{' '}
        {workdaysDuringEmployment / workdaysDuringTheYear} ={' '}
        <span className="font-bold">{recommendedMultiplier}</span>
      </p>
    </>
  );
}
