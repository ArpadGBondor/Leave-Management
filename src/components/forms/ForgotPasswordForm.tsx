import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextInput from '../inputs/TextInput';
import Button from '../buttons/Button';
import { useUserContext } from '../../context/user/useUserContext';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { handleInputChange } from '../../utils/onFormDataChange';
import { emailValidator } from '../../utils/fieldValidators';

export default function ForgotPasswordForm() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const defaultErrors = {
    email: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { loggedIn, loading: userLoading, forgotPassword } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const { email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && loggedIn) {
      navigate('/');
    }
  }, [loggedIn, userLoading]);

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const validateEmail = () => {
    let valid = true;

    // Email validation
    let emailValid = emailValidator(email);
    valid &&= emailValid.valid;
    setError('email', emailValid.message);

    return valid;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    startLoading('send-password-reset-email');
    try {
      if (!validateEmail()) {
        toast.error('Please fill in all fields');
        return;
      }

      await forgotPassword(email);
      toast.info('Password reset email sent');
      navigate('/login');
    } catch (error) {
      toast.error("Couldn't send email");
    } finally {
      stopLoading('send-password-reset-email');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextInput
        id="email"
        label="Email address"
        name="email"
        type="email"
        value={email}
        onChange={(e) => handleInputChange(e, setFormData, setError)}
        placeholder="Enter your email address"
        autoComplete="email"
        error={errors.email}
      />

      <Button label="Send password reset email" />
    </form>
  );
}
