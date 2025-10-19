import { forwardRef, useImperativeHandle } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import WorkdaysOfTheWeekInputs from '../complexInputs/WorkdaysOfTheWeekInputs';

const CompanyWorkdayDefaults = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });

  const { startLoading, stopLoading } = useLoadingContext();
  const { updateWorkdaysOfTheWeek, workdaysOfTheWeek } = useCompanyContext();

  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
    formData;

  useEffect(() => {
    if (workdaysOfTheWeek)
      setFormData((prevState) => ({
        ...prevState,
        ...workdaysOfTheWeek,
      }));
  }, []);

  const numberOfWorkdays = () => {
    return [
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    ].filter(Boolean).length;
  };

  // Allow parent to trigger submit
  useImperativeHandle(ref, () => ({
    submit: onSubmitHolidayEntitlement,
  }));

  const onSubmitHolidayEntitlement = async (e: any) => {
    e?.preventDefault();

    startLoading('set-company-workdays-of-the-week');
    try {
      await updateWorkdaysOfTheWeek({
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      });

      toast.info('Default workday configuration saved');
    } catch (error: any) {
      toast.error(
        error.message || 'Could not update default workday configuration'
      );
    } finally {
      stopLoading('set-company-workdays-of-the-week');
    }
  };

  return (
    <form
      onSubmit={onSubmitHolidayEntitlement}
      className="flex flex-col gap-4 w-full"
    >
      <h3 className="text-2xl font-bold text-brand-green-700">
        Workdays of the week
      </h3>

      <p className="text-brand-green-800">
        Please select which days of the week should automatically count as
        workdays within a holiday time period.
      </p>

      <WorkdaysOfTheWeekInputs formData={formData} setFormData={setFormData} />

      <p className=" text-brand-green-800 text-center">
        Selected <span className="font-bold">{numberOfWorkdays()}</span>{' '}
        workdays per week.
        <br />
        Recommended leave entitlement multiplier:{' '}
        <span className="font-bold">{numberOfWorkdays() / 5}</span>
      </p>
    </form>
  );
});
export default CompanyWorkdayDefaults;
