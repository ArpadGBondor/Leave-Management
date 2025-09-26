import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/spinner/Spinner';
import { useUserContext } from '../context/user/useUserContext';

export default function Logout() {
  const { loggedIn, loading: userLoading, logout } = useUserContext();

  const navigate = useNavigate();

  const attempted = useRef(false);

  useEffect(() => {
    if (!userLoading && !attempted.current) {
      attempted.current = true;
      if (loggedIn) {
        logout()
          .catch((error) => {
            console.error('Sign out error:', error);
          })
          .finally(() => navigate('/login'));
      } else {
        navigate('/login');
      }
    }
  }, [navigate, loggedIn, userLoading]);

  return (
    <div className="p-8 m-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50">
      <h1 className="text-4xl font-bold text-brand-purple-600">Logout</h1>
      <div className="mt-10 flex flex-col justify-center items-center">
        <Spinner variant="secondary" />
      </div>
    </div>
  );
}
