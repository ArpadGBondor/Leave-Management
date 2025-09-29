import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import { useUserContext } from '../../context/user/useUserContext';

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  const defaultErrors = {
    currentPassword: '',
    password: '',
    confirmPassword: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { updatePassword } = useUserContext();

  const { currentPassword, password, confirmPassword } = formData;

  const onChange = (e: any) => {
    setError(e.target.name, '');
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const validateUser = () => {
    let valid = true;

    // Check current password
    if (!currentPassword.trim()) {
      setError('currentPassword', 'Please enter your password.');
      valid = false;
    } else if (currentPassword.trim().length < 6) {
      setError('currentPassword', 'Password is too short.');
      valid = false;
    } else {
      setError('currentPassword', '');
    }

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

  const onSubmitUpdateUser = async (e: any) => {
    e.preventDefault();

    if (!validateUser()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updatePassword(currentPassword, password);

      toast.info('Password updated');
    } catch (error: any) {
      toast.error(error.message || 'Could not update password');
    }
  };

  return (
    <form onSubmit={onSubmitUpdateUser} className="flex flex-col gap-4 w-full">
      <h2 className="text-4xl font-bold text-brand-purple-700 mb-4">
        Update password
      </h2>
      <TextInput
        id="currentPassword"
        label="Current password"
        name="currentPassword"
        type="password"
        value={currentPassword}
        onChange={onChange}
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
        onChange={onChange}
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
        onChange={onChange}
        placeholder="Confirm your new password"
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <Button label="Update password" />
    </form>
  );
}
