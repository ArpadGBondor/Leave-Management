import { useNavigate } from 'react-router-dom';
import { useRequestsContext } from '../../context/requests/useRequestsContext';
import {
  LeaveRequest,
  RequestTypeEnum,
} from '../../interface/LeaveRequest.interface';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { toast } from 'react-toastify';

interface RequestApproveRejectProp {
  request: LeaveRequest;
}

export default function RequestApproveReject({
  request,
}: RequestApproveRejectProp) {
  const { approveRequest, rejectRequest, applyCancellationOfApprovedLeave } =
    useRequestsContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const navigate = useNavigate();

  const onApprove = async () => {
    startLoading('approve-request');
    try {
      if (request.requestType === RequestTypeEnum.Cancellation) {
        await applyCancellationOfApprovedLeave({ id: request.id });
      } else {
        await approveRequest({ id: request.id });
      }
      toast.info('Request approved');
      navigate('/manage-requests');
    } catch (error: any) {
      toast.error(error.message || `Could not approve request`);
    } finally {
      stopLoading('approve-request');
    }
  };

  const onReject = async () => {
    startLoading('reject-request');
    try {
      await rejectRequest({ id: request.id });
      toast.info('Request rejected');
      navigate('/manage-requests');
    } catch (error: any) {
      toast.error(error.message || `Could not reject request`);
    } finally {
      stopLoading('reject-request');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-stretch gap-1 md:gap-4">
        <Button
          type="button"
          label={
            request.requestType === RequestTypeEnum.Cancellation
              ? 'Approve cancellation'
              : 'Approve request'
          }
          onClick={onApprove}
        />
        <Button
          type="button"
          variant="danger"
          label={
            request.requestType === RequestTypeEnum.Cancellation
              ? 'Reject cancellation'
              : 'Reject request'
          }
          onClick={onReject}
        />
        <Button
          type="button"
          variant="secondary"
          label={'Back'}
          onClick={() => navigate('/manage-requests')}
        />
      </div>
    </>
  );
}
