import { useEffect, useState } from 'react';
import UserHolidayEntitlement from '../../interface/UserHolidayEntitlement.interface';
import SelectInput, { SelectInputOption } from '../inputs/SelectInput';
import { handleInputChange } from '../../utils/onFormDataChange';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { auth, db } from '../../firebase.config';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import HolidayCalculationInputs from '../complexInputs/HolidayCalculationInputs';
import WorkdaysOfTheWeekInputs from '../complexInputs/WorkdaysOfTheWeekInputs';
import { collection, onSnapshot } from 'firebase/firestore';
import { firebase_collections } from '../../../lib/firebase_collections';

interface AddEditUserYearlyConfigurationProps {
  bankHolidayOptions: SelectInputOption[];
  isEditing: boolean;
  selectedForEditing: UserHolidayEntitlement;
  yearOptions: SelectInputOption[];
  userId: string;
  onBack: () => void;
}

export default function AddEditUserYearlyConfiguration({
  bankHolidayOptions,
  isEditing,
  selectedForEditing,
  yearOptions,
  userId,
  onBack,
}: AddEditUserYearlyConfigurationProps) {
  const [formData, setFormData] = useState<UserHolidayEntitlement>({
    base: 0,
    additional: 0,
    multiplier: 0,
    total: 0,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    bankHolidayRegionId: '',
    id: '',
    numberOfBankHolidays: 0,
  });

  const [errors, setErrors] = useState<
    Record<keyof UserHolidayEntitlement, string>
  >({
    base: '',
    additional: '',
    multiplier: '',
    total: '',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
    bankHolidayRegionId: '',
    id: '',
    numberOfBankHolidays: '',
  });
  const { startLoading, stopLoading } = useLoadingContext();

  const {
    base,
    additional,
    multiplier,
    total,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    bankHolidayRegionId,
    id,
    numberOfBankHolidays,
  } = formData;

  useEffect(() => {
    if (selectedForEditing) setFormData(selectedForEditing);
  }, [selectedForEditing]);

  useEffect(() => {
    if (!id || !bankHolidayRegionId) {
      setFormData((prevState) => ({
        ...prevState,
        numberOfBankHolidays: 0,
      }));
      return;
    }
    const bankHolidayRef = collection(
      db,
      `/${firebase_collections.BANK_HOLIDAYS}/${bankHolidayRegionId}/${
        id /*year*/
      }`
    );
    const numberOfBankHolidaysUnsubscribe = onSnapshot(
      bankHolidayRef,
      (snapshot) => {
        const numberOfBankHolidays: number = snapshot.docs.length;
        setFormData((prevState) => ({
          ...prevState,
          numberOfBankHolidays,
        }));
      }
    );

    return () => numberOfBankHolidaysUnsubscribe();
  }, [bankHolidayRegionId, id]);

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

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

  const onSubmitUserYearlyConfiguration = async (e: any) => {
    e.preventDefault();

    startLoading('update-user-yearly-configuration');
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const response = await fetch('/api/user-yearly-holiday-configuration', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });
      if (!response.ok) throw new Error('Failed to set config');

      toast.info('Yearly configuration updated');
      onBack();
    } catch (error: any) {
      toast.error(error.message || 'Could not update yearly configuration');
    } finally {
      stopLoading('update-user-yearly-configuration');
    }
  };

  return (
    <form
      onSubmit={onSubmitUserYearlyConfiguration}
      className="flex flex-col gap-4 w-full"
    >
      <h3 className="text-2xl font-bold text-brand-green-700">
        {isEditing ? 'Edit' : 'Add'} configuration
      </h3>
      <SelectInput
        id="id"
        label="Configured year"
        name="id"
        value={id}
        options={yearOptions ?? []}
        disabled={isEditing}
        onChange={(e) => handleInputChange(e, setFormData)}
      />
      <SelectInput
        id="bankHolidayRegionId"
        label="Bank Holidays automatically excluded"
        name="bankHolidayRegionId"
        value={bankHolidayRegionId}
        options={bankHolidayOptions}
        onChange={(e) => handleInputChange(e, setFormData)}
      />
      {numberOfBankHolidays > 0 && (
        <p className=" text-brand-green-800 text-center">
          Number of bank holiday days in selected year and region:{' '}
          <span className="font-bold">{numberOfBankHolidays}</span>
        </p>
      )}
      <h3 className="text-2xl font-bold text-brand-green-700">
        Workdays of the week
      </h3>
      <WorkdaysOfTheWeekInputs formData={formData} setFormData={setFormData} />
      <p className=" text-brand-green-800 text-center">
        Selected <span className="font-bold">{numberOfWorkdays()}</span>{' '}
        workdays per week.
        <br />
        Recommended leave entitlement multiplier:{' '}
        <span className="font-bold">{numberOfWorkdays() / 5}</span>
      </p>
      <h3 className="text-2xl font-bold text-brand-green-700">
        Holiday Entitlement
      </h3>
      <HolidayCalculationInputs
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setError={setError}
      />
      <div className="flex flex-col md:flex-row-reverse md:justify-stretch gap-1 md:gap-4">
        <Button label={isEditing ? 'Save changes' : 'Add configuration'} />
        <Button
          type="button"
          variant="secondary"
          label="Back"
          onClick={onBack}
        />
      </div>
    </form>
  );
}
