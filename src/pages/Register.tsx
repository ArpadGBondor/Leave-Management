import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import OAuth from '../components/auth/OAuth';
import Button from '../components/buttons/Button';
import TextInput from '../components/inputs/TextInput';
import FileInput from '../components/inputs/FileInput';
import useAuthStatus from '../hooks/useAuthStatus';
import { auth, db } from '../firebase.config';

export default function Register() {
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

  const { loggedIn, checkingStatus } = useAuthStatus();
  const { name, email, password, confirmPassword, photo } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingStatus && loggedIn) {
      navigate('/');
    }
  }, [loggedIn, checkingStatus, navigate]);

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

  const validateRegistration = () => {
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

    // Check password
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

    // Photo validation
    if (!photo.trim()) {
      setError('photo', 'Please select a photo.');
      valid = false;
    } else {
      setError('photo', '');
    }

    return valid;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateRegistration()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Create user with email & password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Optionally set display name
      await updateProfile(user, { displayName: name });

      // Write user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        photo,
        timestamp: serverTimestamp(),
      });

      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Could not register user');
    }
  };

  return (
    <div className="p-4 md:p-8 m-4 md:m-8 md:min-w-sm lg:min-w-md max-w-lg rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto">
      <h1 className="text-4xl font-bold text-brand-purple-700 mb-4">
        Register
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-8">
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
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onPhotoChange}
            error={errors.photo}
            setError={(msg) => setError('photo', msg)}
          />
        </div>

        <Button label="Register" />
      </form>

      <OAuth />
    </div>
  );
}
