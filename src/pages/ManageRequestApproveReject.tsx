import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';
import { LeaveRequest } from '../interface/LeaveRequest.interface';
import { useEffect, useState } from 'react';
import User from '../interface/User.interface';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';
import { firebase_collections } from '../../lib/firebase_collections';
import UserCalendar from '../components/userCalendar/UserCalendar';
import RequestApproveReject from '../components/forms/RequestApproveReject';

export default function ManageRequestApproveReject() {
  const { requestId } = useParams();
  const [request, setRequest] = useState<LeaveRequest | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!request?.requestedById) return;

    const userRef = doc(
      db,
      `${firebase_collections.USERS}/${request?.requestedById}`
    );
    const userUnsubscribe = onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) {
        setUser(null);
      } else {
        setUser(snapshot.data() as User);
      }
    });

    // Cleanup subscription on unmount
    return () => userUnsubscribe();
  }, [request?.requestedById]);

  return (
    <div className="p-4 md:p-8 md:min-w-xl rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <RequestAddEditForm
        requestId={requestId}
        disabled
        setRequest={setRequest}
      />
      {request && <RequestApproveReject request={request} />}
      {user && (
        <UserCalendar
          className="mt-8"
          user={user}
          initialDate={request?.from}
        />
      )}
    </div>
  );
}
