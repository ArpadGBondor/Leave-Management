import OAuth from '../components/auth/OAuth';
import UserLogin from '../components/forms/UserLogin';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function Login() {
  return (
    <PageWrapper title={'Login'} size={'max-w-2xl'}>
      <UserLogin />
      <OAuth />
    </PageWrapper>
  );
}
