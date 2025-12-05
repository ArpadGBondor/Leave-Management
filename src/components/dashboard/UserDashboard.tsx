import { useMemo } from 'react';
import { Leave } from '../../interface/Leave.interface';
import { RequestTypeEnum } from '../../interface/LeaveRequest.interface';
import User from '../../interface/User.interface';
import ProfileBadge from '../profile/ProfileBadge';
import UserDashboardInfo from './UserDashboardInfo';

interface UserDashboardProps {
  user: User;
  currentYear: string;
  totalLeaveEntitlement: number;
  requests: Leave[];
  approved: Leave[];
  className?: string;
}

export default function UserDashboard({
  user,
  currentYear,
  totalLeaveEntitlement,
  requests,
  approved,
  className,
}: UserDashboardProps) {
  const approvedDays = useMemo(
    () => approved.reduce((n, leave) => n + (leave.numberOfWorkdays || 0), 0),
    [approved]
  );

  const requestedDays = useMemo(
    () =>
      requests.reduce((n, leave) => {
        switch (leave.requestType) {
          case RequestTypeEnum.New:
            return n + (leave.numberOfWorkdays || 0);
          case RequestTypeEnum.Approved:
            return n;
          case RequestTypeEnum.Cancellation:
            const cancelledLeave = approved.find((a) => a.id === leave.id);
            if (cancelledLeave)
              return n - (cancelledLeave.numberOfWorkdays || 0);
            return n - (leave.numberOfWorkdays || 0);
          case RequestTypeEnum.Change:
            const changedLeave = approved.find((a) => a.id === leave.id);
            if (changedLeave)
              return (
                n +
                (leave.numberOfWorkdays || 0) -
                (changedLeave.numberOfWorkdays || 0)
              );
            return n + (leave.numberOfWorkdays || 0);
          default:
            return n + (leave.numberOfWorkdays || 0);
        }
      }, 0),
    [approved, requests]
  );
  return (
    <div
      className={`bg-brand-green-600 border border-brand-green-600 rounded-xl p-4 space-y-4 w-full max-w-2xl mx-auto overflow-hidden ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <ProfileBadge user={user} />
        </div>
        <div className="md:col-span-1 p-4 bg-brand-green-100 rounded-xl flex justify-center items-center text-brand-green-700 font-medium">
          Year: {currentYear}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <UserDashboardInfo
          label={'Total leave entitlement days'}
          value={totalLeaveEntitlement}
        />
        <UserDashboardInfo label={'Approved leave days'} value={approvedDays} />
        <UserDashboardInfo
          label={'Available leave days'}
          value={totalLeaveEntitlement - approvedDays}
        />
        <UserDashboardInfo
          label={'Pending requested days'}
          value={requestedDays}
        />
      </div>
    </div>
  );
}
