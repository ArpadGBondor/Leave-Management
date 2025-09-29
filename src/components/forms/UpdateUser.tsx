import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import FileInput from '../inputs/FileInput';
import { useUserContext } from '../../context/user/useUserContext';
import SelectInput from '../inputs/SelectInput';
import { UserType, userTypeOptions } from '../../interface/user.interface';

export default function UpdateUser() {
  const defaultState: {
    name: string;
    email: string;
    photo: string;
    userType: UserType;
  } = {
    name: '',
    email: '',
    photo: '',
    userType: userTypeOptions[0],
  };
  const [formData, setFormData] = useState(defaultState);
  const defaultErrors = {
    name: '',
    email: '',
    photo: '',
    userType: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { user, updateUser } = useUserContext();
  const { name, email, photo, userType } = formData;

  useEffect(() => {
    if (user)
      setFormData((prevState) => ({
        ...prevState,
        name: user.name,
        email: user.email,
        photo: user.photo,
        userType: user.userType ?? userTypeOptions[0],
      }));
  }, [user]);

  const onPhotoChange = (newPhoto: string | null) =>
    setFormData((prevState) => ({
      ...prevState,
      photo: newPhoto ?? '',
    }));

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

    // Name validation
    if (!name.trim()) {
      setError('name', 'Please enter your name.');
      valid = false;
    } else {
      setError('name', '');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('email', 'Please enter your email address.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      setError('email', '');
    }

    // Photo validation
    if (!photo.trim()) {
      setError('photo', 'Please select a photo.');
      valid = false;
    } else {
      setError('photo', '');
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
      // Create user with email & password
      await updateUser({ name, email, photo, userType: userType });

      toast.info('Profile details updated');
    } catch (error: any) {
      toast.error(error.message || 'Could not update user');
    }
  };

  return (
    <form onSubmit={onSubmitUpdateUser} className="flex flex-col gap-4 w-full">
      <h2 className="text-4xl font-bold text-brand-purple-700 mb-4">
        Update user details
      </h2>
      <TextInput
        id="name"
        label="Name"
        name="name"
        value={name}
        onChange={onChange}
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
        onChange={onChange}
        placeholder="Enter your email address"
        autoComplete="email"
        disabled
        error={errors.email}
      />
      <FileInput
        id="photo"
        label="Profile picture"
        name="photo"
        value={photo}
        onChange={onPhotoChange}
        error={errors.photo}
        setError={(msg) => setError('photo', msg)}
      />

      <SelectInput
        id={'userType'}
        label={'User type'}
        name={'userType'}
        value={userType}
        options={userTypeOptions}
        onChange={onChange}
      />

      <Button label="Update user details" />
    </form>
  );
}
