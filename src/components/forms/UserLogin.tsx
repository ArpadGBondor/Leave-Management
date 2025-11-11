import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextInput from '../inputs/TextInput';
import Button from '../buttons/Button';
import { useUserContext } from '../../context/user/useUserContext';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { handleInputChange } from '../../utils/onFormDataChange';
import { emailValidator, passwordValidator } from '../../utils/fieldValidators';

export default function UserLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const defaultErrors = {
    email: '',
    password: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { loggedIn, loading: userLoading, login } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const { email, password } = formData;

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

  const validateLogin = () => {
    let valid = true;

    // Email validation
    let emailValid = emailValidator(email);
    valid &&= emailValid.valid;
    setError('email', emailValid.message);

    // Check password
    let passwordValid = passwordValidator(password);
    valid &&= passwordValid.valid;
    setError('password', passwordValid.message);

    return valid;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    startLoading('login');
    try {
      if (!validateLogin()) {
        toast.error('Please fill in all fields');
        return;
      }

      await login(email, password);
    } catch (error) {
      toast.error('Bad User Credentials');
    } finally {
      stopLoading('login');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-8">
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

      <TextInput
        id="password"
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => handleInputChange(e, setFormData, setError)}
        placeholder="Enter your password"
        autoComplete="password"
        error={errors.password}
      />

      <Button label="Sign In" />

      <div className="text-center">
        <Link
          to="/forgot-password"
          className="text-brand-purple-600 hover:text-brand-purple-800 underline cursor-pointer"
        >
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}
