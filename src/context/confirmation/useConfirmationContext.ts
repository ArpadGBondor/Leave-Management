import { useContext } from 'react';
import { ConfirmationContext } from './ConfirmationContext';

export const useConfirmationContext = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error(
      'useConfirmationContext must be used within a ConfirmationProvider'
    );
  }
  return context;
};
