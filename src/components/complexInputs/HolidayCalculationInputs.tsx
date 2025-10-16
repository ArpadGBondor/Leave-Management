import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import { handleInputChange } from '../../utils/onFormDataChange';
import NumberInput from '../inputs/NumberInput';

interface HolidayCalculationInputsProps<T1, T2> {
  formData: T1;
  setFormData: React.Dispatch<React.SetStateAction<T1>>;
  errors: T2;
  setError?: (field: keyof T2, message: string) => void;
}

export default function HolidayCalculationInputs<
  T1 extends HolidayEntitlement,
  T2 extends Record<keyof T1, string>
>({
  formData,
  setFormData,
  errors,
  setError,
}: HolidayCalculationInputsProps<T1, T2>) {
  // how do I tell that formdata is extended from type HolidayEntitlement and
  // these fields are quaranteed to exist?
  const { base, additional, multiplier, total } = formData;

  const autoUpdate = (state: T1): T1 => {
    return {
      ...state,
      total: (state.base + state.additional) * state.multiplier,
    };
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-stretch items-stretch md:items-end">
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {'('}
      </div>
      <NumberInput
        id="base"
        label="Base leave entitlement"
        name="base"
        value={base}
        onChange={(e) =>
          handleInputChange(e, setFormData, setError, autoUpdate)
        }
        placeholder="Number of days"
        error={errors.base}
      />
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {'+'}
      </div>
      <NumberInput
        id="additional"
        label="Additional leave entitlement"
        name="additional"
        value={additional}
        onChange={(e) =>
          handleInputChange(e, setFormData, setError, autoUpdate)
        }
        placeholder="Number of days"
        step={1}
        error={errors.additional}
      />
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {')'}
      </div>
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {'x'}
      </div>
      <NumberInput
        id="multiplier"
        label="Leave entitlement multiplier"
        name="multiplier"
        value={multiplier}
        onChange={(e) =>
          handleInputChange(e, setFormData, setError, autoUpdate)
        }
        placeholder="Multiplier"
        step={0.01}
        min={0}
        error={errors.multiplier}
      />
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {'='}
      </div>
      <NumberInput
        id="total"
        label="Total leave entitlement"
        name="total"
        value={total}
        onChange={(e) =>
          handleInputChange(e, setFormData, setError, autoUpdate)
        }
        placeholder="Number of days"
        error={errors.base}
        disabled
      />
    </div>
  );
}
