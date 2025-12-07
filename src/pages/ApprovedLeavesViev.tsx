import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';
import { firebase_collections } from '../../lib/firebase_collections';
import { useUserContext } from '../context/user/useUserContext';

export default function ApprovedLeavesViev() {
  const { requestId } = useParams();
  const { user } = useUserContext();

  return (
    <div className="p-4 md:p-8 md:min-w-xl w-full h-full md:w-auto md:h-auto md:m-4 md:rounded-xl md:border-4 md:border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <h2 className="text-4xl font-bold text-brand-purple-700">
        Approved leave details
      </h2>
      {user && (
        <RequestAddEditForm
          requestId={requestId}
          requestCollection={firebase_collections.APPROVED_LEAVES}
          user={user}
        />
      )}
    </div>
  );
}
