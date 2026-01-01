import React, { useReducer, useCallback, useEffect } from 'react';
import { CompanyContext, CompanyState } from './CompanyContext';
import { loadingReducer } from './CompanyReducer';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import { useUserContext } from '../user/useUserContext';
import {
  SET_HOLIDAY_ENTITLEMENT,
  SET_WORKDAYS_OF_THE_WEEK,
  SET_IMPORTED_REGIONS,
  SET_IMPORTED_YEARS,
  SET_BANK_HOLIDAY_REGION,
  SET_BANK_HOLIDAYS_CACHE,
} from '../types';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { firebase_collections } from '../../../lib/firebase_collections';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import ImportBankHolidayResponse from '../../interface/ImportBankHolidayResponse.interface';
import BankHolidayRegion from '../../interface/BankHolidayRegion.interface';
import { useFirebase } from '../../hooks/useFirebase';

interface CompanyProviderProps {
  children: React.ReactNode;
}

const initialState: CompanyState = {
  holidayEntitlement: {
    holidayEntitlementBase: 28,
    holidayEntitlementAdditional: 0,
    holidayEntitlementMultiplier: 1,
    holidayEntitlementDeduction: 0,
    holidayEntitlementTotal: 28,
  },
  workdaysOfTheWeek: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  },
  bankHolidayRegion: {
    bankHolidayRegionId: '',
    numberOfBankHolidays: 0,
  },
  importedRegions: [],
  importedYears: [],
  bankHolidayCache: {},
};

const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);
  const { user } = useUserContext();
  const firebase = useFirebase();
  const db = firebase?.db;
  const auth = firebase?.auth;

  const updateHolidayEntitlement = useCallback(
    async (data: HolidayEntitlement) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken(true);

      const setHolidayEntitlementResponse = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          id: firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION,
        }),
      });
      if (!setHolidayEntitlementResponse.ok)
        throw new Error('Failed to set config');
      const { doc } = await setHolidayEntitlementResponse.json();

      dispatch({ type: SET_HOLIDAY_ENTITLEMENT, payload: doc });
    },
    [user, firebase]
  );

  const updateWorkdaysOfTheWeek = useCallback(
    async (data: WorkdaysOfTheWeek) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken(true);

      const setWorkdaysOfTheWeekResponse = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          id: firebase_collections.WORKDAYS_OF_THE_WEEK,
        }),
      });
      if (!setWorkdaysOfTheWeekResponse.ok)
        throw new Error('Failed to set config');
      const { doc } = await setWorkdaysOfTheWeekResponse.json();

      dispatch({ type: SET_WORKDAYS_OF_THE_WEEK, payload: doc });
    },
    [user, firebase]
  );

  const updateBankHolidayRegion = useCallback(
    async (data: BankHolidayRegion) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken(true);

      const setWorkdaysOfTheWeekResponse = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          id: firebase_collections.BANK_HOLIDAY_REGION,
        }),
      });
      if (!setWorkdaysOfTheWeekResponse.ok)
        throw new Error('Failed to set config');
      const { doc } = await setWorkdaysOfTheWeekResponse.json();

      dispatch({ type: SET_BANK_HOLIDAY_REGION, payload: doc });
    },
    [user, firebase]
  );

  const importBankHolidaysFromGovUK =
    useCallback(async (): Promise<ImportBankHolidayResponse> => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken(true);

      const response = await fetch('/api/import-bank-holidays', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Import failed: ${errMsg}`);
      }

      const result = await response.json();
      return result;
    }, [user, firebase]);

  const getBankHolidays = useCallback(
    async (regionId: string, year: string) => {
      if (!db) throw new Error('Firestore unavailable');
      if (!regionId || !year) return [];

      const key = `${regionId}-${year}`;

      // Return cached dates
      if (state.bankHolidayCache[key]) {
        return state.bankHolidayCache[key];
      }

      const bankHolidayRef = collection(
        db,
        `${firebase_collections.BANK_HOLIDAYS}/${regionId}/${year}`
      );

      const snapshot = await getDocs(bankHolidayRef);
      const dates = snapshot.docs.map((doc) => new Date(doc.id));

      // Do not cache if there's nothing to cache.
      // Import might fill up database with missing years.
      if (dates.length) {
        dispatch({
          type: SET_BANK_HOLIDAYS_CACHE,
          payload: { key, dates },
        });
      }

      return dates;
    },
    [db, state.bankHolidayCache]
  );

  useEffect(() => {
    if (!db) return;
    const holidayEntitlementRef = doc(
      db,
      firebase_collections.CONFIG,
      firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION // in config collection I store default fallback values for different collections. the name of the subcollection is the document ID
    );

    const holidayEntitlementUnsubscribe = onSnapshot(
      holidayEntitlementRef,
      (snap) => {
        if (snap.exists()) {
          dispatch({
            type: SET_HOLIDAY_ENTITLEMENT,
            payload: snap.data() as HolidayEntitlement,
          });
        }
      }
    );

    const workdaysRef = doc(
      db,
      firebase_collections.CONFIG,
      firebase_collections.WORKDAYS_OF_THE_WEEK
    );

    const workdaysUnsubscribe = onSnapshot(workdaysRef, (snap) => {
      if (snap.exists()) {
        dispatch({
          type: SET_WORKDAYS_OF_THE_WEEK,
          payload: snap.data() as WorkdaysOfTheWeek,
        });
      }
    });

    const bankHolidayRegionRef = doc(
      db,
      firebase_collections.CONFIG,
      firebase_collections.BANK_HOLIDAY_REGION
    );

    const bankHolidayRegionUnsubscribe = onSnapshot(
      bankHolidayRegionRef,
      (snap) => {
        if (snap.exists()) {
          dispatch({
            type: SET_BANK_HOLIDAY_REGION,
            payload: snap.data() as BankHolidayRegion,
          });
        }
      }
    );

    const regionsRef = collection(db, firebase_collections.BANK_HOLIDAYS);
    const importedRegionsUnsubscribe = onSnapshot(regionsRef, (snapshot) => {
      const regions: string[] = snapshot.docs.map((doc) => doc.id);
      dispatch({
        type: SET_IMPORTED_REGIONS,
        payload: regions.sort(),
      });
    });

    const yearsRef = collection(
      db,
      firebase_collections.BANK_HOLIDAY_IMPORTED_YEARS
    );
    const importedYearsUnsubscribe = onSnapshot(yearsRef, (snapshot) => {
      const years: string[] = snapshot.docs.map((doc) => doc.id);
      dispatch({
        type: SET_IMPORTED_YEARS,
        payload: years.sort(),
      });
    });

    return () => {
      holidayEntitlementUnsubscribe();
      workdaysUnsubscribe();
      bankHolidayRegionUnsubscribe();
      importedRegionsUnsubscribe();
      importedYearsUnsubscribe();
    };
  }, [db]);

  return (
    <CompanyContext.Provider
      value={{
        ...state,
        updateHolidayEntitlement,
        updateWorkdaysOfTheWeek,
        updateBankHolidayRegion,
        importBankHolidaysFromGovUK,
        getBankHolidays,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
