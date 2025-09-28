import { useUserContext } from '../context/user/useUserContext';
import UpdateUser from '../components/forms/UpdateUser';
import UpdatePassword from '../components/forms/UpdatePassword';
import AddPassword from '../components/forms/AddPassword';

export default function Profile() {
  const { hasPassword } = useUserContext();
  return (
    <div className="p-4 md:p-8 m-4 md:m-8 md:min-w-sm lg:min-w-md max-w-lg rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto">
      <h1 className="text-4xl font-bold text-brand-purple-700 mb-4">
        Update profile details
      </h1>

      <UpdateUser />
      {hasPassword ? <UpdatePassword /> : <AddPassword />}
    </div>
  );
}
