import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import User from '../interface/User.interface';
import { useFirebase } from '../hooks/useFirebase';
import NewRequestAsATeamMemberInfo from '../components/info/NewRequestAsATeamMemberInfo';
import ActingAsTemaMemberWarning from '../components/warning/ActingAsTemaMemberWarning';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function ManageNewRequestAddEdit() {
  const { requestId, requestingUserId } = useParams();
  const [requestingUser, setRequestingUser] = useState<User | null>(null);

  const firebase = useFirebase();
  const db = firebase?.db;

  const isEditing = Boolean(requestId !== 'new');

  useEffect(() => {
    if (!db) return;
    if (!requestingUserId) return;

    const userRef = doc(
      db,
      `${firebase_collections.USERS}/${requestingUserId}`
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
  }, [db, requestingUserId]);

  return (
    <PageWrapper
      title={
        isEditing
          ? 'Editing leave request as a team member'
          : 'New leave request as a team member'
      }
      size={'max-w-4xl'}
      backPath="/manage-new-request"
    >
      {requestingUser && (
        <>
          <ActingAsTemaMemberWarning name={requestingUser.name} />
          <RequestAddEditForm
            requestId={requestId}
            user={requestingUser}
            navigateBack="/manage-new-request"
          />
        </>
      )}
    </PageWrapper>
  );
}
