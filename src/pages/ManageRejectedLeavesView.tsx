import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';
import { LeaveRequest } from '../interface/LeaveRequest.interface';
import { useEffect, useState } from 'react';
import User from '../interface/User.interface';
import { doc, onSnapshot } from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import UserCalendar from '../components/userCalendar/UserCalendar';
import { useFirebase } from '../hooks/useFirebase';
import ManageRejectedLeaveActions from '../components/forms/ManageRejectedLeaveActions';
import { useUserContext } from '../context/user/useUserContext';

export default function ManageRejectedLeavesView() {
  const { requestId } = useParams();
  const [request, setRequest] = useState<LeaveRequest | null>(null);
  const [requestingUser, setRequestingUser] = useState<User | null>(null);
  const { user } = useUserContext();

  const firebase = useFirebase();
  const db = firebase?.db;

  useEffect(() => {
    if (!db) return;
    if (!request?.requestedById) return;

    const userRef = doc(
      db,
      `${firebase_collections.USERS}/${request?.requestedById}`
    );
    const userUnsubscribe = onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) {
        setRequestingUser(null);
      } else {
        setRequestingUser(snapshot.data() as User);
      }
    });

    // Cleanup subscription on unmount
    return () => userUnsubscribe();
  }, [db, request?.requestedById]);

  return (
    <div className="p-4 md:p-8 md:min-w-xl w-full h-full md:w-auto md:h-auto md:m-4 md:rounded-xl md:border-4 md:border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <h2 className="text-4xl font-bold text-brand-purple-700">
        Rejected leave request details
      </h2>
      {user && (
        <RequestAddEditForm
          requestId={requestId}
          requestCollection={firebase_collections.REJECTED_LEAVES}
          disabled
          setRequest={setRequest}
          user={user}
        />
      )}
      {request && <ManageRejectedLeaveActions request={request} />}

      {requestingUser && (
        <UserCalendar
          className="mt-8"
          user={requestingUser}
          initialDate={request?.from}
        />
      )}
    </div>
  );
}
