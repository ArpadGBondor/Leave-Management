import { useNavigate } from 'react-router-dom';
import { useRequestsContext } from '../../context/requests/useRequestsContext';
import { LeaveRequest } from '../../interface/LeaveRequest.interface';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { toast } from 'react-toastify';

interface ManageRejectedLeaveActionsProp {
  request: LeaveRequest;
}

export default function ManageRejectedLeaveActions({
  request,
}: ManageRejectedLeaveActionsProp) {
  const { unrejectRejectedLeave } = useRequestsContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const navigate = useNavigate();

  const onReopen = async () => {
    startLoading('unapprove-rejected-request');
    try {
      await unrejectRejectedLeave({ id: request.id });
      toast.info('Request reopened');
      onBack();
    } catch (error: any) {
      toast.error(error.message || `Could not reopen request`);
    } finally {
      stopLoading('unapprove-rejected-request');
    }
  };

  const onBack = () => navigate('/manage-rejected-leaves');

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-stretch gap-1 md:gap-4">
        <Button
          type="button"
          variant="secondary"
          label={'Back'}
          onClick={onBack}
        />
        <Button
          type="button"
          variant="primary"
          label={'Reopen Request'}
          onClick={onReopen}
        />
      </div>
    </>
  );
}
