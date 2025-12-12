import PageWrapper from '../components/pageWrapper/PageWrapper';
import UserPicker from '../components/userPicker/UserPicker';
import { useNavigate } from 'react-router-dom';

export default function Calendars() {
  const navigate = useNavigate();
  return (
    <PageWrapper
      title={'Team member calendars'}
      size={'max-w-4xl'}
      backPath="/"
    >
      <UserPicker onClick={(user) => navigate(`/calendars/${user.id}`)} />
    </PageWrapper>
  );
}
