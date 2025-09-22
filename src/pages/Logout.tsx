import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import useAuthStatus from '../hooks/useAuthStatus';
import Spinner from '../components/spinner/Spinner';
import { auth } from '../firebase.config';

export default function Logout() {
  const { loggedIn, checkingStatus } = useAuthStatus();

  const navigate = useNavigate();

  const attempted = useRef(false);

  useEffect(() => {
    if (!checkingStatus && !attempted.current) {
      attempted.current = true;
      if (loggedIn) {
        signOut(auth)
          .catch((error) => {
            console.error('Sign out error:', error);
          })
          .finally(() => navigate('/login'));
      } else {
        navigate('/login');
      }
    }
  }, [navigate, loggedIn, checkingStatus]);

  return (
    <div className="p-8 m-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50">
      <h1 className="text-4xl font-bold text-brand-purple-600">Logout</h1>
      <div className="mt-10 flex flex-col justify-center items-center">
        <Spinner variant="secondary" />
      </div>
    </div>
  );
}
