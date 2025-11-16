import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { firebase_collections } from '../../../lib/firebase_collections';
import { db } from '../../firebase.config';
import { useUserContext } from '../../context/user/useUserContext';
import {
  LeaveRequest,
  LeaveRequestType,
  leaveRequestTypeOptions,
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
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import UserHolidayEntitlement from '../../interface/UserHolidayEntitlement.interface';
import TextAreaInput from '../inputs/TextAreaInput';
import countWorkdays from '../../utils/countWorkdays';
import RadioInput from '../inputs/RadioInput';
import isDateInRanges from '../../utils/isDateInRanges';

interface RequestAddEditFormProps {
  requestId?: string;
  disabled?: boolean;
  setRequest?: React.Dispatch<React.SetStateAction<LeaveRequest | null>>;
}

export default function RequestAddEditForm({
  requestId,
  disabled,
  setRequest,
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
    requestedByName: string;
  } = {
    id: 'new',
    from: '',
    to: '',
    numberOfWorkdays: 0,
    requestType: leaveRequestTypeOptions[0],
    description: '',
    requestedByName: '',
  };
  const [formData, setFormData] = useState({ ...defaultRequest });
  const defaultErrors = {
    id: '',
    from: '',
    to: '',
    numberOfWorkdays: '',
    requestType: '',
    description: '',
    requestedByName: '',
  };
  const [errors, setErrors] = useState(defaultErrors);
  const [loadedYear, setLoadedYear] = useState<string>('');
  const [requestsOfTheUser, setRequestsOfTheUser] = useState<Leave[]>([]);
  const [approvedLeavesOfTheUser, setApprovedLeavesOfTheUser] = useState<
    Leave[]
  >([]);
  const [bankHolidays, setBankHolidays] = useState<Leave[]>([]);
  const [workdaysOfTheWeek, setWorkdaysOfTheWeek] = useState<WorkdaysOfTheWeek>(
    {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    }
  );
  const {
    workdaysOfTheWeek: companyWorkdaysOfTheWeek,
    bankHolidayRegion: companyBankHolidayRegion,
  } = useCompanyContext();

  const { startLoading, stopLoading } = useLoadingContext();
  const { createRequest, updateRequest, deleteRequest } = useRequestsContext();
  const navigate = useNavigate();

  const {
    id,
    from,
    to,
    numberOfWorkdays,
    requestType,
    description,
    requestedByName,
  } = formData;

  const isEditing = Boolean(requestId !== 'new');

  useEffect(() => {
    if (!requestId) return setFormError("Can't find request.");
    if (!user?.id) return setFormError("Can't find logged in user.");
    if (requestId === 'new') return; /* New request, nothing to load */
    startLoading('fetch-request-details');
    const ref = doc(db, firebase_collections.REQUESTS, requestId);
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

        return setFormData({
          id: requestId,
          from: doc.from,
          to: doc.to,
          numberOfWorkdays: doc.numberOfWorkdays,
          requestType: doc.requestType,
          description: doc.description,
          requestedByName: doc.requestedByName,
        });
      })
      .finally(() => {
        stopLoading('fetch-request-details');
      });
  }, [requestId, disabled]);

  useEffect(() => {
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
  }, [disabled, user?.id]);

  useEffect(() => {
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
  }, [disabled, user?.id, loadedYear]);

  useEffect(() => {
    // no need to load year when just viewing
    if (disabled) return;
    if (from) {
      const year = from.slice(0, 4);
      if (year !== loadedYear) {
        startLoading('load-year');
        loadYear(year).finally(() => stopLoading('load-year'));
      }
    }
  }, [from, disabled]);

  useEffect(() => {
    // No need to update when just viewing
    if (disabled) return;
    if (
      requestType === leaveRequestTypeOptions[0] &&
      from &&
      to &&
      validateRequest()
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
  }, [disabled, from, to, requestType, bankHolidays, workdaysOfTheWeek]);

  const loadYear = async (year: string) => {
    // fetch configuration
    const configRef = doc(
      db,
      `${firebase_collections.USERS}/${user!.id}/${
        firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION
      }/${year}`
    );
    const configSnap = await getDoc(configRef);
    let bankHolidayRegion = companyBankHolidayRegion.bankHolidayRegionId;
    let workdaysOfTheWeek = companyWorkdaysOfTheWeek;
    if (configSnap.exists()) {
      const data = configSnap.data() as UserHolidayEntitlement;
      workdaysOfTheWeek = {
        monday: data.monday,
        tuesday: data.tuesday,
        wednesday: data.wednesday,
        thursday: data.thursday,
        friday: data.friday,
        saturday: data.saturday,
        sunday: data.sunday,
      };
      bankHolidayRegion = data.bankHolidayRegionId;
    }

    setWorkdaysOfTheWeek(workdaysOfTheWeek);

    // fetch bank holidays
    const bankHolidayRef = collection(
      db,
      `/${firebase_collections.BANK_HOLIDAYS}/${bankHolidayRegion}/${year}`
    );
    const bankHolidaySnap = await getDocs(bankHolidayRef);
    const bankHolidays: Leave[] = [];
    for (const doc of bankHolidaySnap.docs) {
      const data = doc.data();
      const date = new Date(data.date);
      bankHolidays.push({ from: date, to: date });
    }
    setBankHolidays(bankHolidays);

    setLoadedYear(year);

    return { workdaysOfTheWeek, bankHolidays };
  };

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const validateRequest = () => {
    let valid = true;

    const employmentStart = user?.serviceStartDate
      ? new Date(user?.serviceStartDate)
      : null;
    const employmentEnd = user?.serviceEndDate
      ? new Date(user?.serviceEndDate)
      : null;

    // From validation
    if (!from.trim()) {
      setError('from', 'Please Please enter start date.');
      valid = false;
    } else {
      const fromDate = new Date(from);
      if (employmentStart && employmentStart > fromDate) {
        setError('from', `Leave cannot start before ${user?.serviceStartDate}`);
        valid = false;
      } else if (employmentEnd && employmentEnd < fromDate) {
        setError('from', `Leave cannot start after ${user?.serviceEndDate}`);
        valid = false;
      } else {
        setError('from', '');
      }
    }

    // From validation
    if (!to.trim()) {
      setError('to', 'Please Please enter end date.');
      valid = false;
    } else if (new Date(from) > new Date(to)) {
      setError('to', 'Leave end date should be later than start date.');
      valid = false;
    } else {
      const toDate = new Date(to);
      if (employmentStart && employmentStart > toDate) {
        setError('to', `Leave cannot end before ${user?.serviceStartDate}`);
        valid = false;
      } else if (employmentEnd && employmentEnd < toDate) {
        setError('to', `Leave cannot end after ${user?.serviceEndDate}`);
        valid = false;
      } else {
        setError('to', '');
      }
    }

    if (valid) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      if (toDate.getFullYear() !== fromDate.getFullYear()) {
        setError(
          'to',
          'Your start and end dates span multiple years. Please create a separate request for each year.'
        );
        valid = false;
      }

      // Check for conflicting requests
      const otherRequests = requestsOfTheUser.filter(
        // Do not compare the request with itself
        (request) => requestId !== request.id
      );

      if (valid && isDateInRanges(fromDate, otherRequests)) {
        setError('from', 'Your start date conflicts with another request.');
        valid = false;
      }
      if (valid && isDateInRanges(toDate, otherRequests)) {
        setError('to', 'Your end date conflicts with another request.');
        valid = false;
      }

      for (const request of otherRequests) {
        if (valid && fromDate < request.from && request.to < toDate) {
          setError(
            'to',
            'Your requested leave interval conflicts with another request.'
          );
          valid = false;
        }
      }

      // Check for conflicting requests
      const otherApprovedLeaves = approvedLeavesOfTheUser.filter(
        // Do not compare the request with itself
        (request) => requestId !== request.id
      );

      if (valid && isDateInRanges(fromDate, otherApprovedLeaves)) {
        setError('from', 'Your start date conflicts with an approved leave.');
        valid = false;
      }
      if (valid && isDateInRanges(toDate, otherApprovedLeaves)) {
        setError('to', 'Your end date conflicts with an approved leave.');
        valid = false;
      }

      for (const request of otherApprovedLeaves) {
        if (valid && fromDate < request.from && request.to < toDate) {
          setError(
            'to',
            'Your requested leave interval conflicts with an approved leave.'
          );
          valid = false;
        }
      }
    }

    return valid;
  };

  const onSubmitUpdateRequest = async (e: any) => {
    e.preventDefault();

    if (disabled) return;

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

      if (isEditing) {
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
      if (isEditing) {
        toast.info('Request details updated');
      } else {
        toast.info('Request created');
      }
      navigate('/requests');
    } catch (error: any) {
      toast.error(
        error.message || `Could not ${isEditing ? 'update' : 'create'} request`
      );
    } finally {
      stopLoading('add-edit-request');
    }
  };

  const onDelete = () => {
    startLoading('delete-request');
    try {
      deleteRequest({ id: requestId! });
      toast.info('Request deleted');
      navigate('/requests');
    } catch (error: any) {
      toast.error(error.message || `Could not delete request`);
    } finally {
      stopLoading('delete-request');
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
        {disabled
          ? 'Request details'
          : isEditing
          ? 'Change your request'
          : 'New leave request'}
      </h2>
      <form onSubmit={onSubmitUpdateRequest} className="flex flex-col gap-4 ">
        {disabled && (
          <p className="text-brand-green-800">
            Requested by:{' '}
            <span className="font-medium ">
              {requestedByName || user?.name}
            </span>
          </p>
        )}
        <RadioInput
          id="requestType"
          label="Leave type"
          name="requestType"
          value={requestType}
          options={leaveRequestTypeOptions}
          onChange={(e) => handleInputChange(e, setFormData)}
          disabled={disabled}
        />

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
              disabled={disabled}
            />
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
              disabled={disabled}
            />
          </div>
        </div>

        {numberOfWorkdays > 0 && (
          <p className="text-brand-green-800">
            Number of workdays: {numberOfWorkdays}
          </p>
        )}

        <TextAreaInput
          id="description"
          label="Additional information"
          name="description"
          value={description}
          onChange={(e) => handleInputChange(e, setFormData, setError)}
          placeholder="You can share any additional information about your leave here."
          error={errors.description}
          disabled={disabled}
        />

        {!disabled && (
          <div className="flex flex-col md:flex-row-reverse md:justify-stretch gap-1 md:gap-4">
            <Button label={isEditing ? 'Submit changes' : 'Submit request'} />
            <Button
              type="button"
              variant="secondary"
              label={isEditing ? 'Discard changes' : 'Cancel'}
              onClick={() => navigate('/requests')}
            />
            {isEditing && (
              <Button
                type="button"
                variant="danger"
                label="Delete request"
                onClick={onDelete}
              />
            )}
          </div>
        )}
      </form>
    </>
  );
}
