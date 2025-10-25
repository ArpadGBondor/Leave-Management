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
  const {
    holidayEntitlementBase,
    holidayEntitlementAdditional,
    holidayEntitlementMultiplier,
    holidayEntitlementDeduction,
    holidayEntitlementTotal,
  } = formData;

  const autoUpdate = (state: T1): T1 => {
    return {
      ...state,
      holidayEntitlementTotal:
        (state.holidayEntitlementBase + state.holidayEntitlementAdditional) *
          state.holidayEntitlementMultiplier -
        state.holidayEntitlementDeduction,
    };
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-stretch items-stretch md:items-end">
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {'('}
      </div>
      <NumberInput
        id="holidayEntitlementBase"
        label="Base leave entitlement"
        name="holidayEntitlementBase"
        value={holidayEntitlementBase}
        onChange={(e) =>
          handleInputChange(e, setFormData, setError, autoUpdate)
        }
        placeholder="Number of days"
        error={errors.holidayEntitlementBase}
      />
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {'+'}
      </div>
      <NumberInput
        id="holidayEntitlementAdditional"
        label="Additional leave entitlement"
        name="holidayEntitlementAdditional"
        value={holidayEntitlementAdditional}
        onChange={(e) =>
          handleInputChange(e, setFormData, setError, autoUpdate)
        }
        placeholder="Number of days"
        step={1}
        error={errors.holidayEntitlementAdditional}
      />
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {')'}
      </div>
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {'x'}
      </div>
      <NumberInput
        id="holidayEntitlementMultiplier"
        label="Leave entitlement multiplier"
        name="holidayEntitlementMultiplier"
        value={holidayEntitlementMultiplier}
        onChange={(e) =>
          handleInputChange(e, setFormData, setError, autoUpdate)
        }
        placeholder="Multiplier"
        step={0.01}
        min={0}
        error={errors.holidayEntitlementMultiplier}
      />
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {'-'}
      </div>
      <NumberInput
        id="holidayEntitlementDeduction"
        label="Deducted leave entitlement"
        name="holidayEntitlementDeduction"
        value={holidayEntitlementDeduction}
        onChange={(e) =>
          handleInputChange(e, setFormData, setError, autoUpdate)
        }
        placeholder="Number of days"
        step={1}
        error={errors.holidayEntitlementDeduction}
      />
      <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
        {'='}
      </div>
      <NumberInput
        id="holidayEntitlementTotal"
        label="Total leave entitlement"
        name="holidayEntitlementTotal"
        value={holidayEntitlementTotal}
        onChange={(e) =>
          handleInputChange(e, setFormData, setError, autoUpdate)
        }
        placeholder="Number of days"
        error={errors.holidayEntitlementTotal}
        disabled
      />
    </div>
  );
}
