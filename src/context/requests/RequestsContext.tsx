import { createContext } from 'react';
import {
  LeaveRequest,
  LeaveRequestType,
} from '../../interface/LeaveRequest.interface';

export type RequestsState = {
  ownApprovedLeavesCount: number;
  ownRejectedLeavesCount: number;
  ownRequestCount: number;
  managableRequestCount: number;
};

export interface RequestsContextType extends RequestsState {
  createRequest: (
    requestType: LeaveRequestType,
    from: string,
    to: string,
    numberOfWorkdays: number,
    isNumberOfWorkdaysOverwritten: boolean,
    numberOfWorkdaysOverwritten: number,
    description: string
  ) => Promise<void>;
  updateRequest: (
    data: { id: string } & Partial<LeaveRequest>
  ) => Promise<void>;
  approveRequest: (
    data: { id: string } & Partial<LeaveRequest>
  ) => Promise<void>;
  rejectRequest: (
    data: { id: string } & Partial<LeaveRequest>
  ) => Promise<void>;
  deleteRequest: (data: { id: string }) => Promise<void>;
  deleteRejectedLeave: (data: { id: string }) => Promise<void>;
}

export const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);
