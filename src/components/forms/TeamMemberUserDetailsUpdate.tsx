import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import { useUserContext } from '../../context/user/useUserContext';
import SelectInput from '../inputs/SelectInput';
import User, { userTypeOptions } from '../../interface/User.interface';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { handleInputChange } from '../../utils/onFormDataChange';
import DateInput from '../inputs/DateInput';

interface TeamMemberUserDetailsUpdateProps {
  user: User;
  onBack: () => void;
}

export default function TeamMemberUserDetailsUpdate({
  user,
  onBack,
}: TeamMemberUserDetailsUpdateProps) {
  const [formData, setFormData] = useState({
    userType: user.userType,
    serviceStartDate: user.serviceStartDate,
    serviceEndDate: user.serviceEndDate,
  });
  const defaultErrors = {
    userType: '',
    serviceStartDate: '',
    serviceEndDate: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { updateUser } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const { userType, serviceStartDate, serviceEndDate } = formData;

  useEffect(() => {
    if (user)
      setFormData((prevState) => ({
        ...prevState,
        userType: user.userType ?? userTypeOptions[0],
        serviceStartDate: user.serviceStartDate,
        serviceEndDate: user.serviceEndDate,
      }));
  }, []);

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const validateUser = () => {
    let valid = true;

    if (
      serviceStartDate &&
      serviceEndDate &&
      new Date(serviceStartDate) > new Date(serviceEndDate)
    ) {
      setError('serviceEndDate', 'Employment cannot end before start date.');
      valid = false;
    } else {
      setError('serviceEndDate', '');
    }

    return valid;
  };

  const onSubmitUpdateUser = async (e: any) => {
    e.preventDefault();

    startLoading('update-user-type');
    try {
      if (!validateUser()) {
        toast.error('Please fill in all fields');
        return;
      }

      await updateUser({
        userType,
        id: user.id,
        serviceStartDate,
        serviceEndDate,
      });

      onBack();

      toast.info('User type updated');
    } catch (error: any) {
      toast.error(error.message || 'Could not update user type');
    } finally {
      stopLoading('update-user-type');
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-brand-green-700">
        Update team member details
      </h3>
      <form
        onSubmit={onSubmitUpdateUser}
        className="flex flex-col gap-4 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="flex-1">
            <SelectInput
              id="userType"
              label="User type"
              name="userType"
              value={userType}
              options={userTypeOptions}
              placeholder="-- Select User Type --"
              onChange={(e) => handleInputChange(e, setFormData)}
            />
          </div>

          <div className="flex-2 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <DateInput
                id="serviceStartDate"
                label="Employment start date"
                name="serviceStartDate"
                value={serviceStartDate}
                onChange={(e) => handleInputChange(e, setFormData, setError)}
                placeholder="DD-MM-YYYY"
                error={errors.serviceStartDate}
              />
            </div>
            <div className="flex-1">
              <DateInput
                id="serviceEndDate"
                label="Employment end date"
                name="serviceEndDate"
                value={serviceEndDate}
                onChange={(e) => handleInputChange(e, setFormData, setError)}
                placeholder="DD-MM-YYYY"
                error={errors.serviceEndDate}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse md:justify-stretch gap-1 md:gap-4">
          <div className="flex-2 lg:flex-1">
            <Button label="Update team member details" />
          </div>
          <div className="flex-1">
            <Button
              type="button"
              variant="secondary"
              label="Cancel"
              onClick={onBack}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
