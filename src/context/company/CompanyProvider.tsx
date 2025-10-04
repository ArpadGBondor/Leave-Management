import React, { useReducer, useMemo, useCallback, useEffect } from 'react';
import { CompanyContext } from './CompanyContext';
import { loadingReducer, CompanyState } from './CompanyReducer';
import HolidayEntitlement from '../../interface/holidayEntitlement.interface';
import { useUserContext } from '../user/useUserContext';
import { auth, db } from '../../firebase.config';
import { SET_HOLIDAY_ENTITLEMENT } from '../types';
import { doc, onSnapshot } from 'firebase/firestore';
import { firebase_collections } from '../../../lib/firebase_collections';

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
};

const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);
  const { user } = useUserContext();

  const updateHolidayEntitlement = useCallback(
    async (data: HolidayEntitlement) => {
      if (!user) return;

      const token = await auth.currentUser?.getIdToken();

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

  useEffect(() => {
    const docRef = doc(
      db,
      firebase_collections.CONFIG,
      firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION // in config collection I store default fallback values for different collections. the name of the subcollection is the document ID
    );

    const unsubscribe = onSnapshot(docRef, (snap) => {
      console.log(`>>> WTF???`);
      if (snap.exists()) {
        dispatch({
          type: SET_HOLIDAY_ENTITLEMENT,
          payload: snap.data() as HolidayEntitlement,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        ...state,
        updateHolidayEntitlement,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
