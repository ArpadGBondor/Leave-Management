import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import OAuth from '../components/auth/OAuth';
import Button from '../components/buttons/Button';
import useAuthStatus from '../hooks/useAuthStatus';
import { auth } from '../firebase.config';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { loggedIn, checkingStatus } = useAuthStatus();
  const { email, password } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingStatus && loggedIn) {
      navigate('/');
    }
  }, [loggedIn, checkingStatus]);

  const onChange = (e: any) =>
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast.error('Bad User Credentials');
    }
  };

  return (
    <>
      <div className="p-4 md:p-8 m-4 md:m-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50">
        <h1 className="text-4xl font-bold text-brand-purple-700 mb-10">
          Login
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-8">
          <div>
            <label className="block pb-2 text-brand-green-800" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="block w-full bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900 py-2 px-4 rounded-full"
              placeholder="Enter your email address."
              name="email"
              value={email}
              onChange={onChange}
              autoComplete="username"
            />
          </div>

          <div>
            <label
              className="block pb-2  text-brand-green-800"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="block w-full bg-brand-green-200 hover:bg-brand-green-100 text-brand-purple-900  py-2 px-4 rounded-full"
              placeholder="Enter your password."
              name="password"
              value={password}
              onChange={onChange}
              autoComplete="current-password"
            />
          </div>

          <Button label="Sign In" />
        </form>

        <OAuth />
      </div>
    </>
  );
}
