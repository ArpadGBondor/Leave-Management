import { useEffect, useState } from 'react';
import {
  LeaveRequest,
  RequestTypeEnum,
} from '../interface/LeaveRequest.interface';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import { format } from 'date-fns';
import ChangeYear from '../components/complexInputs/ChangeYear';
import { useFirebase } from '../hooks/useFirebase';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function ManageRejectedLeaves() {
  const [rejectedLeaves, setRejectedLeaves] = useState<LeaveRequest[]>([]);
  const [year, setYear] = useState<number>(new Date().getUTCFullYear());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <PageWrapper title={"Team's rejected leaves"} size={'max-w-4xl'}>
      <ChangeYear year={year} setYear={setYear} />
      <Table
        data={rejectedLeaves}
        columns={columns}
        onRowClick={(request) =>
          navigate(`/manage-rejected-leaves/${request.id}`)
        }
      />
    </PageWrapper>
  );
}
