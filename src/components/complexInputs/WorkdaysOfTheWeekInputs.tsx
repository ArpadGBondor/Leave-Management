import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import { handleValueChange } from '../../utils/onFormDataChange';
import SwitchButton from '../buttons/SwitchButton';

interface WorkdaysOfTheWeekInputsProps<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
}

export default function WorkdaysOfTheWeekInputs<T extends WorkdaysOfTheWeek>({
  formData,
  setFormData,
}: WorkdaysOfTheWeekInputsProps<T>) {
  const weekdays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-stretch items-end">
      {weekdays.map((day) => (
        <SwitchButton
          key={day}
          label={day.charAt(0).toUpperCase() + day.slice(1)}
          name={day}
          checked={formData[day]}
          onChange={(name, value) =>
            handleValueChange(name as keyof typeof formData, value, setFormData)
          }
        />
      ))}
    </div>
  );
}
