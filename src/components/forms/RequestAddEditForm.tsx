import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firebase_collections } from '../../../lib/firebase_collections';
import { db } from '../../firebase.config';
import { useUserContext } from '../../context/user/useUserContext';
import {
  LeaveRequestType,
  leaveRequestTypeOptions,
} from '../../interface/LeaveRequest.interface';
import NavButton from '../buttons/NavButton';
import Button from '../buttons/Button';

import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { toast } from 'react-toastify';
import { handleInputChange } from '../../utils/onFormDataChange';
import SelectInput from '../inputs/SelectInput';
import DateInput from '../inputs/DateInput';
import TextInput from '../inputs/TextInput';
import { useRequestsContext } from '../../context/requests/useRequestsContext';
import { useNavigate } from 'react-router-dom';

interface RequestAddEditFormProps {
  requestId?: string;
}

export default function RequestAddEditForm({
  requestId,
}: RequestAddEditFormProps) {
  const [formError, setFormError] = useState('');
  const { user } = useUserContext();
  const defaultRequest: {
    from: string;
    to: string;
    id: string;
    numberOfWorkdays: number;
    requestType: LeaveRequestType;
    description: string;
  } = {
    id: 'new',
    from: '',
    to: '',
    numberOfWorkdays: 0,
    requestType: leaveRequestTypeOptions[0],
    description: '',
  };
  const [formData, setFormData] = useState({ ...defaultRequest });
  const defaultErrors = {
    id: '',
    from: '',
    to: '',
    numberOfWorkdays: '',
    requestType: '',
    description: '',
  };
  const [errors, setErrors] = useState(defaultErrors);
  const { startLoading, stopLoading } = useLoadingContext();
  const { createRequest, updateRequest } = useRequestsContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!requestId) return setFormError("Can't find request.");
    if (!user?.id) return setFormError("Can't find logged in user.");
    if (requestId === 'new') return; /* New request, nothing to load */
    startLoading('fetch-request-details');
    const ref = doc(db, firebase_collections.REQUESTS, requestId);
    getDoc(ref)
      .then((snap) => {
        if (!snap.exists()) return setFormError("Can't find request.");

        const doc = snap.data();
        if (doc.requestedById !== user.id)
          return setFormError(
            'This request does not belong to the currently logged in user.'
          );

        return setFormData({
          id: requestId,
          from: doc.from,
          to: doc.to,
          numberOfWorkdays: doc.numberOfWorkdays,
          requestType: doc.requestType,
          description: doc.description,
        });
      })
      .finally(() => {
        stopLoading('fetch-request-details');
      });
  }, [requestId]);

  const isEdit = Boolean(requestId !== 'new');

  const { id, from, to, numberOfWorkdays, requestType, description } = formData;

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const validateRequest = () => {
    let valid = true;

    // From validation
    if (!from.trim()) {
      setError('from', 'Please Please enter start date.');
      valid = false;
    } else {
      setError('from', '');
    }

    // From validation
    if (!to.trim()) {
      setError('to', 'Please Please enter end date.');
      valid = false;
    } else {
      setError('to', '');
    }

    if (valid && new Date(from) >= new Date(to)) {
      setError('to', 'Leave end date should be later than start date.');
      valid = false;
    }

    return valid;
  };

  const onSubmitUpdateRequest = async (e: any) => {
    e.preventDefault();

    startLoading('add-edit-request');
    try {
      if (!user) {
        toast.error('User is not logged in.');
        return;
      }

      if (!validateRequest()) {
        toast.error('Please fill in all fields');
        return;
      }

      if (isEdit) {
        await updateRequest({
          id,
          requestType,
          from,
          to,
          numberOfWorkdays,
          description,
        });
      } else {
        await createRequest(
          requestType,
          from,
          to,
          numberOfWorkdays,
          description
        );
      }

      // Call function to update or edit request -> Add 2 functions to Request Provider
      if (isEdit) {
        toast.info('Request details updated');
      } else {
        toast.info('Request created');
      }
      navigate('/requests');
    } catch (error: any) {
      toast.error(
        error.message || `Could not ${isEdit ? 'update' : 'create'} request`
      );
    } finally {
      stopLoading('add-edit-request');
    }
  };

  // Prevent editing if request does not belong to user
  if (formError)
    return (
      <>
        <h2 className="text-4xl font-bold text-red-700">{formError}</h2>
        <div className="flex flex-col items-center">
          <NavButton label="Back" link="/requests" icon="FaArrowLeft" />
        </div>
      </>
    );

  return (
    <>
      <h2 className="text-4xl font-bold text-brand-purple-700">
        {isEdit ? 'Edit request' : 'Add request'}
      </h2>
      <form
        onSubmit={onSubmitUpdateRequest}
        className="flex flex-col gap-4 mb-8"
      >
        <p className="text-brand-green-800">Requested by: {user?.name}</p>
        <SelectInput
          id="requestType"
          label="Leave type"
          name="requestType"
          value={requestType}
          options={leaveRequestTypeOptions}
          placeholder="-- Select Request Type --"
          onChange={(e) => handleInputChange(e, setFormData)}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <DateInput
            id="from"
            label="Leave start date"
            name="from"
            value={from}
            onChange={(e) => handleInputChange(e, setFormData, setError)}
            placeholder="YYYY-MM-DD"
            error={errors.from}
          />

          <DateInput
            id="to"
            label="Leave end date"
            name="to"
            value={to}
            onChange={(e) => handleInputChange(e, setFormData, setError)}
            placeholder="YYYY-MM-DD"
            error={errors.to}
          />
        </div>

        <TextInput
          id="description"
          label="Additional information"
          name="description"
          value={description}
          onChange={(e) => handleInputChange(e, setFormData, setError)}
          placeholder="You can share any additional information about your leave here."
          error={errors.description}
        />

        <Button label="Submit request" />
      </form>
    </>
  );
}
