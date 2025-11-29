import { Leave } from '../../../interface/Leave.interface';
import User from '../../../interface/User.interface';
import {
  validateConflicts,
  validateDateField,
  validateDateIsWithinEmploymentRange,
  validateDateOrder,
  validateDatesAreWithinSameYear,
  validateRequiredField,
} from '../../../utils/fieldValidators';

export default function validateRequest<T extends { from: string; to: string }>(
  formData: T,
  requestsOfTheUser: Leave[],
  approvedLeavesOfTheUser: Leave[],
  user: User | null,
  setError: (field: keyof T, message: string) => void,
  requestId?: string
) {
  let valid = true;

  const employmentStart = user?.serviceStartDate
    ? new Date(user?.serviceStartDate)
    : null;
  const employmentEnd = user?.serviceEndDate
    ? new Date(user?.serviceEndDate)
    : null;

  const fromDate = formData.from ? new Date(formData.from) : null;
  const toDate = formData.to ? new Date(formData.to) : null;

  // validate that start date is not empty
  valid &&= validateRequiredField(
    formData,
    'from',
    'enter start date',
    setError
  );
  // validate that start date is valid date
  valid &&= validateDateField(formData, 'from', 'start date', setError);

  // validate that end date is not empty
  valid &&= validateRequiredField(formData, 'to', 'enter end date', setError);
  // validate that end date is valid date
  valid &&= validateDateField(formData, 'to', 'end date', setError);

  // validate that end date follows start date
  valid &&= validateDateOrder(fromDate!, toDate!, 'to', setError);
  // validate that start and end dates are within same year
  valid &&= validateDatesAreWithinSameYear(fromDate!, toDate!, 'to', setError);

  // validate that start and end dates are within employment range
  // (if employment range is set)
  valid &&= validateDateIsWithinEmploymentRange(
    fromDate!, // after validateDateField check, this is valid date
    'from',
    'start',
    employmentStart,
    employmentEnd,
    setError
  );
  valid &&= validateDateIsWithinEmploymentRange(
    fromDate!, // after validateDateField check, this is valid date
    'to',
    'end',
    employmentStart,
    employmentEnd,
    setError
  );

  // validate that requested dates don't conflict with a different request
  valid &&= validateConflicts(
    fromDate!, // after validateDateField check, this is valid date
    toDate!, // after validateDateField check, this is valid date
    requestsOfTheUser,
    'request',
    requestId,
    'from',
    'to',
    setError
  );

  // validate that requested dates don't conflict with a different approved leave
  valid &&= validateConflicts(
    fromDate!, // after validateDateField check, this is valid date
    toDate!, // after validateDateField check, this is valid date
    approvedLeavesOfTheUser,
    'approved leave',
    requestId,
    'from',
    'to',
    setError
  );

  return valid;
}
