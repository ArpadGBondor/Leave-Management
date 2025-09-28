import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import { useUserContext } from '../../context/user/useUserContext';

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

  const { password, confirmPassword } = formData;

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
      await addPassword(password);

      toast.info('Password updated');
    } catch (error: any) {
      toast.error(error.message || 'Could not update password');
    }
  };

  return (
    <form onSubmit={onSubmitUpdateUser} className="flex flex-col gap-4 mb-8">
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

      <Button label="Add password" />
    </form>
  );
}
