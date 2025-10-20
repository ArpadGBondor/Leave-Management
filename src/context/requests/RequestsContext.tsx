import { createContext } from 'react';

export interface RequestsContextType {
  requestCount: number;
}

export const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);
