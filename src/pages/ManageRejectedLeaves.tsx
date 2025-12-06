import { useEffect, useState } from 'react';
import {
  LeaveRequest,
  RequestTypeEnum,
} from '../interface/LeaveRequest.interface';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import { useUserContext } from '../context/user/useUserContext';
import { format } from 'date-fns';
import ChangeYear from '../components/complexInputs/ChangeYear';
import { useFirebase } from '../hooks/useFirebase';

export default function ManageRejectedLeaves() {
  const [rejectedLeaves, setRejectedLeaves] = useState<LeaveRequest[]>([]);
  const [year, setYear] = useState<number>(new Date().getUTCFullYear());
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  const firebase = useFirebase();
  const db = firebase?.db;

  useEffect(() => {
    if (!db) return;
    if (!year) return;

    const rejectedLeavesQuery = query(
      collection(db, firebase_collections.REJECTED_LEAVES),
      where('year', '==', `${year}`)
    );

    const unsubscribe = onSnapshot(
      rejectedLeavesQuery,
      (snapshot) => {
        const rejectedLeavesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LeaveRequest[];
        setRejectedLeaves(rejectedLeavesList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, year]);

  const columns: TableColumn<LeaveRequest>[] = [
    {
      header: 'Requested By',
      accessor: 'requestedByName',
      sortable: true,
      width: 'min-w-48',
    },
    {
      header: 'Request type',
      accessor: 'requestType',
      sortable: true,
      render: (requestType: string) => (
        <span
          className={`${
            requestType === RequestTypeEnum.Cancellation
              ? 'text-red-600'
              : requestType === RequestTypeEnum.Change
              ? 'text-brand-purple-600'
              : 'text-brand-green-600'
          }`}
        >
          {requestType}
        </span>
      ),
      width: 'min-w-40',
    },
    {
      header: 'Requested dates',
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
      header: 'Leave type',
      accessor: 'leaveType',
      sortable: true,
      width: 'min-w-32',
    },
    // {
    //   header: 'Additional information',
    //   accessor: 'description',
    //   sortable: true,
    //   width: 'max-w-48 md:max-w-64',
    //   render: (description: string) => (
    //     <div className="line-clamp-1">{description}</div>
    //   ),
    // },
    // {
    //   header: 'Updated',
    //   accessor: (row) => row.updated?.toDate(),
    //   sortable: true,
    //   render: (updated: Date) => `${format(updated, 'dd-MM-yyyy')}`,
    //   width: 'min-w-28',
    // },
  ];

  if (loading) return <div className="p-8">Loading rejected leaves...</div>;

  return (
    <div className="p-4 md:p-8 w-full h-full md:w-auto md:h-auto md:m-4 md:rounded-xl md:border-4 md:border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <h1 className="text-4xl font-bold text-brand-purple-600 mb-4">
        Team's rejected leaves
      </h1>
      <ChangeYear year={year} setYear={setYear} />
      <Table data={rejectedLeaves} columns={columns} />
    </div>
  );
}
