import { useNavigate } from 'react-router-dom';
import { useRequestsContext } from '../../context/requests/useRequestsContext';
import { LeaveRequest } from '../../interface/LeaveRequest.interface';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { toast } from 'react-toastify';

interface RejectedLeaveActionsProp {
  request: LeaveRequest;
}

export default function RejectedLeaveActions({
  request,
}: RejectedLeaveActionsProp) {
  const { deleteRejectedLeave } = useRequestsContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const navigate = useNavigate();

  const onDelete = async () => {
    startLoading('delete-rejected-leave');
    try {
      await deleteRejectedLeave({ id: request.id });
      toast.info('Request rejected');
      navigate('/rejected-leaves');
    } catch (error: any) {
      toast.error(error.message || `Could not reject request`);
    } finally {
      stopLoading('delete-rejected-leave');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-stretch gap-1 md:gap-4">
        {/* <Button type="button" label={'Approve request'} onClick={onApprove} /> */}
        <Button
          type="button"
          variant="danger"
          label="Delete rejected leave"
          onClick={onDelete}
        />
        <Button
          type="button"
          variant="secondary"
          label={'Back'}
          onClick={() => navigate('/rejected-leaves')}
        />
      </div>
    </>
  );
}
