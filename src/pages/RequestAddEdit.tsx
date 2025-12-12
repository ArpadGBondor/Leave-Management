import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';
import { useUserContext } from '../context/user/useUserContext';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function RequestAddEdit() {
  const { requestId } = useParams();
  const { user } = useUserContext();

  const isEditing = Boolean(requestId !== 'new');

  return (
    <PageWrapper
      title={isEditing ? 'Pending leave request details' : 'New leave request'}
      size={'max-w-4xl'}
      backPath="/requests"
    >
      {user && <RequestAddEditForm requestId={requestId} user={user} />}
    </PageWrapper>
  );
}
