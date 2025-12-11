import NewRequestAsATeamMemberInfo from '../components/info/NewRequestAsATeamMemberInfo';
import PageWrapper from '../components/pageWrapper/PageWrapper';
import UserPicker from '../components/userPicker/UserPicker';
import { useNavigate } from 'react-router-dom';

export default function ManageNewRequest() {
  const navigate = useNavigate();
  return (
    <PageWrapper title={'New request as a team member'} size={'max-w-4xl'}>
      <NewRequestAsATeamMemberInfo />
      <UserPicker
        onClick={(user) => navigate(`/manage-new-request/${user.id}/new`)}
      />
    </PageWrapper>
  );
}
