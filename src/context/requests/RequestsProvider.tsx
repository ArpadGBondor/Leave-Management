import React, { useReducer, useEffect, useCallback } from 'react';
import { RequestsContext, RequestsState } from './RequestsContext';
import { RequestsReducer } from './RequestsReducer';
import {
  SET_OWN_REQUEST_COUNT,
  SET_MANAGABLE_REQUEST_COUNT,
  SET_OWN_APPROVED_LEAVES_COUNT,
  SET_OWN_REJECTED_LEAVES_COUNT,
} from '../types';
import { firebase_collections } from '../../../lib/firebase_collections';
import {
  collection,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { useUserContext } from '../user/useUserContext';
import {
  LeaveRequest,
  LeaveType,
  RequestTypeEnum,
} from '../../interface/LeaveRequest.interface';
import { useFirebase } from '../../hooks/useFirebase';

interface RequestsProviderProps {
  children: React.ReactNode;
}

const initialState: RequestsState = {
  ownRejectedLeavesCount: 0,
  ownApprovedLeavesCount: 0,
  ownRequestCount: 0,
  managableRequestCount: 0,
};

const RequestsProvider: React.FC<RequestsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(RequestsReducer, initialState);

  const { user } = useUserContext();

  const firebase = useFirebase();
  const db = firebase?.db;
  const auth = firebase?.auth;

  const createRequest = useCallback(
    async (
      leaveType: LeaveType,
      from: string,
      to: string,
      numberOfWorkdays: number,
      isNumberOfWorkdaysOverwritten: boolean,
      numberOfWorkdaysOverwritten: number,
      description: string
    ) => {
      if (!auth) throw new Error('Firebase not loaded yet');
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
        isNumberOfWorkdaysOverwritten,
        numberOfWorkdaysOverwritten,
        leaveType,
        requestType: RequestTypeEnum.New,
        description,
        year: from.slice(0, 4),
      };
      const createRequestResponse = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!createRequestResponse.ok)
        throw new Error('Failed to create request');
      const { doc } = await createRequestResponse.json();

      return doc;
    },
    [user, auth?.currentUser]
  );

  const updateRequest = useCallback(
    async (data: { id: string } & Partial<LeaveRequest>) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const requestResponse = await fetch('/api/requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          ...(data.from ? { year: data.from.slice(0, 4) } : {}),
        }),
      });
      if (!requestResponse.ok) throw new Error('Failed to update request');
      const { doc } = await requestResponse.json();

      return doc;
    },
    [user, auth?.currentUser]
  );

  const approveRequest = useCallback(
    async (data: { id: string } & Partial<LeaveRequest>) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const requestResponse = await fetch('/api/request-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          ...(data.from ? { year: data.from.slice(0, 4) } : {}),
          requestType: RequestTypeEnum.Approved,
          approvedById: user.id,
          approvedByName: user.name,
        }),
      });
      if (!requestResponse.ok) throw new Error('Failed to approve request');
      const { doc } = await requestResponse.json();

      return doc;
    },
    [user, auth?.currentUser]
  );

  const rejectRequest = useCallback(
    async (data: { id: string } & Partial<LeaveRequest>) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const requestResponse = await fetch('/api/request-reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          ...(data.from ? { year: data.from.slice(0, 4) } : {}),
          approvedById: user.id,
          approvedByName: user.name,
        }),
      });
      if (!requestResponse.ok) throw new Error('Failed to reject request');
      const { doc } = await requestResponse.json();

      return doc;
    },
    [user, auth?.currentUser]
  );

  const deleteRequest = useCallback(
    async (data: { id: string }) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const requestResponse = await fetch('/api/requests', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: data.id }),
      });
      if (!requestResponse.ok) throw new Error('Failed to delete request');
    },
    [auth?.currentUser]
  );

  const deleteRejectedLeave = useCallback(
    async (data: { id: string }) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const requestResponse = await fetch('/api/rejected-leaves', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: data.id }),
      });
      if (!requestResponse.ok) throw new Error('Failed to delete request');
    },
    [auth?.currentUser]
  );

  const reRequestRejectedLeave = useCallback(
    async (data: { id: string } & Partial<LeaveRequest>) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const requestResponse = await fetch('/api/rejected-leave-re-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          ...(data.from ? { year: data.from.slice(0, 4) } : {}),
        }),
      });
      if (!requestResponse.ok)
        throw new Error('Failed to re-request rejected leave');
      const { doc } = await requestResponse.json();

      return doc;
    },
    [user, auth?.currentUser]
  );

  const requestChangeToApprovedLeave = useCallback(
    async (data: { id: string } & Partial<LeaveRequest>) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!user) throw new Error('User not logged in');
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const requestResponse = await fetch(
        '/api/approved-leave-change-request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...data,
            ...(data.from ? { year: data.from.slice(0, 4) } : {}),
            requestType: RequestTypeEnum.Change,
          }),
        }
      );
      if (!requestResponse.ok)
        throw new Error('Failed to request change to approved leave');
      const { doc } = await requestResponse.json();

      return doc;
    },
    [user, auth?.currentUser]
  );

  useEffect(() => {
    if (!db) return;
    if (!user) return;
    const year = new Date().getUTCFullYear();

    const ownRejectedLeavesQuery = query(
      collection(db, firebase_collections.REJECTED_LEAVES),
      where('requestedById', '==', user.id),
      where('year', '==', `${year}`)
    );

    const ownRejectedLeavesUnsubscribe: Unsubscribe = onSnapshot(
      ownRejectedLeavesQuery,
      (snapshot) => {
        const requestCount: number = snapshot.docs.length;
        dispatch({
          type: SET_OWN_REJECTED_LEAVES_COUNT,
          payload: requestCount,
        });
      }
    );

    const ownApprovedLeavesQuery = query(
      collection(db, firebase_collections.APPROVED_LEAVES),
      where('requestedById', '==', user.id),
      where('year', '==', `${year}`)
    );

    const ownApprovedLeavesUnsubscribe: Unsubscribe = onSnapshot(
      ownApprovedLeavesQuery,
      (snapshot) => {
        const requestCount: number = snapshot.docs.length;
        dispatch({
          type: SET_OWN_APPROVED_LEAVES_COUNT,
          payload: requestCount,
        });
      }
    );

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
      ownRejectedLeavesUnsubscribe();
      ownApprovedLeavesUnsubscribe();
      ownRequestsUnsubscribe();
      managableRequestsUnsubscribe && managableRequestsUnsubscribe();
    };
  }, [db, user]);

  return (
    <RequestsContext.Provider
      value={{
        ...state,
        createRequest,
        updateRequest,
        approveRequest,
        rejectRequest,
        deleteRequest,
        deleteRejectedLeave,
        reRequestRejectedLeave,
        requestChangeToApprovedLeave,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export default RequestsProvider;
