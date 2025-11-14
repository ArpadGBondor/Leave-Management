import { format } from 'date-fns';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { Leave } from '../../interface/Leave.interface';
import User from '../../interface/User.interface';
import Calendar from '../calendar/Calendar';
import { useEffect, useState } from 'react';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import {
  collection,
  doc,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { firebase_collections } from '../../../lib/firebase_collections';
import UserHolidayEntitlement from '../../interface/UserHolidayEntitlement.interface';

interface UserCalendarProps {
  user: User;
  initialDate?: string;
  className?: string;
}

const defaultWorkdaysOfTheWeek = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};

export default function UserCalendar({
  user,
  initialDate,
  className,
}: UserCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    initialDate ? new Date(initialDate) : new Date()
  );
  /**
   * User's calendar gives a few days peek into previous and next year,
   * so calendar needs to load previous and next year's bank holiday region,
   * bank holidays, workdays of the week, and approved leaves too.
   */

  const [previousYearBankHolidayRegion, setPreviousYearBankHolidayRegion] =
    useState('');
  const [currentYearBankHolidayRegion, setCurrentYearBankHolidayRegion] =
    useState('');
  const [nextYearBankHolidayRegion, setNextYearBankHolidayRegion] =
    useState('');

  const [previousYearBankHolidays, setPreviousYearBankHolidays] = useState<
    Leave[]
  >([]);
  const [currentYearBankHolidays, setCurrentYearBankHolidays] = useState<
    Leave[]
  >([]);
  const [nextYearBankHolidays, setNextYearBankHolidays] = useState<Leave[]>([]);

  const [requested, setRequested] = useState<Leave[]>([]);

  const [previousYearWorkdaysOfTheWeek, setPreviousYearWorkdaysOfTheWeek] =
    useState<WorkdaysOfTheWeek>({ ...defaultWorkdaysOfTheWeek });
  const [currentYearWorkdaysOfTheWeek, setCurrentYearWorkdaysOfTheWeek] =
    useState<WorkdaysOfTheWeek>({ ...defaultWorkdaysOfTheWeek });
  const [nextYearWorkdaysOfTheWeek, setNextYearWorkdaysOfTheWeek] =
    useState<WorkdaysOfTheWeek>({ ...defaultWorkdaysOfTheWeek });
  const { startLoading, stopLoading } = useLoadingContext();
  const {
    workdaysOfTheWeek: companyWorkdaysOfTheWeek,
    bankHolidayRegion: companyBankHolidayRegion,
  } = useCompanyContext();
  const currentYear = format(currentMonth, 'yyyy');

  const approved: Leave[] = [
    { from: new Date('2025-12-05'), to: new Date('2025-12-17') },
  ];

  useEffect(() => {
    if (!user?.id) return;
    startLoading('fetch-own-requests');
    const requestsRef = collection(db, firebase_collections.REQUESTS);
    const ownRequestQuery = query(
      requestsRef,
      where('requestedById', '==', user.id)
    ); // only this user's requests

    const ownRequestsUnsubscribe: Unsubscribe = onSnapshot(
      ownRequestQuery,
      (snapshot) => {
        const requested: Leave[] = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();
          requested.push({ from: new Date(data.from), to: new Date(data.to) });
        }
        setRequested(requested);
        stopLoading('fetch-own-requests');
      }
    );
    return () => ownRequestsUnsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    if (!currentYear) return;
    const year = parseInt(currentYear);
    startLoading('fetch-previous-year-configured-years');
    startLoading('fetch-current-year-configured-years');
    startLoading('fetch-next-year-configured-years');
    const previousYearConfigurationRef = doc(
      db,
      `${firebase_collections.USERS}/${user.id}/${
        firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION
      }/${year - 1}`
    );
    const previousYearConfigurationUnsubscribe = onSnapshot(
      previousYearConfigurationRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserHolidayEntitlement;
          setPreviousYearWorkdaysOfTheWeek({
            monday: data.monday,
            tuesday: data.tuesday,
            wednesday: data.wednesday,
            thursday: data.thursday,
            friday: data.friday,
            saturday: data.saturday,
            sunday: data.sunday,
          });
          setPreviousYearBankHolidayRegion(data.bankHolidayRegionId);
        } else {
          setPreviousYearWorkdaysOfTheWeek(companyWorkdaysOfTheWeek);
          setPreviousYearBankHolidayRegion(
            companyBankHolidayRegion.bankHolidayRegionId
          );
        }
        stopLoading('fetch-previous-year-configured-years');
      }
    );
    const currentYearConfigurationRef = doc(
      db,
      `${firebase_collections.USERS}/${user.id}/${firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION}/${year}`
    );
    const currentYearConfigurationUnsubscribe = onSnapshot(
      currentYearConfigurationRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserHolidayEntitlement;
          setCurrentYearWorkdaysOfTheWeek({
            monday: data.monday,
            tuesday: data.tuesday,
            wednesday: data.wednesday,
            thursday: data.thursday,
            friday: data.friday,
            saturday: data.saturday,
            sunday: data.sunday,
          });
          setCurrentYearBankHolidayRegion(data.bankHolidayRegionId);
        } else {
          setCurrentYearWorkdaysOfTheWeek(companyWorkdaysOfTheWeek);
          setCurrentYearBankHolidayRegion(
            companyBankHolidayRegion.bankHolidayRegionId
          );
        }
        stopLoading('fetch-current-year-configured-years');
      }
    );
    const nextYearConfigurationRef = doc(
      db,
      `${firebase_collections.USERS}/${user.id}/${
        firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION
      }/${year + 1}`
    );
    const nextYearConfigurationUnsubscribe = onSnapshot(
      nextYearConfigurationRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserHolidayEntitlement;
          setNextYearWorkdaysOfTheWeek({
            monday: data.monday,
            tuesday: data.tuesday,
            wednesday: data.wednesday,
            thursday: data.thursday,
            friday: data.friday,
            saturday: data.saturday,
            sunday: data.sunday,
          });
          setNextYearBankHolidayRegion(data.bankHolidayRegionId);
        } else {
          setNextYearWorkdaysOfTheWeek(companyWorkdaysOfTheWeek);
          setNextYearBankHolidayRegion(
            companyBankHolidayRegion.bankHolidayRegionId
          );
        }
        stopLoading('fetch-next-year-configured-years');
      }
    );
    return () => {
      previousYearConfigurationUnsubscribe();
      currentYearConfigurationUnsubscribe();
      nextYearConfigurationUnsubscribe();
    };
  }, [user?.id, currentYear]);

  useEffect(() => {
    if (!previousYearBankHolidayRegion) return;
    if (!currentYear) return;
    // Need to load previous and next year too
    const year = parseInt(currentYear);
    startLoading('fetch-previous-year-bank-holidays');
    const previousYearBankHolidayRef = collection(
      db,
      `/${
        firebase_collections.BANK_HOLIDAYS
      }/${previousYearBankHolidayRegion}/${year - 1}`
    );

    const previousYearBankHolidaysUnsubscribe = onSnapshot(
      previousYearBankHolidayRef,
      (snapshot) => {
        const leaves: Leave[] = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const date = new Date(data.date);
          leaves.push({ from: date, to: date });
        }
        setPreviousYearBankHolidays(leaves);
        stopLoading('fetch-previous-year-bank-holidays');
      }
    );
    return () => {
      previousYearBankHolidaysUnsubscribe();
    };
  }, [previousYearBankHolidayRegion, currentYear]);

  useEffect(() => {
    if (!currentYearBankHolidayRegion) return;
    if (!currentYear) return;
    // Need to load previous and next year too
    const year = parseInt(currentYear);
    startLoading('fetch-current-year-bank-holidays');
    const currentYearBankHolidayRef = collection(
      db,
      `/${firebase_collections.BANK_HOLIDAYS}/${currentYearBankHolidayRegion}/${year}`
    );

    const currentYearBankHolidaysUnsubscribe = onSnapshot(
      currentYearBankHolidayRef,
      (snapshot) => {
        const leaves: Leave[] = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const date = new Date(data.date);
          leaves.push({ from: date, to: date });
        }
        setCurrentYearBankHolidays(leaves);
        stopLoading('fetch-current-year-bank-holidays');
      }
    );
    return () => {
      currentYearBankHolidaysUnsubscribe();
    };
  }, [currentYearBankHolidayRegion, currentYear]);

  useEffect(() => {
    if (!nextYearBankHolidayRegion) return;
    if (!currentYear) return;
    // Need to load previous and next year too
    const year = parseInt(currentYear);
    startLoading('fetch-next-year-bank-holidays');

    const nextYearBankHolidayRef = collection(
      db,
      `/${firebase_collections.BANK_HOLIDAYS}/${nextYearBankHolidayRegion}/${
        year + 1
      }`
    );

    const nextYearBankHolidaysUnsubscribe = onSnapshot(
      nextYearBankHolidayRef,
      (snapshot) => {
        const leaves: Leave[] = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const date = new Date(data.date);
          leaves.push({ from: date, to: date });
        }
        setNextYearBankHolidays(leaves);
        stopLoading('fetch-next-year-bank-holidays');
      }
    );
    return () => {
      nextYearBankHolidaysUnsubscribe();
    };
  }, [nextYearBankHolidayRegion, currentYear]);

  return (
    <Calendar
      currentMonth={currentMonth}
      setCurrentMonth={setCurrentMonth}
      previousYearWorkdaysOfTheWeek={previousYearWorkdaysOfTheWeek}
      currentYearWorkdaysOfTheWeek={currentYearWorkdaysOfTheWeek}
      nextYearWorkdaysOfTheWeek={nextYearWorkdaysOfTheWeek}
      bankHolidays={[
        ...previousYearBankHolidays,
        ...currentYearBankHolidays,
        ...nextYearBankHolidays,
      ]}
      approved={approved}
      requests={requested}
      serviceStartDate={
        user?.serviceStartDate ? new Date(user?.serviceStartDate) : undefined
      }
      serviceEndDate={
        user?.serviceEndDate ? new Date(user?.serviceEndDate) : undefined
      }
      className={className}
    />
  );
}
