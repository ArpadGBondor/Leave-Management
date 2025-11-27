import {
  RequestType,
  RequestTypeEnum,
} from '../../interface/LeaveRequest.interface';
import InfoBubble from './InfoBubble';

interface RequestTypeInfoProps {
  requestType: RequestType;
}

export default function RequestTypeInfo({ requestType }: RequestTypeInfoProps) {
  return (
    <>
      {requestType === RequestTypeEnum.New && (
        <InfoBubble>This is a new and unapproved leave request.</InfoBubble>
      )}
      {requestType === RequestTypeEnum.Change && (
        <InfoBubble>
          This is a change request to an already approved leave.
        </InfoBubble>
      )}
      {requestType === RequestTypeEnum.Cancellation && (
        <InfoBubble>
          This is a cancellation request to an already approved leave.
        </InfoBubble>
      )}
      {requestType === RequestTypeEnum.Approved && (
        <InfoBubble>This is an approved leave.</InfoBubble>
      )}
    </>
  );
}
