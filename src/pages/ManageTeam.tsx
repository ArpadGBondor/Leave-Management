import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';
import User, { userTypeOptions } from '../interface/user.interface';
import ProfileBadge from '../components/profile/ProfileBadge';
import { firebase_collections } from '../../lib/firebase_collections';
import { Link, useNavigate } from 'react-router-dom';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';

type UserLinkProps = {
  user: User;
};

export default function ManageTeam() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const columns: TableColumn<User>[] = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (name: string) => <strong>{name}</strong>,
      width: 'min-w-48',
    },
    { header: 'Email', accessor: 'email', sortable: true, width: 'min-w-48' },
    {
      header: 'Created',
      accessor: (row: User) => row.created?.toDate().toLocaleDateString(),
      sortable: true,
      align: 'center',
      width: 'w-30',
    },
    {
      header: 'Updated',
      accessor: (row: User) => row.updated?.toDate().toLocaleDateString(),
      sortable: true,
      align: 'center',
      width: 'w-30',
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
