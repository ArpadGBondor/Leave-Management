import PageWrapper from '../components/pageWrapper/PageWrapper';
import UserPicker from '../components/userPicker/UserPicker';
import { useNavigate } from 'react-router-dom';

export default function ManageTeam() {
  const navigate = useNavigate();
  return (
    <PageWrapper title={'Manage team'} size={'max-w-4xl'}>
      <UserPicker onClick={(user) => navigate(`/manage-team/${user.id}`)} />
    </PageWrapper>
  );
}
