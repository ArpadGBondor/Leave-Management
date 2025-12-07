import { createContext } from 'react';
import { ConfirmationReducer } from './ConfirmationReducer';
import { ConfirmationOptions } from './types';

export type ConfirmationState = {
  isOpen: boolean;
  options: ConfirmationOptions | null;
};

type ConfirmationContextType = {
  state: ReturnType<typeof ConfirmationReducer>;
  confirm: (options: ConfirmationOptions) => void;
  close: () => void;
};

export const ConfirmationContext =
  createContext<ConfirmationContextType | null>(null);
