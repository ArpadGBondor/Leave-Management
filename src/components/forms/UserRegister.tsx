import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import FileInput from '../inputs/FileInput';
import { useUserContext } from '../../context/user/useUserContext';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import {
  handleInputChange,
  handleValueChange,
} from '../../utils/onFormDataChange';
import {
  validateEmailFormat,
  validatePasswordComplexity,
  validatePasswordsMatching,
  validateRequiredField,
} from '../../utils/fieldValidators';

export default function UserRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: '',
  });
  const defaultErrors = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { loggedIn, loading: userLoading, register } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const { name, email, password, confirmPassword, photo } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && loggedIn) {
      navigate('/');
    }
  }, [loggedIn, userLoading, navigate]);

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const clearErrors = () =>
    setErrors({
      ...defaultErrors,
    });

  const validateRegistration = () => {
    let valid = true;

    clearErrors();

    // Name validation
    valid &&= validateRequiredField(
      formData,
      'name',
      'enter your name',
      setError
    );

    // Email validation
    valid &&= validateRequiredField(
      formData,
      'email',
      'enter your email',
      setError
    );
    valid &&= validateEmailFormat(formData, 'email', setError);

    // Check password
    valid &&= validateRequiredField(
      formData,
      'password',
      'enter your password',
      setError
    );
    valid &&= validatePasswordComplexity(formData, 'password', setError);
    valid &&= validatePasswordsMatching(
      formData,
      'password',
      'confirmPassword',
      setError
    );

    // Photo validation
    valid &&= validateRequiredField(
      formData,
      'photo',
      'select a photo',
      setError
    );

    return valid;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    startLoading('register');
    try {
      if (!validateRegistration()) {
        toast.error('Please fill in all fields');
        return;
      }

      await register(email, password, name, photo);

      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Could not register user');
    } finally {
      stopLoading('register');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-8">
      <TextInput
        id="name"
        label="Name"
        name="name"
        value={name}
        onChange={(e) => handleInputChange(e, setFormData, setError)}
        placeholder="Enter your full name"
        autoComplete="name"
        error={errors.name}
      />

      <TextInput
        id="email"
        label="Email address"
        name="email"
        type="email"
        value={email}
        onChange={(e) => handleInputChange(e, setFormData, setError)}
        placeholder="Enter your email address"
        autoComplete="username"
        error={errors.email}
      />
      <div className="w-full flex flex-col lg:flex-row justify-stretch items-stretch lg:items-start gap-4">
        <div className="flex flex-col gap-4">
          <TextInput
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => handleInputChange(e, setFormData, setError)}
            placeholder="Enter your password"
            autoComplete="new-password"
            error={errors.password}
          />

          <TextInput
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => handleInputChange(e, setFormData, setError)}
            placeholder="Confirm your password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
        </div>
        <FileInput
          id="photo"
          label="Profile picture"
          name="photo"
          value={photo}
          onChange={(value: string | null) =>
            handleValueChange('photo', value ?? '', setFormData)
          }
          error={errors.photo}
          setError={(msg) => setError('photo', msg)}
        />
      </div>

      <Button label="Register" />
    </form>
  );
}
