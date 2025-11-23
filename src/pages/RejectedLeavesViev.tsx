import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';
import { firebase_collections } from '../../lib/firebase_collections';
import { useState } from 'react';
import { LeaveRequest } from '../interface/LeaveRequest.interface';
import RejectedLeaveActions from '../components/forms/RejectedLeaveActions';

export default function RejectedLeavesViev() {
  const { requestId } = useParams();
  const [request, setRequest] = useState<LeaveRequest | null>(null);

  return (
    <div className="p-4 md:p-8 md:min-w-xl rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <RequestAddEditForm
        requestId={requestId}
        requestCollection={firebase_collections.REJECTED_LEAVES}
        disabled
        setRequest={setRequest}
      />
      {request && <RejectedLeaveActions request={request} />}
    </div>
  );
}
