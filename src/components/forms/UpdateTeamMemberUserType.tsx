import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import { useUserContext } from '../../context/user/useUserContext';
import SelectInput from '../inputs/SelectInput';
import User, { userTypeOptions } from '../../interface/User.interface';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { handleInputChange } from '../../utils/onFormDataChange';

interface UpdateTeamMemberUserTypeProps {
  user: User;
  onBack: () => void;
}

export default function UpdateTeamMemberUserType({
  user,
  onBack,
}: UpdateTeamMemberUserTypeProps) {
  const [formData, setFormData] = useState({ userType: user.userType });

  const { updateUser } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const { userType } = formData;

  useEffect(() => {
    if (user)
      setFormData((prevState) => ({
        ...prevState,
        userType: user.userType ?? userTypeOptions[0],
      }));
  }, []);

  const onSubmitUpdateUser = async (e: any) => {
    e.preventDefault();

    startLoading('update-user-type');
    try {
      await updateUser({ userType, id: user.id });

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
        Edit user type
      </h3>
      <form
        onSubmit={onSubmitUpdateUser}
        className="flex flex-col gap-4 w-full"
      >
        <SelectInput
          id="userType"
          label="User type"
          name="userType"
          value={userType}
          options={userTypeOptions}
          placeholder="-- Select User Type --"
          onChange={(e) => handleInputChange(e, setFormData)}
        />
        <div className="flex flex-col md:flex-row-reverse md:justify-stretch gap-1 md:gap-4">
          <Button label="Update user type" />
          <Button
            type="button"
            variant="secondary"
            label="Cancel"
            onClick={onBack}
          />
        </div>
      </form>
    </div>
  );
}
