import { Leave } from '../interface/Leave.interface';
import isDateInRanges from './isDateInRanges';
import { isSameDay } from 'date-fns';

export function validateEmailFormat<T extends Record<string, string>>(
  formData: T,
  field: keyof T,
  setError: (field: keyof T, msg: string) => void
): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData[field])) {
    setError(field, 'Please enter a valid email address.');
    return false;
  }
  return true;
}

export function validatePasswordComplexity<T extends Record<string, string>>(
  formData: T,
  field: keyof T,
  setError: (field: keyof T, msg: string) => void
): boolean {
  if (formData[field].trim().length < 6) {
    setError(field, 'Password is too short.');
    return false;
  }
  return true;
}

export function validateRequiredField<T extends Record<string, string>>(
  formData: T,
  field: keyof T,
  label: string,
  setError: (field: keyof T, msg: string) => void
): boolean {
  if (!formData[field].trim()) {
    setError(field, `Please enter ${label}.`);
    return false;
  }
  return true;
}

export function validateDateField<T extends Record<string, string>>(
  formData: T,
  field: keyof T,
  label: string,
  setError: (field: keyof T, msg: string) => void
): boolean {
  const date = formData[field] ? new Date(formData[field]) : null;

  if (!date || isNaN(date.getTime())) {
    setError(field, `Invalid ${label}.`);
    return false;
  }

  return true;
}

export function validateDateOrder<T extends Record<string, string>>(
  fromDate: Date,
  toDate: Date,
  toField: keyof T,
  setError: (field: keyof T, msg: string) => void
) {
  if (!isSameDay(fromDate, toDate) && toDate < fromDate) {
    setError(toField, 'End date must be later than start date.');
    return false;
  }
  return true;
}

export function validateDateIsWithinEmploymentRange<
  T extends Record<string, string>
>(
  date: Date,
  field: keyof T,
  label: string,
  employmentStart: Date | null,
  employmentEnd: Date | null,
  setError: (field: keyof T, msg: string) => void
) {
  if (employmentStart && date < employmentStart) {
    setError(
      field,
      `Leave cannot ${label} before ${
        employmentStart.toISOString().split('T')[0]
      }`
    );
    return false;
  }

  if (employmentEnd && date > employmentEnd) {
    setError(
      field,
      `Leave cannot ${label} after ${employmentEnd.toISOString().split('T')[0]}`
    );
    return false;
  }

  return true;
}

export function validateDatesAreWithinSameYear<
  T extends Record<string, string>
>(
  fromDate: Date,
  toDate: Date,
  field: keyof T,
  setError: (field: any, msg: string) => void
) {
  if (fromDate.getFullYear() !== toDate.getFullYear()) {
    setError(
      field,
      'Your dates span multiple years. Please create a separate request for each year.'
    );
    return false;
  }
  return true;
}

export function validateConflicts<T extends Record<string, string>>(
  fromDate: Date,
  toDate: Date,
  allRanges: Leave[],
  typeLabel: string,
  requestId: string | undefined,
  fromField: keyof T,
  toField: keyof T,
  setError: (field: keyof T, msg: string) => void
) {
  // Only compare conflicts with different requests from current one
  const ranges = allRanges.filter((req) => req.id !== requestId);

  if (isDateInRanges(fromDate, ranges)) {
    setError(fromField, `Your start date conflicts with another ${typeLabel}.`);
    return false;
  }

  if (isDateInRanges(toDate, ranges)) {
    setError(toField, `Your end date conflicts with another ${typeLabel}.`);
    return false;
  }

  for (const req of ranges) {
    if (fromDate < req.from && req.to < toDate) {
      setError(
        toField,
        `Your requested interval conflicts with another ${typeLabel}.`
      );
      return false;
    }
  }

  return true;
}
