import { useUserContext } from '../context/user/useUserContext';
import UpdateUser from '../components/forms/UpdateUser';
import UpdatePassword from '../components/forms/UpdatePassword';
import AddPassword from '../components/forms/AddPassword';
import DeleteUser from '../components/forms/DeleteUser';

export default function Profile() {
  const { hasPassword } = useUserContext();
  return (
    <div className="p-4 md:p-8 md:min-w-sm lg:min-w-2xl xl:min-w-4xl max-w-lg lg:max-w-6xl rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto space-y-4">
      <div className="flex flex-col lg:flex-row justify-stretch items-stretch gap-8 w-full">
        <UpdateUser />
        <div className="w-full flex flex-col justify-between items-stretch gap-8">
          {hasPassword ? <UpdatePassword /> : <AddPassword />}
          <DeleteUser />
        </div>
      </div>
    </div>
  );
}
