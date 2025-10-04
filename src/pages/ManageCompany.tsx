import { useUserContext } from '../context/user/useUserContext';
import UpdateUser from '../components/forms/UpdateUser';
import UpdatePassword from '../components/forms/UpdatePassword';
import AddPassword from '../components/forms/AddPassword';
import CompanyHolidayDefaults from '../components/forms/CompanyHolidayDefaults';

export default function ManageCompany() {
  return (
    <div className="p-4 m-4 md:m-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50  overflow-auto">
      <div className="flex flex-col justify-stretch items-stretch gap-8 p-4 md:p-8 w-full h-full overflow-auto">
        <CompanyHolidayDefaults />
      </div>
    </div>
  );
}
