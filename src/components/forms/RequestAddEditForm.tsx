import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
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
import { Leave } from '../../interface/Leave.interface';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import UserHolidayEntitlement from '../../interface/UserHolidayEntitlement.interface';
import isDateInRanges from '../../utils/isDateInRanges';
import isWorkday from '../../utils/isWorkday';
import { addDays } from 'date-fns';
import TextAreaInput from '../inputs/TextAreaInput';
import countWorkdays from '../../utils/countWorkdays';

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
  const [loadedYear, setLoadedYear] = useState<string>('');
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

  useEffect(() => {
    if (validateRequest()) {
      recalculateNumberOfWorkdays();
    } else {
      setFormData((prevState) => ({
        ...prevState,
        numberOfWorkdays: 0,
      }));
    }
  }, [formData.from, formData.to]);

  const isEditing = Boolean(requestId !== 'new');

  const { id, from, to, numberOfWorkdays, requestType, description } = formData;

  const setError = (field: keyof typeof errors, message: string) =>
    setErrors((prevState) => ({
      ...prevState,
      [field]: message,
    }));

  const recalculateNumberOfWorkdays = async () => {
    const year = formData.from.slice(0, 4);
    // If we did not reload year, take values from state
    let _workdaysOfTheWeek = workdaysOfTheWeek;
    let _bankHolidays = bankHolidays;
    if (year !== loadedYear) {
      // if we reload year, return freshly loaded values from function
      const { workdaysOfTheWeek, bankHolidays } = await loadYear(year);
      _workdaysOfTheWeek = workdaysOfTheWeek;
      _bankHolidays = bankHolidays;
    }

    const startDate = new Date(from);
    const endDate = new Date(to);

    let numberOfWorkdays = countWorkdays(
      startDate,
      endDate,
      _bankHolidays,
      _workdaysOfTheWeek
    );

    setFormData((prevState) => ({
      ...prevState,
      numberOfWorkdays,
    }));
  };

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
        {isEditing ? 'Edit request' : 'Add request'}
      </h2>
      <form onSubmit={onSubmitUpdateRequest} className="flex flex-col gap-4 ">
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
          <div className="flex-1">
            <DateInput
              id="from"
              label="Leave start date"
              name="from"
              value={from}
              onChange={(e) => handleInputChange(e, setFormData, setError)}
              placeholder="DD-MM-YYYY"
              error={errors.from}
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
        />

        <div className="flex flex-col md:flex-row-reverse md:justify-stretch gap-1 md:gap-4">
          <Button label={isEditing ? 'Save changes' : 'Submit request'} />
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
      </form>
    </>
  );
}
