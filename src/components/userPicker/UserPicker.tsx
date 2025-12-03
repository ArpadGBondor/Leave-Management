import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { collection, onSnapshot } from 'firebase/firestore';
import User, { userTypeOptions } from '../../interface/User.interface';
import { firebase_collections } from '../../../lib/firebase_collections';
import Table from '../table/Table';
import { TableColumn } from '../table/types';
import { maskEmail } from '../../utils/maskEmail';
import { useFirebase } from '../../hooks/useFirebase';
import EmailMaskingInfo from '../info/EmailMaskingInfo';

interface UserPickerProps {
  onClick: (user: User) => void;
}

export default function UserPicker({ onClick }: UserPickerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const firebase = useFirebase();
  const db = firebase?.db;

  useEffect(() => {
    if (!db) return;
    const usersCol = collection(db, firebase_collections.USERS);

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

    return () => unsubscribe();
  }, [db]);

  if (loading) return <div className="p-8">Loading users...</div>;

  const columns: TableColumn<User>[] = [
    {
      header: 'User type',
      accessor: 'userType',
      sortable: true,
      render: (userType: string) => <strong>{userType}</strong>,
      width: 'w-28',
      searchable: 'userType',
    },
    {
      header: 'Photo',
      accessor: 'photo',
      render: (photo: string) => (
        <img
          src={photo}
          alt="Profile picture"
          className="w-12 h-12 rounded-full border-2 border-brand-green-700 block"
        />
      ),
      align: 'center',
      width: 'min-w-20 w-20',
    },
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (name: string) => <strong>{name}</strong>,
      searchable: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (email) => maskEmail(email),
      sortable: true,
      width: 'min-w-32',
    },
    {
      header: 'Created',
      accessor: (row) => row.created?.toDate(),
      sortable: true,
      render: (created: Date) => `${format(created, 'dd-MM-yyyy')}`,
      width: 'min-w-28',
    },
    {
      header: 'Updated',
      accessor: (row) => row.updated?.toDate(),
      sortable: true,
      render: (updated: Date) => `${format(updated, 'dd-MM-yyyy')}`,
      width: 'min-w-28',
    },
  ];

  return (
    <>
      <Table
        data={users}
        columns={columns}
        onRowClick={onClick}
        pageSize={10}
        title="Please select a team member"
        defaultSort={{
          columnIndex: 0,
          direction: 'desc',
        }}
      />
      <EmailMaskingInfo />
    </>
  );
}
