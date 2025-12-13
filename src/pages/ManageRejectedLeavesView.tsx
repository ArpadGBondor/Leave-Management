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
import PageWrapper from '../components/pageWrapper/PageWrapper';

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
    <PageWrapper
      title={'Rejected leave request details'}
      size={'max-w-10xl'}
      backPath="/manage-rejected-leaves"
    >
      <div className="flex flex-col 2xl:flex-row gap-8">
        <div className="flex-2 space-y-4">
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
        </div>
        {requestingUser && (
          <div className="flex-2">
            <UserCalendar user={requestingUser} initialDate={request?.from} />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
