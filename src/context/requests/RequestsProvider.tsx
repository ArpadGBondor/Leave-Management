import React, { useReducer, useEffect } from 'react';
import { RequestsContext, RequestsState } from './RequestsContext';
import { RequestsReducer } from './RequestsReducer';
import { SET_OWN_REQUEST_COUNT, SET_MANAGABLE_REQUEST_COUNT } from '../types';
import { firebase_collections } from '../../../lib/firebase_collections';
import {
  collection,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useUserContext } from '../user/useUserContext';

interface RequestsProviderProps {
  children: React.ReactNode;
}

const initialState: RequestsState = {
  ownRequestCount: 0,
  managableRequestCount: 0,
};

const RequestsProvider: React.FC<RequestsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(RequestsReducer, initialState);

  const { user } = useUserContext();

  useEffect(() => {
    if (!user) return;
    const requestsRef = collection(db, firebase_collections.REQUESTS);
    const ownRequestQuery = query(requestsRef, where('userId', '==', user.id)); // only this user's requests

    const ownRequestsUnsubscribe: Unsubscribe = onSnapshot(
      ownRequestQuery,
      (snapshot) => {
        const requestCount: number = snapshot.docs.length;
        dispatch({
          type: SET_OWN_REQUEST_COUNT,
          payload: requestCount,
        });
      }
    );

    let managableRequestsUnsubscribe: null | Unsubscribe = null;

    if (user?.claims?.ADMIN || user?.claims?.SUPER_ADMIN) {
      managableRequestsUnsubscribe = onSnapshot(requestsRef, (snapshot) => {
        const requestCount: number = snapshot.docs.length;
        dispatch({
          type: SET_MANAGABLE_REQUEST_COUNT,
          payload: requestCount,
        });
      });
    } else {
      dispatch({
        type: SET_MANAGABLE_REQUEST_COUNT,
        payload: 0,
      });
    }

    return () => {
      ownRequestsUnsubscribe();
      managableRequestsUnsubscribe && managableRequestsUnsubscribe();
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
