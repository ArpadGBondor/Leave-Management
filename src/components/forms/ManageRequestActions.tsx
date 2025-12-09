import { useNavigate } from 'react-router-dom';
import { useRequestsContext } from '../../context/requests/useRequestsContext';
import {
  LeaveRequest,
  RequestTypeEnum,
} from '../../interface/LeaveRequest.interface';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { toast } from 'react-toastify';
import { useState } from 'react';
import TextAreaInput from '../inputs/TextAreaInput';
import { handleInputChange } from '../../utils/onFormDataChange';
import { validateRequiredField } from '../../utils/fieldValidators';

interface ManageRequestActionsProp {
  request: LeaveRequest;
}

export default function ManageRequestActions({
  request,
}: ManageRequestActionsProp) {
  const [formData, setFormData] = useState({
    reasonOfRejection: request.reasonOfRejection ?? '',
  });
  const defaultErrors: {
    reasonOfRejection: string;
  } = {
    reasonOfRejection: '',
  };
  const [errors, setErrors] = useState(defaultErrors);

  const { approveRequest, rejectRequest, applyCancellationOfApprovedLeave } =
    useRequestsContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const navigate = useNavigate();

  const { reasonOfRejection } = formData;

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

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

  const validateRejection = <T extends { reasonOfRejection: string }>(
    formData: T,
    setError: (field: keyof T, message: string) => void
  ) => {
    let valid = true;

    // validate that start date is not empty
    valid &&= validateRequiredField(
      formData,
      'reasonOfRejection',
      'enter the reason of rejection',
      setError
    );

    return valid;
  };

  const onReject = async () => {
    startLoading('reject-request');
    try {
      if (!validateRejection(formData, setError)) {
        toast.error('Form is not ready to submit');
        return;
      }
      await rejectRequest({ id: request.id, reasonOfRejection });
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
      <TextAreaInput
        id="reasonOfRejection"
        label="Reason of rejection"
        name="reasonOfRejection"
        value={reasonOfRejection}
        onChange={(e) => handleInputChange(e, setFormData, setError)}
        placeholder="In case of rejection, please let the team member know the reason."
        error={errors.reasonOfRejection}
      />

      <div className="flex flex-col-reverse md:flex-row md:justify-stretch gap-1 md:gap-4">
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
        <Button
          type="button"
          label={
            request.requestType === RequestTypeEnum.Cancellation
              ? 'Approve cancellation'
              : 'Approve request'
          }
          onClick={onApprove}
        />
      </div>
      <Button
        label="Edit request as the requesting team member"
        onClick={() =>
          navigate(`/manage-new-request/${request.requestedById}/${request.id}`)
        }
        variant="danger"
      />
    </>
  );
}
