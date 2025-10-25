import { createContext } from 'react';

export type RequestsState = {
  ownRequestCount: number;
  managableRequestCount: number;
};

export interface RequestsContextType extends RequestsState {}

export const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);
