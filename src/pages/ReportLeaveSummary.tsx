import { useEffect, useState } from 'react';
import PageWrapper from '../components/pageWrapper/PageWrapper';
import { useParams } from 'react-router-dom';
import Spinner from '../components/spinner/Spinner';
import User from '../interface/User.interface';
import { createLeaveObject, Leave } from '../interface/Leave.interface';
import { useFirebase } from '../hooks/useFirebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { firebase_collections } from '../../lib/firebase_collections';
import { useCompanyContext } from '../context/company/useCompanyContext';
import UserHolidayEntitlement from '../interface/UserHolidayEntitlement.interface';
import { maskEmail } from '../utils/maskEmail';
import { TableColumn } from '../components/table/types';
import Table from '../components/table/Table';
import { useLoadingContext } from '../context/loading/useLoadingContext';
import { toast } from 'react-toastify';
import { LeaveRequest } from '../interface/LeaveRequest.interface';

type SummaryData = {
  userName: string;
  userEmail: string;
  userType: string;
  userPhoto: string;
  entitlement: number;
  approved: number;
  requested: number;
  available: number;
  year: string;
};

export default function ReportLeaveSummary() {
  const { year } = useParams();
  const [leaveSummary, setLeaveSummary] = useState<SummaryData[]>([]);
  const { holidayEntitlement: companyHolidayEntitlement } = useCompanyContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const firebase = useFirebase();
  const db = firebase?.db;

  useEffect(() => {
    if (!db) return;
    if (!year) return;
    fetchUsers(year);
  }, [db, year]);

  const fetchUsers = async (year: string) => {
    startLoading('prepare-report');
    try {
      const currentYear = parseInt(year);
      const usersCol = collection(db, firebase_collections.USERS);
      const usersSnap = await getDocs(usersCol);

      for (const userDoc of usersSnap.docs) {
        const user = userDoc.data() as User;

        // if user is not employed this year, skip
        if (user.serviceStartDate) {
          const start = new Date(user.serviceStartDate);
          if (start.getUTCFullYear() > currentYear) continue;
        }
        if (user.serviceEndDate) {
          const end = new Date(user.serviceEndDate);
          if (end.getUTCFullYear() < currentYear) continue;
        }

        const holidayEntitlement = await fetchHolidayEntitlement(year, user);
        const approved = await fetchApprovedLeaves(year, user);
        const requested = await fetchRequests(year, user);

        const newData: SummaryData = {
          userName: user.name,
          userEmail: maskEmail(user.email),
          userType: user.userType,
          userPhoto: user.photo,
          entitlement: holidayEntitlement,
          approved: approved,
          requested: requested,
          available: holidayEntitlement - approved,
          year: year,
        };
        setLeaveSummary((prevState) => {
          return [...prevState, newData];
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create report');
    } finally {
      stopLoading('prepare-report');
    }
  };

  const fetchHolidayEntitlement = async (
    year: string,
    user: User
  ): Promise<number> => {
    const configurationRef = doc(
      db,
      `${firebase_collections.USERS}/${user.id}/${firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION}/${year}`
    );

    const configurationSnap = await getDoc(configurationRef);

    if (configurationSnap.exists()) {
      const configurationData =
        configurationSnap.data() as UserHolidayEntitlement;

      return configurationData.holidayEntitlementTotal;
    }

    return companyHolidayEntitlement.holidayEntitlementTotal;
  };

  const fetchApprovedLeaves = async (
    year: string,
    user: User
  ): Promise<number> => {
    let count = 0;

    const approvedLeavesQuery = query(
      collection(db, `${firebase_collections.APPROVED_LEAVES}`),
      where('requestedById', '==', user.id),
      where('year', '==', `${year}`)
    );

    const approvedLeavesSnap = await getDocs(approvedLeavesQuery);
    for (const approvedLeavesDoc of approvedLeavesSnap.docs) {
      const approvedLeaveRequest = approvedLeavesDoc.data() as LeaveRequest;
      const approvedLeave = createLeaveObject(approvedLeaveRequest);
      count += approvedLeave.numberOfWorkdays || 0;
    }

    return count;
  };

  const fetchRequests = async (year: string, user: User): Promise<number> => {
    let count = 0;

    const requestsQuery = query(
      collection(db, `${firebase_collections.REQUESTS}`),
      where('requestedById', '==', user.id),
      where('year', '==', `${year}`)
    );

    const requestsSnap = await getDocs(requestsQuery);
    for (const requestDoc of requestsSnap.docs) {
      const leaveRequest = requestDoc.data() as LeaveRequest;
      const leave = createLeaveObject(leaveRequest);
      count += leave.numberOfWorkdays || 0;
    }

    return count;
  };

  const columns: TableColumn<SummaryData>[] = [
    {
      header: 'User type',
      accessor: 'userType',
      sortable: true,
      render: (userType: string) => <strong>{userType}</strong>,
      width: 'w-28',
      searchable: 'userType',
    },
    // {
    //   header: 'Photo',
    //   accessor: 'userPhoto',
    //   render: (photo: string) => (
    //     <img
    //       src={photo}
    //       alt="Profile picture"
    //       className="w-12 h-12 rounded-full border-2 border-brand-green-700 block"
    //     />
    //   ),
    //   align: 'center',
    //   width: 'min-w-20 w-20',
    // },
    {
      header: 'Name',
      accessor: 'userName',
      sortable: true,
      render: (name: string) => <strong>{name}</strong>,
      searchable: 'userName',
    },
    // {
    //   header: 'Email',
    //   accessor: 'userEmail',
    //   sortable: true,
    //   width: 'min-w-32',
    // },
    {
      header: 'Entitlement',
      accessor: 'entitlement',
      render: (entitlement: number) => (
        <strong>{entitlement.toFixed(1)}</strong>
      ),
      sortable: true,
      width: 'min-w-24 text-right',
    },
    {
      header: 'Approved',
      accessor: 'approved',
      render: (approved: number) => <span>{approved.toFixed(1)}</span>,
      sortable: true,
      width: 'min-w-24 text-right',
    },
    {
      header: 'Available',
      accessor: 'available',
      render: (available: number) => <strong>{available.toFixed(1)}</strong>,
      sortable: true,
      width: 'min-w-24 text-right',
    },
    {
      header: 'Pending',
      accessor: 'requested',
      render: (requested: number) => <span>{requested.toFixed(1)}</span>,
      sortable: true,
      width: 'min-w-24 text-right',
    },
  ];

  return (
    <PageWrapper
      title={`Leave summary report: ${year}`}
      size={'max-w-6xl'}
      backPath="/reports"
    >
      <Table
        data={leaveSummary}
        columns={columns}
        pageSize={10}
        title="Please select a team member"
        defaultSort={{
          columnIndex: 0,
          direction: 'desc',
        }}
      />
    </PageWrapper>
  );
}
