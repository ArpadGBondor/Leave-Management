import { useUserContext } from '../context/user/useUserContext';
import UserCalendar from '../components/userCalendar/UserCalendar';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function Home() {
  const { user } = useUserContext();

  return (
    <PageWrapper title={'Your calendar'} size={'max-w-4xl'}>
      {user && <UserCalendar user={user} />}
    </PageWrapper>
  );
}
