import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/spinner/Spinner';
import { useUserContext } from '../context/user/useUserContext';
import PageWrapper from '../components/pageWrapper/PageWrapper';

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
    <PageWrapper title={'Logout'} size={'max-w-2xl'}>
      <div className="p-10 flex flex-col justify-center items-center">
        <Spinner variant="secondary" />
      </div>
    </PageWrapper>
  );
}
