import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import User from '../interface/User.interface';
import { useFirebase } from '../hooks/useFirebase';
import NewRequestAsATeamMemberInfo from '../components/info/NewRequestAsATeamMemberInfo';
import ActingAsTemaMemberWarning from '../components/warning/ActingAsTemaMemberWarning';

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
    <div className="p-4 md:p-8 md:min-w-xl w-full h-full md:w-auto md:h-auto md:m-4 md:rounded-xl md:border-4 md:border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-3xl space-y-4">
      <h2 className="text-4xl font-bold text-brand-purple-700">
        {isEditing
          ? 'Editing leave request as a team member'
          : 'New leave request as a team member'}
      </h2>

      {requestingUser && (
        <>
          <ActingAsTemaMemberWarning name={requestingUser.name} />
          <RequestAddEditForm
            requestId={requestId}
            user={requestingUser}
            navigateBack="/manage-requests"
          />
        </>
      )}
    </div>
  );
}
