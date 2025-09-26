import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../../context/user/useUserContext';
import Spinner from '../spinner/Spinner';

const PrivateRoute = () => {
  const { loggedIn, loading: userLoading } = useUserContext();
  if (userLoading) return <Spinner />;
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
