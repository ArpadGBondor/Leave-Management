import { useEffect, useState } from 'react';
import { LeaveRequest } from '../interface/LeaveRequest.interface';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import { db } from '../firebase.config';
import { useUserContext } from '../context/user/useUserContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/buttons/Button';

export default function Requests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [user?.id]);

  const columns: TableColumn<LeaveRequest>[] = [
    {
      header: 'From',
      accessor: 'from',
      sortable: true,
      width: 'min-w-48',
    },
    {
      header: 'To',
      accessor: 'to',
      sortable: true,
      width: 'min-w-48',
    },
    {
      header: 'Request Type',
      accessor: 'requestType',
      sortable: true,
      width: 'min-w-32',
    },
    {
      header: 'Description',
      accessor: 'description',
      sortable: true,
      width: 'min-w-64',
    },
    {
      header: 'Created',
      accessor: 'created',
      sortable: true,
      render: (created: Timestamp) => created.toDate().toLocaleDateString(),
      width: 'min-w-48',
    },
    {
      header: 'Updated',
      accessor: 'updated',
      sortable: true,
      render: (updated: Timestamp) => updated.toDate().toLocaleDateString(),
      width: 'min-w-48',
    },
  ];

  if (loading) return <div className="p-8">Loading requests...</div>;

  return (
    <div className="p-4 md:p-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <Table
        data={requests}
        columns={columns}
        title="Your leave requests"
        onRowClick={(request) => navigate(`/requests/${request.id}`)}
      />
      <Button label="New request" onClick={() => navigate(`/requests/new`)} />
    </div>
  );
}
