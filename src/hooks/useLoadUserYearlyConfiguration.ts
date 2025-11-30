import { useState, useCallback } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import UserHolidayEntitlement from '../interface/UserHolidayEntitlement.interface';
import WorkdaysOfTheWeek from '../interface/WorkdaysOfTheWeek.interface';
import { Leave } from '../interface/Leave.interface';
import { useCompanyContext } from '../context/company/useCompanyContext';

interface UseLoadUserYearlyConfigurationProps {
  db: any;
  userId: string;
}

export default function useLoadUserYearlyConfiguration({
  db,
  userId,
}: UseLoadUserYearlyConfigurationProps) {
  const {
    workdaysOfTheWeek: companyWorkdays,
    bankHolidayRegion: companyBankHolidayRegion,
  } = useCompanyContext();
  const [loadedYear, setLoadedYear] = useState('');
  const [workdaysOfTheWeek, setWorkdaysOfTheWeek] =
    useState<WorkdaysOfTheWeek>(companyWorkdays);
  const [bankHolidays, setBankHolidays] = useState<Leave[]>([]);

  const loadYear = useCallback(
    async (year: string) => {
      if (!db || !userId) return;

      const configRef = doc(
        db,
        `${firebase_collections.USERS}/${userId}/${firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION}/${year}`
      );

      const configSnap = await getDoc(configRef);

      let finalWorkdays = companyWorkdays;
      let finalRegion = companyBankHolidayRegion.bankHolidayRegionId;

      if (configSnap.exists()) {
        const data = configSnap.data() as UserHolidayEntitlement;

        finalWorkdays = {
          monday: data.monday,
          tuesday: data.tuesday,
          wednesday: data.wednesday,
          thursday: data.thursday,
          friday: data.friday,
          saturday: data.saturday,
          sunday: data.sunday,
        };

        finalRegion = data.bankHolidayRegionId;
      }

      setWorkdaysOfTheWeek(finalWorkdays);

      const bankHolidayRef = collection(
        db,
        `${firebase_collections.BANK_HOLIDAYS}/${finalRegion}/${year}`
      );

      const bankHolidaySnap = await getDocs(bankHolidayRef);

      const holidays: Leave[] = [];
      for (const docSnap of bankHolidaySnap.docs) {
        const data = docSnap.data();
        const date = new Date(data.date);
        holidays.push({ from: date, to: date });
      }

      setBankHolidays(holidays);

      setLoadedYear(year);
    },
    [db, userId, companyWorkdays, companyBankHolidayRegion]
  );

  return {
    loadedYear,
    workdaysOfTheWeek,
    bankHolidays,
    loadYear,
  };
}
