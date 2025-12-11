import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';
import { firebase_collections } from '../../lib/firebase_collections';
import { useUserContext } from '../context/user/useUserContext';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function ApprovedLeavesViev() {
  const { requestId } = useParams();
  const { user } = useUserContext();

  return (
    <PageWrapper title={'Approved leave details'} size={'max-w-2xl'}>
      {user && (
        <RequestAddEditForm
          requestId={requestId}
          requestCollection={firebase_collections.APPROVED_LEAVES}
          user={user}
        />
      )}
    </PageWrapper>
  );
}
