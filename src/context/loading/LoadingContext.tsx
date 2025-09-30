import { createContext } from 'react';

export interface LoadingContextType {
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  isLoading: boolean;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);
