import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import OAuth from '../components/auth/OAuth';
import Button from '../components/buttons/Button';
import useAuthStatus from '../hooks/useAuthStatus';
import { auth } from '../firebase.config';
import TextInput from '../components/inputs/TextInput';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const defaultErrors = {
    email: '',
    password: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { loggedIn, checkingStatus } = useAuthStatus();
  const { email, password } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingStatus && loggedIn) {
      navigate('/');
    }
  }, [loggedIn, checkingStatus]);

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

  const validateLogin = () => {
    let valid = true;

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

    return valid;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateLogin()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast.error('Bad User Credentials');
    }
  };

  return (
    <>
      <div className="p-4 md:p-8 m-4 md:m-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50  overflow-auto">
        <h1 className="text-4xl font-bold text-brand-purple-700 mb-10">
          Login
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-8">
          <TextInput
            id="email"
            label="Email address"
            name="email"
            type="email"
            value={email}
            onChange={onChange}
            placeholder="Enter your email address"
            error={errors.email}
          />

          <TextInput
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={onChange}
            placeholder="Enter your password"
            error={errors.password}
          />

          <Button label="Sign In" />
        </form>

        <OAuth />
      </div>
    </>
  );
}
