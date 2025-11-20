import { useEffect, useState } from 'react';
import User from '../../../interface/User.interface';
import WorkdaysOfTheWeek from '../../../interface/WorkdaysOfTheWeek.interface';
import countWorkdays from '../../../utils/countWorkdays';
import InfoBubble from '../../info/InfoBubble';

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
    <div>
      <h4 className="text-xl font-medium text-brand-green-700">
        Leave entitlement multiplier recommendation
      </h4>
      <InfoBubble>
        The leave entitlement multiplier adjusts a team member’s annual holiday
        allowance based on two factors: the number of days they normally work
        each week and the portion of the year they are employed. Full-time staff
        working five days a week for the entire year receive a multiplier of
        1.0. Part-time schedules or mid-year starters receive a proportionally
        lower multiplier, ensuring their entitlement fairly reflects their
        working pattern and employment period.
      </InfoBubble>
      <p className=" text-brand-green-800">
        Team member is scheduled to work {numberOfWorkdays} days per week, and
        is{' '}
        {workdaysDuringEmployment === workdaysDuringTheYear ? (
          <>employed all year.</>
        ) : (
          <>
            only employed for {workdaysDuringEmployment} out of{' '}
            {workdaysDuringTheYear} workdays in {year}.
          </>
        )}
        <br />
        Recommended leave entitlement multiplier: {numberOfWorkdays / 5} *{' '}
        {workdaysDuringEmployment / workdaysDuringTheYear} ={' '}
        <span className="font-bold">{recommendedMultiplier}</span>
      </p>
    </div>
  );
}
