import { useNavigate } from 'react-router-dom';
import { useRequestsContext } from '../../context/requests/useRequestsContext';
import { LeaveRequest } from '../../interface/LeaveRequest.interface';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '../../context/confirmation/useConfirmationContext';
import { defaultConfirmationOptions } from '../../context/confirmation/types';

interface ManageApprovedLeaveActionsProp {
  request: LeaveRequest;
}

export default function ManageApprovedLeaveActions({
  request,
}: ManageApprovedLeaveActionsProp) {
  const { unapproveApprovedLeave } = useRequestsContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const navigate = useNavigate();

  const { confirm } = useConfirmationContext();

  const onUnapproveConfirm = () => {
    confirm(
      defaultConfirmationOptions(
        'You’re about to unapprove this approved request. After this action, the request will became pending.',
        onUnapprove
      )
    );
  };

  const onUnapprove = async () => {
    startLoading('unapprove-approved-request');
    try {
      await unapproveApprovedLeave({ id: request.id });
      toast.info('Request unapproved');
      onBack();
    } catch (error: any) {
      toast.error(error.message || `Could not unapprove request`);
    } finally {
      stopLoading('unapprove-approved-request');
    }
  };

  const onBack = () => navigate('/manage-approved-leaves');

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-stretch gap-1 md:gap-4">
        <Button
          type="button"
          variant="danger"
          label={'Unapprove request'}
          onClick={onUnapproveConfirm}
        />
        {/* <Button
          type="button"
          variant="secondary"
          label={'Back'}
          onClick={onBack}
        /> */}
      </div>
    </>
  );
}
