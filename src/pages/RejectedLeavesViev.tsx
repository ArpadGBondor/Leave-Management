import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';
import { firebase_collections } from '../../lib/firebase_collections';
import { useUserContext } from '../context/user/useUserContext';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function RejectedLeavesViev() {
  const { requestId } = useParams();
  const { user } = useUserContext();

  return (
    <PageWrapper
      title={'Rejected leave request details'}
      size={'max-w-4xl'}
      backPath="/rejected-leaves"
    >
      {user && (
        <RequestAddEditForm
          requestId={requestId}
          requestCollection={firebase_collections.REJECTED_LEAVES}
          user={user}
        />
      )}
    </PageWrapper>
  );
}
