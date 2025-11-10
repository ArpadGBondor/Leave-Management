import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';
import User, { userTypeOptions } from '../interface/User.interface';
import { firebase_collections } from '../../lib/firebase_collections';
import { useNavigate } from 'react-router-dom';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
import { maskEmail } from '../utils/maskEmail';
import { format } from 'date-fns';

export default function ManageTeam() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  if (loading) return <div className="p-8">Loading users...</div>;

  const columns: TableColumn<User>[] = [
    {
      header: 'Photo',
      accessor: 'photo',
      render: (photo: string) => (
        <img
          src={photo}
          alt="Profile picture"
          className="w-8 h-8 rounded-full border-2 border-brand-purple-300 block"
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
      width: 'min-w-24',
    },
    {
      header: 'Updated',
      accessor: (row) => row.updated?.toDate(),
      sortable: true,
      render: (updated: Date) => `${format(updated, 'dd-MM-yyyy')}`,
      width: 'min-w-24',
    },
  ];

  return (
    <div className="p-4 md:p-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <h1 className="text-4xl font-bold text-brand-purple-600">Manage Team</h1>
      <Table
        title="Owners"
        data={users.filter((user) => user.userType === userTypeOptions[2])}
        columns={columns}
        onRowClick={(user) => navigate(`/manage-team/${user.id}`)}
      />
      <Table
        title="Managers"
        data={users.filter((user) => user.userType === userTypeOptions[1])}
        columns={columns}
        onRowClick={(user) => navigate(`/manage-team/${user.id}`)}
      />
      <Table
        title="Employees"
        data={users.filter((user) => user.userType === userTypeOptions[0])}
        columns={columns}
        onRowClick={(user) => navigate(`/manage-team/${user.id}`)}
      />
    </div>
  );
}
