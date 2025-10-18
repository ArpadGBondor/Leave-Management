import React, { useReducer, useCallback, useEffect } from 'react';
import { CompanyContext } from './CompanyContext';
import { loadingReducer, CompanyState } from './CompanyReducer';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import { useUserContext } from '../user/useUserContext';
import { auth, db } from '../../firebase.config';
import {
  SET_HOLIDAY_ENTITLEMENT,
  SET_WORKDAYS_OF_THE_WEEK,
  SET_REGIONS_AND_YEARS,
  SET_REGIONS_AND_YEARS_LOADED,
} from '../types';
import { doc, onSnapshot } from 'firebase/firestore';
import { firebase_collections } from '../../../lib/firebase_collections';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import ImportBankHolidayResponse from '../../interface/ImportBankHolidayResponse.interface';
import BankHolidayRegionsAndYears from '../../interface/BankHolidayRegionsAndYears.interface';

interface CompanyProviderProps {
  children: React.ReactNode;
}

const initialState: CompanyState = {
  holidayEntitlement: {
    base: 28,
    additional: 0,
    multiplier: 1,
    total: 28,
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
  importedRegionsAndYears: {},
  importedRegionsAndYearsLoaded: false,
};

const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);
  const { user } = useUserContext();

  const updateHolidayEntitlement = useCallback(
    async (data: HolidayEntitlement) => {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

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
    [user]
  );

  const updateWorkdaysOfTheWeek = useCallback(
    async (data: WorkdaysOfTheWeek) => {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

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
    [user]
  );

  const importBankHolidaysFromGovUK =
    useCallback(async (): Promise<ImportBankHolidayResponse> => {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

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
    }, [user]);

  const fetchImportedBankHolidayRegionsAndYears = useCallback(
    async (refetch?: boolean): Promise<BankHolidayRegionsAndYears> => {
      if (!refetch && state.importedRegionsAndYearsLoaded)
        return state.importedRegionsAndYears;
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const response = await fetch('/api/bank-holiday-collections', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Data fetch failed: ${errMsg}`);
      }

      const { regions } = await response.json();
      dispatch({ type: SET_REGIONS_AND_YEARS, payload: regions });
      dispatch({ type: SET_REGIONS_AND_YEARS_LOADED, payload: true });
      return regions;
    },
    [user, state.importedRegionsAndYears, state.importedRegionsAndYearsLoaded]
  );

  useEffect(() => {
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

    return () => {
      holidayEntitlementUnsubscribe();
      workdaysUnsubscribe();
    };
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        ...state,
        updateHolidayEntitlement,
        updateWorkdaysOfTheWeek,
        importBankHolidaysFromGovUK,
        fetchImportedBankHolidayRegionsAndYears,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
