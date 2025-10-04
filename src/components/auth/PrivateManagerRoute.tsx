import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../../context/user/useUserContext';
import Spinner from '../spinner/Spinner';

export type PrivateManagerRouteProps = {
  restrictToClaim: 'ADMIN' | 'SUPER_ADMIN';
};

const PrivateManagerRoute = ({ restrictToClaim }: PrivateManagerRouteProps) => {
  const { user, loggedIn, loading: userLoading } = useUserContext();

  if (userLoading) return <Spinner />;

  if (loggedIn && user?.claims?.[restrictToClaim]) {
    return <Outlet />;
  }

  if (loggedIn) {
    return <Navigate to="/unauthorised" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateManagerRoute;
