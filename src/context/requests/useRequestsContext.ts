import { useContext } from 'react';
import { RequestsContext } from './RequestsContext';

export const useRequestsContext = () => {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error(
      'useRequestsContext must be used within a RequestsProvider'
    );
  }
  return context;
};
