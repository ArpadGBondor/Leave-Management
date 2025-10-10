import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import NumberInput from '../inputs/NumberInput';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import { handleInputChange } from '../../utils/onFormDataChange';

export default function CompanyHolidayDefaults() {
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

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const onSubmitHolidayEntitlement = async (e: any) => {
    e.preventDefault();

    startLoading('set-company-holiday-entitlement');
    try {
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
      <h3 className="text-2xl font-bold text-brand-green-700">
        Yearly holiday entitlement
      </h3>

      <div className="flex flex-col md:flex-row gap-2 justify-stretch items-stretch md:items-end">
        <div className="hidden md:block mb-2 text-4xl font-bold text-brand-purple-700">
          {'('}
        </div>
        <NumberInput
          id="base"
          label="Base leave entitlement"
          name="base"
          value={base}
          onChange={(e) => handleInputChange(e, setFormData, setError)}
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
          onChange={(e) => handleInputChange(e, setFormData, setError)}
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
          onChange={(e) => handleInputChange(e, setFormData, setError)}
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
          onChange={(e) => handleInputChange(e, setFormData, setError)}
          placeholder="Number of days"
          error={errors.base}
          disabled
        />
      </div>

      <Button label="Update default holiday configuration" />
    </form>
  );
}
