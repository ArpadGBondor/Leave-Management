import { format } from 'date-fns';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { createLeaveObject, Leave } from '../../interface/Leave.interface';
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
import { firebase_collections } from '../../../lib/firebase_collections';
import UserHolidayEntitlement from '../../interface/UserHolidayEntitlement.interface';
import { LeaveRequest } from '../../interface/LeaveRequest.interface';
import { useFirebase } from '../../hooks/useFirebase';
import UserDashboard from '../dashboard/UserDashboard';

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

  const [currentYearHolidayEntitlement, setCurrentYearHolidayEntitlement] =
    useState(0);

  const [previousYearBankHolidays, setPreviousYearBankHolidays] = useState<
    Leave[]
  >([]);
  const [currentYearBankHolidays, setCurrentYearBankHolidays] = useState<
    Leave[]
  >([]);
  const [nextYearBankHolidays, setNextYearBankHolidays] = useState<Leave[]>([]);

  const [previousYearApprovedLeaves, setPreviousYearApprovedLeaves] = useState<
    Leave[]
  >([]);
  const [currentYearApprovedLeaves, setCurrentYearApprovedLeaves] = useState<
    Leave[]
  >([]);
  const [nextYearApprovedLeaves, setNextYearApprovedLeaves] = useState<Leave[]>(
    []
  );

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
    holidayEntitlement: companyHolidayEntitlement,
    getBankHolidays,
  } = useCompanyContext();
  const currentYear = format(currentMonth, 'yyyy');

  const firebase = useFirebase();
  const db = firebase?.db;

  useEffect(() => {
    if (!db) return;
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
          const data = doc.data() as LeaveRequest;
          requested.push(createLeaveObject(data));
        }
        setRequested(requested);
        stopLoading('fetch-own-requests');
      }
    );
    return () => ownRequestsUnsubscribe();
  }, [db, user?.id]);

  useEffect(() => {
    if (!db) return;
    if (!user?.id) return;
    if (!currentYear) return;
    const year = parseInt(currentYear);
    startLoading('fetch-previous-year-approved-leaves');
    startLoading('fetch-current-year-approved-leaves');
    startLoading('fetch-next-year-approved-leaves');
    const previousYearApprovedLeavesRef = query(
      collection(db, `${firebase_collections.APPROVED_LEAVES}`),
      where('requestedById', '==', user.id),
      where('year', '==', `${year - 1}`)
    );
    const previousYearApprovedLeavesUnsubscribe = onSnapshot(
      previousYearApprovedLeavesRef,
      (snapshot) => {
        const requests: Leave[] = [];
        for (const doc of snapshot.docs) {
          const request = doc.data() as LeaveRequest;
          requests.push(createLeaveObject(request));
        }
        setPreviousYearApprovedLeaves(requests);
        stopLoading('fetch-previous-year-approved-leaves');
      }
    );
    const currentYearApprovedLeavesRef = query(
      collection(db, `${firebase_collections.APPROVED_LEAVES}`),
      where('requestedById', '==', user.id),
      where('year', '==', `${year}`)
    );
    const currentYearApprovedLeavesUnsubscribe = onSnapshot(
      currentYearApprovedLeavesRef,
      (snapshot) => {
        const requests: Leave[] = [];
        for (const doc of snapshot.docs) {
          const request = doc.data() as LeaveRequest;
          requests.push(createLeaveObject(request));
        }
        setCurrentYearApprovedLeaves(requests);
        stopLoading('fetch-current-year-approved-leaves');
      }
    );
    const nextYearApprovedLeavesRef = query(
      collection(db, `${firebase_collections.APPROVED_LEAVES}`),
      where('requestedById', '==', user.id),
      where('year', '==', `${year + 1}`)
    );
    const nextYearApprovedLeavesUnsubscribe = onSnapshot(
      nextYearApprovedLeavesRef,
      (snapshot) => {
        const requests: Leave[] = [];
        for (const doc of snapshot.docs) {
          const request = doc.data() as LeaveRequest;
          requests.push(createLeaveObject(request));
        }
        setNextYearApprovedLeaves(requests);
        stopLoading('fetch-next-year-approved-leaves');
      }
    );
    return () => {
      previousYearApprovedLeavesUnsubscribe();
      currentYearApprovedLeavesUnsubscribe();
      nextYearApprovedLeavesUnsubscribe();
    };
  }, [db, user?.id, currentYear]);

  useEffect(() => {
    if (!db) return;
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
          setCurrentYearHolidayEntitlement(data.holidayEntitlementTotal);
        } else {
          setCurrentYearWorkdaysOfTheWeek(companyWorkdaysOfTheWeek);
          setCurrentYearBankHolidayRegion(
            companyBankHolidayRegion.bankHolidayRegionId
          );
          setCurrentYearHolidayEntitlement(
            companyHolidayEntitlement.holidayEntitlementTotal
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
  }, [db, user?.id, currentYear]);

  useEffect(() => {
    if (!db) return;
    if (!previousYearBankHolidayRegion) return;
    if (!currentYear) return;
    const year = parseInt(currentYear);
    startLoading('fetch-previous-year-bank-holidays');
    const fetchBankHolidays = async () => {
      const dates = await getBankHolidays(
        previousYearBankHolidayRegion,
        `${year - 1}`
      );
      const leaves: Leave[] = dates.map((date) => ({
        from: date,
        to: date,
        numberOfWorkdays: 1,
      }));
      setPreviousYearBankHolidays(leaves);
      stopLoading('fetch-previous-year-bank-holidays');
    };
    fetchBankHolidays();
  }, [db, previousYearBankHolidayRegion, currentYear]);

  useEffect(() => {
    if (!db) return;
    if (!currentYearBankHolidayRegion) return;
    if (!currentYear) return;
    startLoading('fetch-current-year-bank-holidays');
    const fetchBankHolidays = async () => {
      const dates = await getBankHolidays(
        currentYearBankHolidayRegion,
        currentYear
      );
      const leaves: Leave[] = dates.map((date) => ({
        from: date,
        to: date,
        numberOfWorkdays: 1,
      }));
      setCurrentYearBankHolidays(leaves);
      stopLoading('fetch-current-year-bank-holidays');
    };
    fetchBankHolidays();
  }, [db, currentYearBankHolidayRegion, currentYear]);

  useEffect(() => {
    if (!db) return;
    if (!nextYearBankHolidayRegion) return;
    if (!currentYear) return;
    const year = parseInt(currentYear);
    startLoading('fetch-next-year-bank-holidays');
    const fetchBankHolidays = async () => {
      const dates = await getBankHolidays(
        nextYearBankHolidayRegion,
        `${year + 1}`
      );
      const leaves: Leave[] = dates.map((date) => ({
        from: date,
        to: date,
        numberOfWorkdays: 1,
      }));
      setNextYearBankHolidays(leaves);
      stopLoading('fetch-next-year-bank-holidays');
    };
    fetchBankHolidays();
  }, [db, nextYearBankHolidayRegion, currentYear]);

  return (
    <div className={`${className}`}>
      <UserDashboard
        user={user}
        currentYear={currentYear}
        totalLeaveEntitlement={currentYearHolidayEntitlement}
        approved={currentYearApprovedLeaves}
        requests={requested.filter((leave) => leave.year === currentYear)}
        className="rounded-b-none"
      />
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
        approved={[
          ...previousYearApprovedLeaves,
          ...currentYearApprovedLeaves,
          ...nextYearApprovedLeaves,
        ]}
        requests={requested}
        serviceStartDate={
          user?.serviceStartDate ? new Date(user?.serviceStartDate) : undefined
        }
        serviceEndDate={
          user?.serviceEndDate ? new Date(user?.serviceEndDate) : undefined
        }
        className="rounded-t-none"
      />
    </div>
  );
}
