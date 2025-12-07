import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { firebase_collections } from '../../../lib/firebase_collections';
import {
  LeaveRequest,
  LeaveType,
  LeaveTypeEnum,
  leaveTypeOptions,
  RequestType,
  RequestTypeEnum,
} from '../../interface/LeaveRequest.interface';
import NavButton from '../buttons/NavButton';
import Button from '../buttons/Button';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { toast } from 'react-toastify';
import { handleInputChange } from '../../utils/onFormDataChange';
import DateInput from '../inputs/DateInput';
import { useRequestsContext } from '../../context/requests/useRequestsContext';
import { useNavigate } from 'react-router-dom';
import { Leave } from '../../interface/Leave.interface';
import TextAreaInput from '../inputs/TextAreaInput';
import countWorkdays from '../../utils/countWorkdays';
import RadioInput from '../inputs/RadioInput';
import NumberInput from '../inputs/NumberInput';
import CheckboxInput from '../inputs/CheckboxInput';
import { useFirebase } from '../../hooks/useFirebase';
import RequestTypeInfo from '../info/RequestTypeInfo';
import { format } from 'date-fns';
import validateRequest from './RequestAddEditForm/validateRequest';
import ChangedFieldNotice from './RequestAddEditForm/ChangedFieldNotice';
import useLoadUserYearlyConfiguration from '../../hooks/useLoadUserYearlyConfiguration';
import User from '../../interface/User.interface';

interface RequestAddEditFormProps {
  requestId?: string;
  disabled?: boolean;
  setRequest?: React.Dispatch<React.SetStateAction<LeaveRequest | null>>;
  requestCollection?:
    | typeof firebase_collections.REQUESTS
    | typeof firebase_collections.APPROVED_LEAVES
    | typeof firebase_collections.REJECTED_LEAVES;
  user: User;
}

