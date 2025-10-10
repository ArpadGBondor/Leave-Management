import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';
import User, { userTypeOptions } from '../interface/user.interface';
import ProfileBadge from '../components/profile/ProfileBadge';
import { firebase_collections } from '../../lib/firebase_collections';
import { Link } from 'react-router-dom';

type UserLinkProps = {
  user: User;
};

function UserLink({ user }: UserLinkProps) {
  return (
    <div className="p-4 rounded-xl bg-brand-green-700 hover:bg-brand-green-600 cursor-pointer">
      <Link to={`/manage-team/${user.id}`}>
        <ProfileBadge user={user} />
      </Link>
    </div>
  );
}

export default function ManageTeam() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersCol = collection(db, firebase_collections.USERS);

    // Real-time listener
    const unsubscribe = onSnapshot(
      usersCol,
      (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    );

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-8 m-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto">
      <h1 className="text-4xl font-bold text-brand-purple-600 mb-6">
        Manage Team
      </h1>

      {users.length === 0 ? (
        <div className="text-brand-green-600">No users found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {users
            .filter((user) => user.userType === userTypeOptions[2])
            .map((user) => (
              <UserLink user={user} />
            ))}
          {users
            .filter((user) => user.userType === userTypeOptions[1])
            .map((user) => (
              <UserLink user={user} />
            ))}
          {users
            .filter((user) => user.userType === userTypeOptions[0])
            .map((user) => (
              <UserLink user={user} />
            ))}
        </div>
      )}
    </div>
  );
}
