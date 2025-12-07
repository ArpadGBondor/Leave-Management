import { createContext } from 'react';
import {
  LeaveRequest,
  LeaveType,
} from '../../interface/LeaveRequest.interface';

export type RequestsState = {
  ownRequestCount: number;
  ownApprovedLeavesCount: number;
  ownRejectedLeavesCount: number;
  managableRequestCount: number;
  managableApprovedLeavesCount: number;
  managableRejectedLeavesCount: number;
};

export interface RequestsContextType extends RequestsState {
  createRequest: (
    leaveType: LeaveType,
    from: string,
    to: string,
    numberOfWorkdays: number,
    isNumberOfWorkdaysOverwritten: boolean,
    numberOfWorkdaysOverwritten: number,
    description: string,
    requestedById: string,
    requestedByName: string
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
  reRequestRejectedLeave: (
    data: { id: string } & Partial<LeaveRequest>
  ) => Promise<void>;
  requestChangeToApprovedLeave: (
    data: { id: string } & Partial<LeaveRequest>
  ) => Promise<void>;
  requestCancellationOfApprovedLeave: (data: { id: string }) => Promise<void>;
  applyCancellationOfApprovedLeave: (data: { id: string }) => Promise<void>;
  unapproveApprovedLeave: (data: { id: string }) => Promise<void>;
  unrejectRejectedLeave: (data: { id: string }) => Promise<void>;
}

export const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);
