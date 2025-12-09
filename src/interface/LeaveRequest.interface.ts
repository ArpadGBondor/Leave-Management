import { Timestamp } from 'firebase/firestore';

export interface LeaveRequest {
  id: string;
  requestedById: string;
  requestedByName: string; // Let's store name too, so we don't have to look it up on listing requests
  approvedById: string;
  approvedByName: string; // Let's store name too, so we don't have to look it up on listing requests

  from: string;
  to: string;

  numberOfWorkdays: number;
  // let users adjust. maybe the calculation was wrong, maybe they want partial day leaves
  isNumberOfWorkdaysOverwritten: boolean;
  numberOfWorkdaysOverwritten: number;

  // Annual / Other
  leaveType: LeaveType;

  // New request / Cancellation request / Change request / Approved request
  requestType: RequestType;

  description: string;

  // Require managers to give feedback on what's wrong with the request
  reasonOfRejection?: string;

  created?: Timestamp;
  updated?: Timestamp;
  year: string; // store year separately for indexing
}

export const LeaveTypeEnum = {
  Annual: 'Annual Leave',
  Other: 'Other Leave',
} as const;

export type LeaveType = (typeof LeaveTypeEnum)[keyof typeof LeaveTypeEnum];

export const leaveTypeOptions: LeaveType[] = Object.values(LeaveTypeEnum);

export const RequestTypeEnum = {
  New: 'New request',
  // unapproved, new request, details can change, there is only one document either in requests or rejected-leaves collection.
  Cancellation: 'Cancellation request',
  // approved request, no details should change, 3 collections can possible contain document with the same ID, approval should remove the document with the same ID from 3 collections
  Change: 'Change request',
  // approved request, details can change, 3 collections can possible contain document with the same ID
  Approved: 'Approved request',
  // approved request, no details change, just in the approved-leaves collection
} as const;

export type RequestType =
  (typeof RequestTypeEnum)[keyof typeof RequestTypeEnum];

export const requestTypeOptions: RequestType[] = Object.values(RequestTypeEnum);
