import { LeaveRequest, RequestType } from './LeaveRequest.interface';

export interface Leave {
  from: Date;
  to: Date;
  id?: string;
  numberOfWorkdays?: number;
  year?: string;
  requestType?: RequestType;
}

// If I need to add more fields to this object later, it is easier through this function
export function createLeaveObject(doc: LeaveRequest): Leave {
  return {
    from: new Date(doc.from),
    to: new Date(doc.to),
    id: doc.id,
    numberOfWorkdays: doc.isNumberOfWorkdaysOverwritten
      ? doc.numberOfWorkdaysOverwritten
      : doc.numberOfWorkdays,
    year: doc.year,
    requestType: doc.requestType,
  };
}
