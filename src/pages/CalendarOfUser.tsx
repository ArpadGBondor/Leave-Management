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
        <div className="p-4 md:p-8 md:min-w-sm lg:min-w-md w-full h-full md:w-auto md:h-auto md:m-4 md:rounded-xl md:border-4 md:border-brand-green-500 bg-brand-purple-50 overflow-auto  max-w-full">
          <div className="flex flex-col justify-stretch items-stretch gap-4 w-full">
            <h1 className="text-4xl font-bold text-brand-purple-600">
              Team member calendar
            </h1>
            <UserCalendar user={user} />
            <div className="flex flex-col items-center">
              <NavButton label="Back" link="/calendars" icon="FaArrowLeft" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
