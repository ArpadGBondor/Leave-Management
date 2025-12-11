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
import { useNavigate } from 'react-router-dom';
import Button from '../components/buttons/Button';
import { format } from 'date-fns';
import { useFirebase } from '../hooks/useFirebase';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function Requests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate();

  const firebase = useFirebase();
  const db = firebase?.db;

  useEffect(() => {
    if (!db) return;
    if (!user?.id) return;
    const requestsRef = collection(db, firebase_collections.REQUESTS);
    const ownRequestQuery = query(
      requestsRef,
      where('requestedById', '==', user.id)
    ); // only this user's requests

    const unsubscribe = onSnapshot(
      ownRequestQuery,
      (snapshot) => {
        const requestsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LeaveRequest[];
        setRequests(requestsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, user?.id]);

  const columns: TableColumn<LeaveRequest>[] = [
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
      header: 'Number of workdays',
      accessor: (row) =>
        row.isNumberOfWorkdaysOverwritten
          ? row.numberOfWorkdaysOverwritten
          : row.numberOfWorkdays,
      sortable: true,
      width: 'min-w-24',
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
    //   width: 'min-w-64',
    // },
    // {
    //   header: 'Updated',
    //   accessor: (row) => row.updated?.toDate(),
    //   sortable: true,
    //   render: (updated: Date) => `${format(updated, 'dd-MM-yyyy')}`,
    //   width: 'min-w-28',
    // },
  ];

  if (loading) return <div className="p-8">Loading requests...</div>;

  return (
    <PageWrapper title={'Your pending leave requests'} size={'max-w-4xl'}>
      <Table
        data={requests}
        columns={columns}
        onRowClick={(request) => navigate(`/requests/${request.id}`)}
      />
      <Button
        label="New leave request"
        onClick={() => navigate(`/requests/new`)}
      />
    </PageWrapper>
  );
}
