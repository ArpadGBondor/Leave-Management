import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import FileInput from '../inputs/FileInput';
import { useUserContext } from '../../context/user/useUserContext';
import SelectInput from '../inputs/SelectInput';
import { UserType, userTypeOptions } from '../../interface/User.interface';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import {
  handleInputChange,
  handleValueChange,
} from '../../utils/onFormDataChange';
import DateInput from '../inputs/DateInput';

export default function UserUpdate() {
  const defaultState: {
    name: string;
    email: string;
    photo: string;
    userType: UserType;
    serviceStartDate: string;
    serviceEndDate: string;
  } = {
    name: '',
    email: '',
    photo: '',
    userType: userTypeOptions[0],
    serviceStartDate: '',
    serviceEndDate: '',
  };
  const [formData, setFormData] = useState(defaultState);
  const defaultErrors = {
    name: '',
    email: '',
    photo: '',
    userType: '',
    serviceStartDate: '',
    serviceEndDate: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { user, updateUser } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const { name, email, photo, userType, serviceStartDate, serviceEndDate } =
    formData;

  useEffect(() => {
    if (user)
      setFormData((prevState) => ({
        ...prevState,
        name: user.name,
        email: user.email,
        photo: user.photo,
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

    // Name validation
    if (!name.trim()) {
      setError('name', 'Please enter your name.');
      valid = false;
    } else {
      setError('name', '');
    }

    // Photo validation
    if (!photo.trim()) {
      setError('photo', 'Please select a photo.');
      valid = false;
    } else {
      setError('photo', '');
    }

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

    startLoading('update-user');
    try {
      if (!user) {
        toast.error("There's no logged in user to update");
        return;
      }

      if (!validateUser()) {
        toast.error('Please fill in all fields');
        return;
      }

      await updateUser({
        name,
        email,
        photo,
        userType,
        id: user.id,
        serviceStartDate,
        serviceEndDate,
      });
      toast.info('Profile details updated');
    } catch (error: any) {
      toast.error(error.message || 'Could not update user');
    } finally {
      stopLoading('update-user');
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
        disabled
        error={errors.email}
      />

      <DateInput
        id="serviceStartDate"
        label="Employment start date"
        name="serviceStartDate"
        value={serviceStartDate}
        onChange={(e) => handleInputChange(e, setFormData, setError)}
        placeholder="DD-MM-YYYY"
        error={errors.serviceStartDate}
      />

      <DateInput
        id="serviceEndDate"
        label="Employment end date"
        name="serviceEndDate"
        value={serviceEndDate}
        onChange={(e) => handleInputChange(e, setFormData, setError)}
        placeholder="DD-MM-YYYY"
        error={errors.serviceEndDate}
      />

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

      <SelectInput
        id="userType"
        label="User type"
        name="userType"
        value={userType}
        options={userTypeOptions}
        placeholder="-- Select User Type --"
        onChange={(e) => handleInputChange(e, setFormData, setError)}
      />

      <Button label="Update user details" />
    </form>
  );
}
