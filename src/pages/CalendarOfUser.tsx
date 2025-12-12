import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import User from '../interface/User.interface';
import { useLoadingContext } from '../context/loading/useLoadingContext';
import UserCalendar from '../components/userCalendar/UserCalendar';
import NavButton from '../components/buttons/NavButton';
import ProfileBadge from '../components/profile/ProfileBadge';
import { useFirebase } from '../hooks/useFirebase';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function CalendarOfUser() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const { startLoading, stopLoading } = useLoadingContext();

  const firebase = useFirebase();
  const db = firebase?.db;

  useEffect(() => {
    if (!db) return;
    if (!userId) return;

    startLoading('fetch-user');
    const userRef = doc(db, `${firebase_collections.USERS}/${userId}`);
    const userUnsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setUser(null);
        } else {
          setUser(snapshot.data() as User);
        }
        stopLoading('fetch-user');
      },
      (err) => {
        console.error('Error subscribing to user:', err);
        stopLoading('fetch-user');
      }
    );
    return () => userUnsubscribe();
  }, [db, userId]);

  return (
    <>
      {user && (
        <PageWrapper
          title={'Team member calendar'}
          size={'max-w-4xl'}
          backPath={'/calendars'}
        >
          <UserCalendar user={user} />
        </PageWrapper>
      )}
    </>
  );
}
