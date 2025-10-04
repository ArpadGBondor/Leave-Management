import React from 'react';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import Spinner from '../spinner/Spinner';

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useLoadingContext();

  if (!isLoading) return null;

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center bg-brand-green-900/40">
      <div className="flex flex-col justify-center items-center bg-brand-purple-50 border-4 border-brand-green-700 rounded-xl p-8">
        <Spinner size="lg" />
        <p className="text-2xl font-bold text-brand-purple-700 mt-2">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
