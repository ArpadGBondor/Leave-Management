import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import { useUserContext } from '../../context/user/useUserContext';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { handleInputChange } from '../../utils/onFormDataChange';
import {
  validatePasswordComplexity,
  validatePasswordComplexityUpgraded,
  validatePasswordsMatching,
  validateRequiredField,
} from '../../utils/fieldValidators';
import PasswordComplexityInfo from '../info/PasswordComplexityInfo';

export default function PasswordUpdate() {
  const defaultFormData = {
    currentPassword: '',
    password: '',
    confirmPassword: '',
  };
  const [formData, setFormData] = useState({ ...defaultFormData });
  const defaultErrors = {
    currentPassword: '',
    password: '',
    confirmPassword: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { updatePassword, user } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const { currentPassword, password, confirmPassword } = formData;

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const clearErrors = () =>
    setErrors({
      ...defaultErrors,
    });

  const validateUpdatePassword = () => {
    let valid = true;
    clearErrors();

    // Check currentPassword
    valid &&= validateRequiredField(
      formData,
      'currentPassword',
      'enter your current password',
      setError
    );
    valid &&= validatePasswordComplexity(formData, 'currentPassword', setError);

    // Check new password
    valid &&= validateRequiredField(
      formData,
      'password',
      'enter your new password',
      setError
    );
    valid &&= validatePasswordComplexityUpgraded(
      formData,
      'password',
      setError
    );
    valid &&= validatePasswordsMatching(
      formData,
      'password',
      'confirmPassword',
      setError
    );

    return valid;
  };

  const onSubmitUpdatePassword = async (e: any) => {
    e.preventDefault();

    startLoading('update-password');
    try {
      if (!validateUpdatePassword()) {
        toast.error('Please fill in all fields');
        return;
      }

      await updatePassword(currentPassword, password);
      toast.info('Password updated');
      setFormData({ ...defaultFormData });
    } catch (error: any) {
      if (error?.message === 'Firebase: Error (auth/invalid-credential).') {
        toast.error('Current password invalid');
        setError('currentPassword', 'Password invalid');
      } else {
        toast.error(error.message || 'Could not update password');
      }
    } finally {
      stopLoading('update-password');
    }
  };

  return (
    <>
      {user && (
        <form
          onSubmit={onSubmitUpdatePassword}
          className="flex flex-col gap-2 w-full"
        >
          {/* Hidden field have to be at the beginnins of the form to make the warning go away */}
          <TextInput
            id="username" // email ID already exist on UserUpdate form use username instead
            label="Email address"
            name="username"
            value={user.email}
            onChange={() => {}}
            autoComplete="username"
            hidden
          />
          <h2 className="text-2xl font-bold text-brand-green-700">
            Update password
          </h2>
          <TextInput
            id="currentPassword"
            label="Current password"
            name="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => handleInputChange(e, setFormData, setError)}
            placeholder="Enter your current password"
            autoComplete="password"
            error={errors.currentPassword}
          />

          <TextInput
            id="password"
            label="New password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => handleInputChange(e, setFormData, setError)}
            placeholder="Enter your new password"
            autoComplete="new-password"
            error={errors.password}
          />

          <TextInput
            id="confirmPassword"
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => handleInputChange(e, setFormData, setError)}
            placeholder="Confirm your new password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          <PasswordComplexityInfo />

          <Button label="Update password" />
        </form>
      )}
    </>
  );
}
