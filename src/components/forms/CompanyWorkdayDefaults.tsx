import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import SwitchButton from '../buttons/SwitchButton';
import { handleValueChange } from '../../utils/onFormDataChange';

export default function CompanyWorkdayDefaults() {
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

  const onSubmitHolidayEntitlement = async (e: any) => {
    e.preventDefault();

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

      <div className="flex flex-col md:flex-row gap-2 justify-stretch items-end">
        <SwitchButton
          label="Monday"
          name="monday"
          checked={monday}
          onChange={(name, value) =>
            handleValueChange(name as keyof typeof formData, value, setFormData)
          }
        />
        <SwitchButton
          label="Tuesday"
          name="tuesday"
          checked={tuesday}
          onChange={(name, value) =>
            handleValueChange(name as keyof typeof formData, value, setFormData)
          }
        />
        <SwitchButton
          label="Wednesday"
          name="wednesday"
          checked={wednesday}
          onChange={(name, value) =>
            handleValueChange(name as keyof typeof formData, value, setFormData)
          }
        />
        <SwitchButton
          label="Thursday"
          name="thursday"
          checked={thursday}
          onChange={(name, value) =>
            handleValueChange(name as keyof typeof formData, value, setFormData)
          }
        />
        <SwitchButton
          label="Friday"
          name="friday"
          checked={friday}
          onChange={(name, value) =>
            handleValueChange(name as keyof typeof formData, value, setFormData)
          }
        />
        <SwitchButton
          label="Saturday"
          name="saturday"
          checked={saturday}
          onChange={(name, value) =>
            handleValueChange(name as keyof typeof formData, value, setFormData)
          }
        />
        <SwitchButton
          label="Sunday"
          name="sunday"
          checked={sunday}
          onChange={(name, value) =>
            handleValueChange(name as keyof typeof formData, value, setFormData)
          }
        />
      </div>

      <p className=" text-brand-green-800 text-center">
        Selected <span className="font-bold">{numberOfWorkdays()}</span>{' '}
        workdays per week.
        <br />
        Recommended leave entitlement multiplier:{' '}
        <span className="font-bold">{numberOfWorkdays() / 5}</span>
      </p>

      <Button label="Update default workday configuration" />
    </form>
  );
}
