import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import OAuth from '../components/auth/OAuth';
import Button from '../components/buttons/Button';
import useAuthStatus from '../hooks/useAuthStatus';
import { auth, db } from '../firebase.config';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { loggedIn, checkingStatus } = useAuthStatus();
  const { name, email, password, confirmPassword } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingStatus && loggedIn) {
      navigate('/');
    }
  }, [loggedIn, checkingStatus, navigate]);

  const onChange = (e: any) =>
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
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
        timestamp: serverTimestamp(),
      });

      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Could not register user');
    }
  };

  return (
    <div className="p-4 md:p-8 m-4 md:m-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50">
      <h1 className="text-4xl font-bold text-brand-purple-700 mb-10">
        Register
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block pb-2 text-brand-green-800" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="block w-full bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900 py-2 px-4 rounded-full"
            placeholder="Enter your name"
            name="name"
            value={name}
            onChange={onChange}
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block pb-2 text-brand-green-800" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="block w-full bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900 py-2 px-4 rounded-full"
            placeholder="Enter your email address"
            name="email"
            value={email}
            onChange={onChange}
            autoComplete="username"
          />
        </div>

        <div>
          <label className="block pb-2 text-brand-green-800" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="block w-full bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900 py-2 px-4 rounded-full"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={onChange}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label
            className="block pb-2 text-brand-green-800"
            htmlFor="passconfirmPasswordword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="block w-full bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900 py-2 px-4 rounded-full"
            placeholder="Confirm your password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            autoComplete="new-password"
          />
        </div>

        <Button label="Register" />
      </form>

      <OAuth />
    </div>
  );
}
