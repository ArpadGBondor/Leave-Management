import OAuth from '../components/auth/OAuth';
import UserRegister from '../components/forms/UserRegister';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function Register() {
  return (
    <PageWrapper title={'Register'} size={'max-w-2xl'}>
      <UserRegister />
      <OAuth />
    </PageWrapper>
  );
}
