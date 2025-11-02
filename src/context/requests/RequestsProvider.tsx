import React, { useReducer, useEffect, useCallback } from 'react';
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
import { auth, db } from '../../firebase.config';
import { useUserContext } from '../user/useUserContext';
import {
  LeaveRequest,
  LeaveRequestType,
} from '../../interface/LeaveRequest.interface';
import { data } from 'react-router-dom';

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

  const createRequest = useCallback(
    async (
      requestType: LeaveRequestType,
      from: string,
      to: string,
      numberOfWorkdays: number,
      description: string
    ) => {
      const currentUser = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const data: Partial<LeaveRequest> = {
        // id: '', ID will be auto generated
        requestedById: user.id,
        requestedByName: user.name,
        approvedById: '',
        approvedByName: '',
        from,
        to,
        numberOfWorkdays,
        requestType,
        description,
      };
      const createRequestResponse = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!createRequestResponse.ok) throw new Error('Failed to set role');
      const { doc } = await createRequestResponse.json();

      return doc;
    },
    [user, auth.currentUser]
  );

  const updateRequest = useCallback(
    async (data: { id: string } & Partial<LeaveRequest>) => {
      const currentUser = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const createRequestResponse = await fetch('/api/requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data }),
      });
      if (!createRequestResponse.ok) throw new Error('Failed to set role');
      const { doc } = await createRequestResponse.json();

      return doc;
    },
    [user, auth.currentUser]
  );

  useEffect(() => {
    if (!user) return;
    const requestsRef = collection(db, firebase_collections.REQUESTS);
    const ownRequestQuery = query(
      requestsRef,
      where('requestedById', '==', user.id)
    ); // only this user's requests

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
        createRequest,
        updateRequest,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export default RequestsProvider;
