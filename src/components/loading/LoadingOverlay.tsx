import React from 'react';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import Spinner from '../spinner/Spinner';
import PageWrapper from '../pageWrapper/PageWrapper';

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useLoadingContext();

  if (!isLoading) return null;

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center bg-brand-green-900/40">
      <PageWrapper title={'Loading...'} size={'max-w-2xl'} isModal>
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    </div>
  );
};

export default LoadingOverlay;
