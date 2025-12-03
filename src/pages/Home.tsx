import { useUserContext } from '../context/user/useUserContext';
import UserCalendar from '../components/userCalendar/UserCalendar';

export default function Home() {
  const { user } = useUserContext();

  return (
    <div className="p-4 md:p-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto  max-w-full">
      <div className="flex flex-col justify-stretch items-stretch gap-4 w-full">
        <h1 className="text-4xl font-bold text-brand-purple-600">
          Your calendar
        </h1>
        {user && <UserCalendar user={user} />}
      </div>
    </div>
  );
}
