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
      header: 'Photo',
      accessor: 'photo',
      render: (photo: string) => (
        <img
          src={photo}
          alt="Profile picture"
          className="w-8 h-8 rounded-full border-2 border-brand-green-700 block"
        />
      ),
      align: 'center',
    },
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (name: string) => <strong>{name}</strong>,
      width: 'min-w-48',
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
      <EmailMaskingInfo />
      <Table
        title="Owners"
        data={users.filter((user) => user.userType === userTypeOptions[2])}
        columns={columns}
        onRowClick={onClick}
      />
      <Table
        title="Managers"
        data={users.filter((user) => user.userType === userTypeOptions[1])}
        columns={columns}
        onRowClick={onClick}
      />
      <Table
        title="Employees"
        data={users.filter((user) => user.userType === userTypeOptions[0])}
        columns={columns}
        onRowClick={onClick}
      />
    </>
  );
}
