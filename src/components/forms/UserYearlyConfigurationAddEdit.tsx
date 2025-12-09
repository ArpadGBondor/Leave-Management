import { useEffect, useState } from 'react';
import UserHolidayEntitlement from '../../interface/UserHolidayEntitlement.interface';
import SelectInput, { SelectInputOption } from '../inputs/SelectInput';
import { handleInputChange } from '../../utils/onFormDataChange';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { getFirebase } from '../../firebase.lazy';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import HolidayCalculationInputs from '../complexInputs/HolidayCalculationInputs';
import WorkdaysOfTheWeekInputs from '../complexInputs/WorkdaysOfTheWeekInputs';
import BankHolidayRegionDropdown from '../complexInputs/BankHolidayRegionDropdown';
import User from '../../interface/User.interface';
import LeaveEntitlementMultiplierRecommendation from './UserYearlyConfigurationAddEdit/LeaveEntitlementMultiplierRecommendation';
import LeaveEntitlementDeductionRecommendation from './UserYearlyConfigurationAddEdit/LeaveEntitlementDeductionRecommendation';
import LeaveEntitlementBaseRecommendation from './UserYearlyConfigurationAddEdit/LeaveEntitlementBaseRecommendation';
import LeaveEntitlementAdditionalRecommendation from './UserYearlyConfigurationAddEdit/LeaveEntitlementAdditionalRecommendation';
import { defaultConfirmationOptions } from '../../context/confirmation/types';
import { useConfirmationContext } from '../../context/confirmation/useConfirmationContext';

interface UserYearlyConfigurationAddEditProps {
  isEditing: boolean;
  selectedForEditing: UserHolidayEntitlement;
  yearOptions: SelectInputOption[];
  userId: string;
  user: User;
  onBack: () => void;
}

export default function UserYearlyConfigurationAddEdit({
  isEditing,
  selectedForEditing,
  yearOptions,
  userId,
  user,
  onBack,
}: UserYearlyConfigurationAddEditProps) {
  const [formData, setFormData] = useState<UserHolidayEntitlement>({
    holidayEntitlementBase: 0,
    holidayEntitlementAdditional: 0,
    holidayEntitlementMultiplier: 0,
    holidayEntitlementDeduction: 0,
    holidayEntitlementTotal: 0,
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
    holidayEntitlementBase: '',
    holidayEntitlementAdditional: '',
    holidayEntitlementMultiplier: '',
    holidayEntitlementTotal: '',
    holidayEntitlementDeduction: '',
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
  const { confirm } = useConfirmationContext();

  const { id } = formData;

  useEffect(() => {
    if (selectedForEditing) setFormData(selectedForEditing);
  }, [selectedForEditing]);

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const onSubmitUserYearlyConfiguration = async (e: any) => {
    e.preventDefault();

    startLoading('update-user-yearly-configuration');
    try {
      const { auth } = await getFirebase();
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

  const onDeleteConfirm = () => {
    confirm(
      defaultConfirmationOptions(
        `You are about to delete ${user.name}'s ${id} year configuration. Once removed, the user's workdays, bank holidays, and holiday entitlement will get calculated using the company's default values.`,
        onDelete
      )
    );
  };

  const onDelete = async () => {
    startLoading('delete-user-yearly-configuration');
    try {
      const { auth } = await getFirebase();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const response = await fetch('/api/user-yearly-holiday-configuration', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id, // year
          userId,
        }),
      });
      if (!response.ok) throw new Error('Failed to delete config');

      toast.info('Yearly configuration deleted');
      onBack();
    } catch (error: any) {
      toast.error(error.message || 'Could not delete yearly configuration');
    } finally {
      stopLoading('delete-user-yearly-configuration');
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
      <BankHolidayRegionDropdown
        formData={formData}
        workdaysOfTheWeek={formData}
        setFormData={setFormData}
        year={id}
        employmentStart={
          user.serviceStartDate ? new Date(user.serviceStartDate) : undefined
        }
        employmentEnd={
          user.serviceEndDate ? new Date(user.serviceEndDate) : undefined
        }
      />
      <h3 className="text-2xl font-bold text-brand-green-700">
        Workdays of the week
      </h3>
      <WorkdaysOfTheWeekInputs formData={formData} setFormData={setFormData} />
      <h3 className="text-2xl font-bold text-brand-green-700">
        Holiday Entitlement
      </h3>
      <LeaveEntitlementBaseRecommendation />
      <LeaveEntitlementAdditionalRecommendation />
      <LeaveEntitlementMultiplierRecommendation
        user={user}
        formData={formData}
        year={id}
      />
      <LeaveEntitlementDeductionRecommendation formData={formData} year={id} />
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
        {isEditing && (
          <Button
            type="button"
            variant="danger"
            label="Delete"
            onClick={onDeleteConfirm}
          />
        )}
      </div>
    </form>
  );
}
