import React, { useReducer, useMemo, useEffect } from 'react';
import { RequestsContext } from './RequestsContext';
import { RequestsReducer, RequestsState } from './RequestsReducer';
import { SET_REQUEST_COUNT } from '../types';
import { firebase_collections } from '../../../lib/firebase_collections';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useUserContext } from '../user/useUserContext';

interface RequestsProviderProps {
  children: React.ReactNode;
}

const initialState: RequestsState = { requestCount: 0 };

const RequestsProvider: React.FC<RequestsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(RequestsReducer, initialState);

  const { user } = useUserContext();

  useEffect(() => {
    if (!user) return;
    const requestsRef = collection(db, firebase_collections.REQUESTS);

    const requestQuery =
      user?.claims?.ADMIN || user?.claims?.SUPER_ADMIN
        ? requestsRef // all requests
        : query(requestsRef, where('userId', '==', user.id)); // only this user's requests

    const requestsUnsubscribe = onSnapshot(requestQuery, (snapshot) => {
      const requestCount: number = snapshot.docs.length;
      dispatch({
        type: SET_REQUEST_COUNT,
        payload: requestCount,
      });
    });

    return () => {
      requestsUnsubscribe();
    };
  }, [user]);

  return (
    <RequestsContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export default RequestsProvider;