export default function RequestAddEditForm({
  requestId,
  disabled,
  setRequest,
  requestCollection = firebase_collections.REQUESTS,
  user,
}: RequestAddEditFormProps) {
  const [formError, setFormError] = useState('');
  const [requestType, setRequestType] = useState<RequestType>(
    RequestTypeEnum.New
  );
  const defaultRequest: {
    from: string;
    to: string;
    id: string;
    numberOfWorkdays: number;
    isNumberOfWorkdaysOverwritten: boolean;
    numberOfWorkdaysOverwritten: number;
    leaveType: LeaveType;
    description: string;
    requestedByName: string;
  } = {
    id: 'new',
    from: '',
    to: '',
    numberOfWorkdays: 0,
    isNumberOfWorkdaysOverwritten: false,
    numberOfWorkdaysOverwritten: 0,
    leaveType: LeaveTypeEnum.Annual,
    description: '',
    requestedByName: '',
  };
  const [formData, setFormData] = useState({ ...defaultRequest });
  const defaultErrors = {
    id: '',
    from: '',
    to: '',
    numberOfWorkdays: '',
    isNumberOfWorkdaysOverwritten: '',
    numberOfWorkdaysOverwritten: '',
    leaveType: '',
    description: '',
    requestedByName: '',
  };
  const [errors, setErrors] = useState(defaultErrors);
  const [requestsOfTheUser, setRequestsOfTheUser] = useState<Leave[]>([]);
  const [approvedLeavesOfTheUser, setApprovedLeavesOfTheUser] = useState<
    Leave[]
  >([]);

  const { startLoading, stopLoading } = useLoadingContext();
  const {
    createRequest,
    updateRequest,
    deleteRequest,
    deleteRejectedLeave,
    reRequestRejectedLeave,
    requestChangeToApprovedLeave,
    requestCancellationOfApprovedLeave,
  } = useRequestsContext();
  const navigate = useNavigate();
  const [approvedLeave, setApprovedLeave] = useState<LeaveRequest | null>(null);
  const firebase = useFirebase();
  const db = firebase?.db;

  const { loadedYear, workdaysOfTheWeek, bankHolidays, loadYear } =
    useLoadUserYearlyConfiguration({
      db,
      userId: user!.id,
    });

  const {
    id,
    from,
    to,
    numberOfWorkdays,
    isNumberOfWorkdaysOverwritten,
    numberOfWorkdaysOverwritten,
    leaveType,
    description,
    requestedByName,
  } = formData;

  const isEditing = Boolean(requestId !== 'new');

  // Cancellation request should not get changes
  const formInputsDisabled =
    disabled || requestType === RequestTypeEnum.Cancellation;

  useEffect(() => {
    if (!db) return;
    if (!requestId) return;
    if (
      requestType === RequestTypeEnum.Change ||
      requestCollection === firebase_collections.APPROVED_LEAVES
    ) {
      const ref = doc(db, firebase_collections.APPROVED_LEAVES, requestId);
      getDoc(ref).then(async (snap) => {
        if (snap.exists()) {
          const doc = snap.data() as LeaveRequest;
          setApprovedLeave(doc);
        } else {
          setApprovedLeave(null);
        }
      });
    } else {
      setApprovedLeave(null);
    }
  }, [db, requestId, requestType]);

  useEffect(() => {
    if (!db) return;
    if (!requestId) return setFormError("Can't find request.");
    if (!user?.id) return setFormError("Can't find logged in user.");
    if (requestId === 'new') return; /* New request, nothing to load */
    startLoading('fetch-request-details');
    const ref = doc(db, requestCollection, requestId);
    getDoc(ref)
      .then(async (snap) => {
        if (!snap.exists()) return setFormError("Can't find request.");

        const doc = snap.data() as LeaveRequest;
        if (!disabled && doc.requestedById !== user.id)
          return setFormError(
            'This request does not belong to the currently logged in user.'
          );

        // set request in parent component's state
        if (setRequest) {
          setRequest(doc);
        }

        // no need to load year when just viewing
        if (!disabled) {
          const year = doc.from.slice(0, 4);
          // start loading year before ending loading state to prevend loader flickering
          startLoading('load-year');
          await loadYear(year);
          stopLoading('load-year');
        }

        setRequestType(doc.requestType);

        return setFormData({
          id: requestId,
          from: doc.from,
          to: doc.to,
          numberOfWorkdays: doc.numberOfWorkdays,
          isNumberOfWorkdaysOverwritten:
            doc.isNumberOfWorkdaysOverwritten ?? false,
          numberOfWorkdaysOverwritten: doc.numberOfWorkdaysOverwritten ?? 0,
          leaveType: doc.leaveType,
          description: doc.description,
          requestedByName: doc.requestedByName,
        });
      })
      .finally(() => {
        stopLoading('fetch-request-details');
      });
  }, [db, requestId, disabled]);

  useEffect(() => {
    if (!db) return;
    if (disabled) return;
    if (!user?.id) return;
    startLoading('load-users-own-requests');
    const ownRequestQuery = query(
      collection(db, firebase_collections.REQUESTS),
      where('requestedById', '==', user.id)
    );
    const ownRequestsUnsubscribe: Unsubscribe = onSnapshot(
      ownRequestQuery,
      (snapshot) => {
        const requests: Leave[] = [];
        for (const doc of snapshot.docs) {
          const request = doc.data() as LeaveRequest;
          requests.push({
            from: new Date(request.from),
            to: new Date(request.to),
            id: request.id,
          });
        }
        setRequestsOfTheUser(requests);
        stopLoading('load-users-own-requests');
      }
    );

    return () => ownRequestsUnsubscribe();
  }, [db, disabled, user?.id]);

  useEffect(() => {
    if (!db) return;
    if (disabled) return;
    if (!user?.id) return;
    if (!loadedYear) return;
    startLoading('load-users-approved-leaves');
    const approvedLeavesQuery = query(
      collection(db, firebase_collections.APPROVED_LEAVES),
      where('requestedById', '==', user.id),
      where('year', '==', loadedYear)
    );
    const approvedLeavesUnsubscribe: Unsubscribe = onSnapshot(
      approvedLeavesQuery,
      (snapshot) => {
        const requests: Leave[] = [];
        for (const doc of snapshot.docs) {
          const request = doc.data() as LeaveRequest;
          requests.push({
            from: new Date(request.from),
            to: new Date(request.to),
            id: request.id,
          });
        }
        setApprovedLeavesOfTheUser(requests);
        stopLoading('load-users-approved-leaves');
      }
    );

    return () => approvedLeavesUnsubscribe();
  }, [db, disabled, user?.id, loadedYear]);

  useEffect(() => {
    if (!db) return;
    if (disabled) return; // no need to load year when just viewing
    if (from) {
      const year = from.slice(0, 4);
      if (year !== loadedYear) {
        startLoading('load-year');
        loadYear(year).finally(() => stopLoading('load-year'));
      }
    }
  }, [db, from, disabled]);

  useEffect(() => {
    // No need to update when just viewing
    if (disabled) return;
    if (
      leaveType === LeaveTypeEnum.Annual &&
      from &&
      to &&
      validateRequest(
        formData,
        requestsOfTheUser,
        approvedLeavesOfTheUser,
        user,
        setError,
        requestId
      )
    ) {
      const startDate = new Date(from);
      const endDate = new Date(to);

      let numberOfWorkdays = countWorkdays(
        startDate,
        endDate,
        bankHolidays,
        workdaysOfTheWeek
      );

      setFormData((prevState) => ({
        ...prevState,
        numberOfWorkdays,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        numberOfWorkdays: 0,
      }));
    }
  }, [disabled, from, to, leaveType, bankHolidays, workdaysOfTheWeek]);

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const onSubmitUpdateRequest = async (e: any) => {
    e.preventDefault();

    if (disabled) return;

    startLoading('add-edit-request');
    try {
      if (!user) {
        toast.error('User is not logged in.');
        return;
      }

      if (
        !validateRequest(
          formData,
          requestsOfTheUser,
          approvedLeavesOfTheUser,
          user,
          setError,
          requestId
        )
      ) {
        toast.error('Form is not ready to submit');
        return;
      }

      if (isEditing) {
        if (requestCollection === firebase_collections.APPROVED_LEAVES) {
          await requestChangeToApprovedLeave({
            id,
            leaveType,
            from,
            to,
            numberOfWorkdays,
            isNumberOfWorkdaysOverwritten,
            numberOfWorkdaysOverwritten,
            description,
          });
          toast.info('Change request submitted');
        } else if (requestCollection === firebase_collections.REJECTED_LEAVES) {
          await reRequestRejectedLeave({
            id,
            leaveType,
            from,
            to,
            numberOfWorkdays,
            isNumberOfWorkdaysOverwritten,
            numberOfWorkdaysOverwritten,
            description,
          });
          toast.info('Request re-submitted');
        } else {
          await updateRequest({
            id,
            leaveType,
            from,
            to,
            numberOfWorkdays,
            isNumberOfWorkdaysOverwritten,
            numberOfWorkdaysOverwritten,
            description,
          });
          toast.info('Request details updated');
        }
      } else {
        await createRequest(
          leaveType,
          from,
          to,
          numberOfWorkdays,
          isNumberOfWorkdaysOverwritten,
          numberOfWorkdaysOverwritten,
          description
        );
        toast.info('Request created');
      }

      onBack();
    } catch (error: any) {
      toast.error(
        error.message || `Could not ${isEditing ? 'update' : 'create'} request`
      );
    } finally {
      stopLoading('add-edit-request');
    }
  };

  const onDelete = async () => {
    startLoading('delete-request');
    try {
      if (requestCollection === firebase_collections.APPROVED_LEAVES) {
        await requestCancellationOfApprovedLeave({ id: requestId! });
        toast.info('Cancellation request submitted');
      } else if (requestCollection === firebase_collections.REJECTED_LEAVES) {
        await deleteRejectedLeave({ id: requestId! });
        toast.info('Request deleted');
      } else {
        await deleteRequest({ id: requestId! });
        toast.info('Request deleted');
      }
      onBack();
    } catch (error: any) {
      toast.error(error.message || `Could not delete request`);
    } finally {
      stopLoading('delete-request');
    }
  };

  const onBack = () => {
    if (requestCollection === firebase_collections.REJECTED_LEAVES)
      return navigate('/rejected-leaves');
    if (requestCollection === firebase_collections.APPROVED_LEAVES)
      return navigate('/approved-leaves');
    return navigate('/requests');
  };

  const autoUpdateOnCheckboxUpdate = (
    state: typeof formData
  ): typeof formData => {
    return {
      ...state,
      numberOfWorkdaysOverwritten: state.isNumberOfWorkdaysOverwritten
        ? state.numberOfWorkdays
        : 0,
    };
  };

  // Prevent editing if request does not belong to user
  if (formError)
    return (
      <>
        <h2 className="text-4xl font-bold text-red-700">{formError}</h2>
        <div className="flex flex-col items-center">
          <NavButton label="Back" link={'/'} icon="FaArrowLeft" />
        </div>
      </>
    );

  return (
    <form onSubmit={onSubmitUpdateRequest} className="flex flex-col gap-4 ">
      <RequestTypeInfo requestType={requestType} />
      <div>
        <RadioInput
          id="leaveType"
          label="Leave type"
          name="leaveType"
          value={leaveType}
          options={leaveTypeOptions}
          onChange={(e) => handleInputChange(e, setFormData)}
          disabled={formInputsDisabled}
        />
        {approvedLeave && (
          <ChangedFieldNotice
            oldValue={approvedLeave.leaveType}
            newValue={leaveType}
          />
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <DateInput
            id="from"
            label="Leave start date"
            name="from"
            value={from}
            onChange={(e) => handleInputChange(e, setFormData, setError)}
            placeholder="DD-MM-YYYY"
            error={errors.from}
            disabled={formInputsDisabled}
          />
          {approvedLeave && (
            <ChangedFieldNotice
              oldValue={approvedLeave.from}
              newValue={from}
              format={(s: string) => format(new Date(s), 'dd-MM-yyyy')}
            />
          )}
        </div>
        <div className="flex-1">
          <DateInput
            id="to"
            label="Leave end date"
            name="to"
            value={to}
            onChange={(e) => handleInputChange(e, setFormData, setError)}
            placeholder="DD-MM-YYYY"
            error={errors.to}
            disabled={formInputsDisabled}
          />
          {approvedLeave && (
            <ChangedFieldNotice
              oldValue={approvedLeave.to}
              newValue={to}
              format={(s: string) => format(new Date(s), 'dd-MM-yyyy')}
            />
          )}
        </div>
      </div>
      <div>
        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4">
          <div className="flex-1">
            {isNumberOfWorkdaysOverwritten ? (
              <NumberInput
                id="numberOfWorkdaysOverwritten"
                label="Custom number of workdays"
                name="numberOfWorkdaysOverwritten"
                value={numberOfWorkdaysOverwritten}
                onChange={(e) => handleInputChange(e, setFormData, setError)}
                placeholder="DD-MM-YYYY"
                error={errors.numberOfWorkdaysOverwritten}
                disabled={formInputsDisabled}
                min={0}
                step={0.1}
              />
            ) : (
              <NumberInput
                id="numberOfWorkdays"
                label="Calculated number of workdays"
                name="numberOfWorkdays"
                value={numberOfWorkdays}
                onChange={() => {}}
                placeholder="DD-MM-YYYY"
                error={errors.numberOfWorkdays}
                disabled
              />
            )}
            {approvedLeave && (
              <ChangedFieldNotice
                oldValue={
                  approvedLeave.isNumberOfWorkdaysOverwritten
                    ? approvedLeave.numberOfWorkdaysOverwritten
                    : approvedLeave.numberOfWorkdays
                }
                newValue={
                  isNumberOfWorkdaysOverwritten
                    ? numberOfWorkdaysOverwritten
                    : numberOfWorkdays
                }
              />
            )}
          </div>
          <div className="flex-1">
            {(!formInputsDisabled || isNumberOfWorkdaysOverwritten) && (
              <CheckboxInput
                id="isNumberOfWorkdaysOverwritten"
                label="Custom number of days"
                name="isNumberOfWorkdaysOverwritten"
                checked={isNumberOfWorkdaysOverwritten}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    setFormData,
                    setError,
                    autoUpdateOnCheckboxUpdate
                  )
                }
                error={errors.isNumberOfWorkdaysOverwritten}
                disabled={formInputsDisabled}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <TextAreaInput
          id="description"
          label="Additional information"
          name="description"
          value={description}
          onChange={(e) => handleInputChange(e, setFormData, setError)}
          placeholder="You can share any additional information about your leave here."
          error={errors.description}
          disabled={formInputsDisabled}
        />
        {approvedLeave && (
          <ChangedFieldNotice
            oldValue={approvedLeave.description}
            newValue={description}
          />
        )}
      </div>
      {!disabled && (
        <div className="flex flex-col md:flex-row-reverse md:justify-stretch gap-1 md:gap-4">
          {(requestCollection === firebase_collections.APPROVED_LEAVES ||
            requestType !== RequestTypeEnum.Cancellation) && (
            <Button
              label={
                isEditing
                  ? requestCollection === firebase_collections.REJECTED_LEAVES
                    ? 'Re-submit request'
                    : requestCollection === firebase_collections.APPROVED_LEAVES
                    ? 'Request changes'
                    : 'Submit changes'
                  : 'Submit request'
              }
            />
          )}

          <Button
            type="button"
            variant="secondary"
            label={
              isEditing
                ? requestType === RequestTypeEnum.Cancellation
                  ? 'Back'
                  : 'Discard changes'
                : 'Cancel'
            }
            onClick={onBack}
          />
          {isEditing && (
            <Button
              type="button"
              variant="danger"
              label={
                requestCollection === firebase_collections.APPROVED_LEAVES
                  ? 'Request cancellation'
                  : 'Delete request'
              }
              onClick={onDelete}
            />
          )}
        </div>
      )}
    </form>
  );
}
