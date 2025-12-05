import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import { handleInputChange } from '../../utils/onFormDataChange';
import CheckboxInput from '../inputs/CheckboxInput';

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
    <div className="flex flex-row flex-wrap gap-4 justify-stretch items-center">
      {weekdays.map((day) => (
        <div key={day}>
          <CheckboxInput
            id={day}
            label={`${day[0].toUpperCase()}${day.slice(1)}`}
            name={day}
            checked={formData[day]}
            onChange={(e) => handleInputChange(e, setFormData)}
            flatten={true}
          />
        </div>
      ))}
    </div>
  );
}
