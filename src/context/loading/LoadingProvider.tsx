import React, { useReducer, useMemo } from 'react';
import { LoadingContext } from './LoadingContext';
import { loadingReducer, LoadingState } from './LoadingReducer';
import { LOADING_START, LOADING_STOP } from '../types';

interface LoadingProviderProps {
  children: React.ReactNode;
}

const initialState: LoadingState = { active: new Set() };

const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  const startLoading = (key: string) => {
    dispatch({ type: LOADING_START, key });
  };

  const stopLoading = (key: string) => {
    dispatch({ type: LOADING_STOP, key });
  };

  const isLoading = state.active.size > 0;

  const value = useMemo(
    () => ({
      startLoading,
      stopLoading,
      isLoading,
    }),
    [isLoading] // only re-memoize when boolean changes
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export default LoadingProvider;
