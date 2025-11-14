import { Timestamp } from 'firebase/firestore';

export interface LeaveRequest {
  id: string;
  requestedById: string;
  requestedByName: string; // Let's store name too, so we don't have to look it up on listing requests
  approvedById: string; // I'd prefer to have same structure for approved leaves
  approvedByName: string; // Let's store name too, so we don't have to look it up on listing requests
  from: string;
  to: string;
  numberOfWorkdays: number;
  requestType: LeaveRequestType;
  description: string;
  created?: Timestamp;
  updated?: Timestamp;
  year: string; // store year separately for indexing
}

export const leaveRequestTypeOptions = ['Annual Leave', 'Other Leave'] as const;

export type LeaveRequestType = (typeof leaveRequestTypeOptions)[number];
