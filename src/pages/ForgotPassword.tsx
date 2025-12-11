import PasswordReset from '../components/forms/PasswordReset';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function ForgotPassword() {
  return (
    <PageWrapper title={'Forgot Password'} size={'max-w-2xl'}>
      <PasswordReset />
    </PageWrapper>
  );
}
