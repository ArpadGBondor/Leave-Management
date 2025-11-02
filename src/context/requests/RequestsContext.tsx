import { createContext } from 'react';
import {
  LeaveRequest,
  LeaveRequestType,
} from '../../interface/LeaveRequest.interface';

export type RequestsState = {
  ownRequestCount: number;
  managableRequestCount: number;
};

export interface RequestsContextType extends RequestsState {
  createRequest: (
    requestType: LeaveRequestType,
    from: string,
    to: string,
    numberOfWorkdays: number,
    description: string
  ) => Promise<void>;
  updateRequest: (
    data: { id: string } & Partial<LeaveRequest>
  ) => Promise<void>;
}

export const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);
