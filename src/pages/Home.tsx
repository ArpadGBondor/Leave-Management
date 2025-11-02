import { useEffect, useState } from 'react';
import Calendar from '../components/calendar/Calendar';
import { Leave } from '../interface/Leave.interface';
import WorkdaysOfTheWeek from '../interface/WorkdaysOfTheWeek.interface';
import { format } from 'date-fns';
import { useUserContext } from '../context/user/useUserContext';
import { useLoadingContext } from '../context/loading/useLoadingContext';
import { firebase_collections } from '../../lib/firebase_collections';
import { db } from '../firebase.config';
import {
  collection,
  doc,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { useCompanyContext } from '../context/company/useCompanyContext';
import UserHolidayEntitlement from '../interface/UserHolidayEntitlement.interface';

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bankHolidayRegion, setBankHolidayRegion] = useState('');
  const [bankHolidays, setBankHolidays] = useState<Leave[]>([
    { from: new Date('2025-12-25'), to: new Date('2025-12-26') },
  ]);
  const [requested, setRequested] = useState<Leave[]>([
    { from: new Date('2025-10-30'), to: new Date('2025-11-02') },
  ]);
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

  const { user } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const {
    workdaysOfTheWeek: companyWorkdaysOfTheWeek,
    bankHolidayRegion: companyBankHolidayRegion,
  } = useCompanyContext();
  const currentYear = format(currentMonth, 'yyyy');

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

    startLoading('fetch-configured-years');
    const configurationRef = doc(
      db,
      `${firebase_collections.USERS}/${user.id}/${firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION}/${currentYear}`
    );
    const configurationUnsubscribe = onSnapshot(configurationRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as UserHolidayEntitlement;
        setWorkdaysOfTheWeek({
          monday: data.monday,
          tuesday: data.tuesday,
          wednesday: data.wednesday,
          thursday: data.thursday,
          friday: data.friday,
          saturday: data.saturday,
          sunday: data.sunday,
        });
        setBankHolidayRegion(data.bankHolidayRegionId);
      } else {
        setWorkdaysOfTheWeek(companyWorkdaysOfTheWeek);
        setBankHolidayRegion(companyBankHolidayRegion.bankHolidayRegionId);
      }
      stopLoading('fetch-configured-years');
    });
    return () => {
      configurationUnsubscribe();
    };
  }, [user?.id, currentYear]);

  useEffect(() => {
    if (!bankHolidayRegion) return;
    startLoading('fetch-bank-holidays');
    const bankHolidayRef = collection(
      db,
      `/${firebase_collections.BANK_HOLIDAYS}/${bankHolidayRegion}/${currentYear}`
    );
    const bankHolidaysUnsubscribe = onSnapshot(bankHolidayRef, (snapshot) => {
      const leaves: Leave[] = [];
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const date = new Date(data.date);
        leaves.push({ from: date, to: date });
      }
      setBankHolidays(leaves);
      stopLoading('fetch-bank-holidays');
    });
    return () => bankHolidaysUnsubscribe();
  }, [bankHolidayRegion, currentYear]);

  const approved: Leave[] = [
    { from: new Date('2025-11-05'), to: new Date('2025-11-07') },
  ];

  return (
    <div className="p-4 md:p-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto  max-w-full">
      <div className="flex flex-col justify-stretch items-stretch gap-4 w-full">
        <h1 className="text-4xl font-bold text-brand-purple-600 text-center">
          Manage your leaves
        </h1>
        <Calendar
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          workdaysOfTheWeek={workdaysOfTheWeek}
          bankHolidays={bankHolidays}
          approved={approved}
          requests={requested}
          serviceStartDate={
            user?.serviceStartDate
              ? new Date(user?.serviceStartDate)
              : undefined
          }
          serviceEndDate={
            user?.serviceEndDate ? new Date(user?.serviceEndDate) : undefined
          }
        />
      </div>
    </div>
  );
}
