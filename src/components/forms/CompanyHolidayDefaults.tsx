import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import NumberInput from '../inputs/NumberInput';
import { useCompanyContext } from '../../context/company/useCompanyContext';

export default function AddPassword() {
  const [formData, setFormData] = useState({
    base: 0,
    additional: 0,
    multiplier: 0,
    total: 0,
  });
  const defaultErrors = {
    base: '',
    additional: '',
    multiplier: '',
    total: '', // this is probably not needed
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { startLoading, stopLoading } = useLoadingContext();
  const { updateHolidayEntitlement, holidayEntitlement } = useCompanyContext();

  const { base, additional, multiplier, total } = formData;

  useEffect(
    () => {
      if (holidayEntitlement)
        setFormData((prevState) => ({
          ...prevState,
          ...holidayEntitlement,
        }));
    },
    [
      // holidayEntitlement unsaved changes should not get overwritten
    ]
  );

  const onChange = (e: any) => {
    setError(e.target.name, '');
    setFormData((prevState) => {
      const state = {
        ...prevState,
        [e.target.name]: Number(e.target.value),
      };
      state.total = (state.base + state.additional) * state.multiplier;
      return state;
    });
  };

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const validateHolidayEntitlement = () => {
    let valid = true;

    return valid;
  };

  const onSubmitHolidayEntitlement = async (e: any) => {
    e.preventDefault();

    startLoading('set-company-holiday-entitlement');
    try {
      if (!validateHolidayEntitlement()) {
        toast.error('Please fill in all fields');
        return;
      }

      await updateHolidayEntitlement({ base, additional, multiplier, total });

      toast.info('Default holiday configuration saved');
    } catch (error: any) {
      toast.error(
        error.message || 'Could not update default holiday configuration'
      );
    } finally {
      stopLoading('set-company-holiday-entitlement');
    }
  };

  return (
    <form
      onSubmit={onSubmitHolidayEntitlement}
      className="flex flex-col gap-4 w-full"
    >
      <h2 className="text-4xl font-bold text-brand-purple-700">
        Default holiday configuration
      </h2>

      <p className="mb-4 text-brand-green-800">
        These settings are default fallback values, in case employees are not
        configured individually for a certain year.
      </p>

      <div className="flex flex-col lg:flex-row lg:gap-2 justify-stretch items-end">
        <div className="mb-2 text-4xl font-bold text-brand-purple-700">
          {'('}
        </div>
        <NumberInput
          id="base"
          label="Base leave entitlement"
          name="base"
          value={base}
          onChange={onChange}
          placeholder="Number of days"
          error={errors.base}
        />
        <div className="mb-2 text-4xl font-bold text-brand-purple-700">
          {'+'}
        </div>
        <NumberInput
          id="additional"
          label="Additional leave entitlement"
          name="additional"
          value={additional}
          onChange={onChange}
          placeholder="Number of days"
          step={1}
          error={errors.additional}
        />
        <div className="mb-2 text-4xl font-bold text-brand-purple-700">
          {')'}
        </div>
        <div className="mb-2 text-4xl font-bold text-brand-purple-700">
          {'x'}
        </div>
        <NumberInput
          id="multiplier"
          label="Leave entitlement multiplier"
          name="multiplier"
          value={multiplier}
          onChange={onChange}
          placeholder="Multiplier"
          step={0.01}
          min={0}
          error={errors.multiplier}
        />
        <div className="mb-2 text-4xl font-bold text-brand-purple-700">
          {'='}
        </div>
        <NumberInput
          id="total"
          label="Total leave entitlement"
          name="total"
          value={total}
          onChange={onChange}
          placeholder="Number of days"
          error={errors.base}
          disabled
        />
      </div>

      <Button label="Update default holiday configuration" />
    </form>
  );
}
