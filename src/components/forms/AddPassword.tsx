import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import { useUserContext } from '../../context/user/useUserContext';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { handleInputChange } from '../../utils/onFormDataChange';

export default function AddPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const defaultErrors = {
    password: '',
    confirmPassword: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { addPassword } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const { password, confirmPassword } = formData;

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const validatePassword = () => {
    let valid = true;

    // Check new password
    if (!password.trim()) {
      setError('password', 'Please enter your password.');
      valid = false;
    } else if (password.trim().length < 6) {
      setError('password', 'Password is too short.');
      valid = false;
    } else {
      setError('password', '');
    }

    if (password !== confirmPassword) {
      // Check password confirmation
      setError('confirmPassword', 'Passwords do not match');
      valid = false;
    } else {
      setError('confirmPassword', '');
    }

    return valid;
  };

  const onSubmitAddPassword = async (e: any) => {
    e.preventDefault();

    startLoading('add-password');
    try {
      if (!validatePassword()) {
        toast.error('Please fill in all fields');
        return;
      }

      await addPassword(password);

      toast.info('Password added');
    } catch (error: any) {
      toast.error(error.message || 'Could not update password');
    } finally {
      stopLoading('add-password');
    }
  };

  return (
    <form onSubmit={onSubmitAddPassword} className="flex flex-col gap-4 w-full">
      <h2 className="text-4xl font-bold text-brand-purple-700 mb-4">
        Add password
      </h2>

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

      <Button label="Add password" />
    </form>
  );
}
