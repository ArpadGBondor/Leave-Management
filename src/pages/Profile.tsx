import { useUserContext } from '../context/user/useUserContext';
import PasswordAdd from '../components/forms/PasswordAdd';
import PasswordUpdate from '../components/forms/PasswordUpdate';
import UserUpdate from '../components/forms/UserUpdate';
import UserDelete from '../components/forms/UserDelete';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function Profile() {
  const { hasPassword } = useUserContext();
  return (
    <PageWrapper title="Profile" size="max-w-6xl" backPath="/">
      <div className="flex flex-col xl:flex-row justify-stretch items-stretch gap-8 md:max-w-lg xl:max-w-6xl w-full">
        <UserUpdate />
        <div className="w-full flex flex-col justify-between items-stretch gap-8">
          {hasPassword ? <PasswordUpdate /> : <PasswordAdd />}
          <UserDelete />
        </div>
      </div>
    </PageWrapper>
  );
}
