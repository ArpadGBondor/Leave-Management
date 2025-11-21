import { useEffect, useState } from 'react';
import { LeaveRequest } from '../interface/LeaveRequest.interface';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import { db } from '../firebase.config';
import { useUserContext } from '../context/user/useUserContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Button from '../components/buttons/Button';

export default function ApprovedLeaves() {
  const [approvedLeaves, setApprovedLeaves] = useState<LeaveRequest[]>([]);
  const [year, setYear] = useState<number>(new Date().getUTCFullYear());
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    const ownApprovedLeavesQuery = query(
      collection(db, firebase_collections.APPROVED_LEAVES),
      where('requestedById', '==', user.id),
      where('year', '==', `${year}`)
    );
    const unsubscribe = onSnapshot(
      ownApprovedLeavesQuery,
      (snapshot) => {
        const approvedLeavesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LeaveRequest[];
        setApprovedLeaves(approvedLeavesList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id, year]);

  const columns: TableColumn<LeaveRequest>[] = [
    {
      header: 'Requested Dates',
      accessor: (row) => new Date(row.from), // Accessor is Date type, so it can get sorted
      sortable: true,
      render: (from: Date, row: LeaveRequest) =>
        row.from === row.to
          ? `${format(from, 'dd-MM-yyyy')}`
          : `${format(from, 'dd-MM-yyyy')} - ${format(
              new Date(row.to),
              'dd-MM-yyyy'
            )}`,
      width: 'min-w-48',
    },
    {
      header: 'Number of workdays',
      accessor: 'numberOfWorkdays',
      sortable: true,
      width: 'min-w-24',
    },
    {
      header: 'Request Type',
      accessor: 'requestType',
      sortable: true,
      width: 'min-w-32',
    },
    {
      header: 'Additional information',
      accessor: 'description',
      sortable: true,
      width: 'min-w-64',
    },
    {
      header: 'Updated',
      accessor: (row) => row.updated?.toDate(),
      sortable: true,
      render: (updated: Date) => `${format(updated, 'dd-MM-yyyy')}`,
      width: 'min-w-28',
    },
  ];

  if (loading) return <div className="p-8">Loading approved leaves...</div>;

  return (
    <div className="p-4 md:p-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <div className="flex flex-row justify-between items-center gap-4">
        <div>
          <Button
            onClick={() => setYear(year - 1)}
            label={'<< Previous year'}
            variant="secondary"
          />
        </div>
        <h2 className="text-3xl font-bold text-brand-purple-600">{year}</h2>
        <div>
          <Button
            onClick={() => setYear(year + 1)}
            label={'Next year >>'}
            variant="secondary"
          />
        </div>
      </div>
      <Table
        data={approvedLeaves}
        columns={columns}
        title="Your approved leaves"
      />
    </div>
  );
}
