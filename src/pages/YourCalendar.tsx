import { useUserContext } from '../context/user/useUserContext';
import UserCalendar from '../components/userCalendar/UserCalendar';

export default function Home() {
  const { user } = useUserContext();

  return (
    <div className="p-4 md:p-8 md:min-w-sm lg:min-w-md w-full h-full md:w-auto md:h-auto md:m-4 md:rounded-xl md:border-4 md:border-brand-green-500 bg-brand-purple-50 overflow-auto  max-w-full">
      <div className="flex flex-col justify-stretch items-stretch gap-4 w-full">
        <h1 className="text-4xl font-bold text-brand-purple-600">
          Your calendar
        </h1>
        {user && <UserCalendar user={user} />}
      </div>
    </div>
  );
}
