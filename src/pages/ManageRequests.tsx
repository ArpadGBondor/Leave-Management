import { useEffect, useState } from 'react';
import { LeaveRequest } from '../interface/LeaveRequest.interface';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';

export default function ManageRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const requestsRef = collection(db, firebase_collections.REQUESTS);

    const unsubscribe = onSnapshot(
      requestsRef,
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
  }, []);
  const columns: TableColumn<LeaveRequest>[] = [
    {
      header: 'Requested By',
      accessor: 'requestedByName',
      sortable: true,
      align: 'center',
      width: 'min-w-48',
    },
    {
      header: 'From',
      accessor: 'from',
      sortable: true,
      render: (from: Timestamp) => from.toDate().toLocaleDateString(),
      width: 'min-w-48',
    },
    {
      header: 'To',
      accessor: 'to',
      sortable: true,
      render: (to: Timestamp) => to.toDate().toLocaleDateString(),
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
        title="Manage leave requests"
        onRowClick={(request) => navigate(`/manage-requests/${request.id}`)}
      />
    </div>
  );
}
