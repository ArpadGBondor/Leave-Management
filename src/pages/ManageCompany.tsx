import { useUserContext } from '../context/user/useUserContext';
import UpdateUser from '../components/forms/UpdateUser';
import UpdatePassword from '../components/forms/UpdatePassword';
import AddPassword from '../components/forms/AddPassword';
import CompanyHolidayDefaults from '../components/forms/CompanyHolidayDefaults';
import CompanyWorkdayDefaults from '../components/forms/CompanyWorkdayDefaults';

export default function ManageCompany() {
  return (
    <div className="p-4 m-4 md:m-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50  overflow-auto">
      <div className="flex flex-col justify-stretch items-stretch gap-8 p-4 md:p-8 w-full h-full overflow-auto">
        <h2 className="text-4xl font-bold text-brand-purple-700">
          Manage company
        </h2>

        <p className="text-brand-green-800">
          These are default fallback values, in case employees are not
          configured individually for a certain year.
        </p>
        <CompanyHolidayDefaults />
        <CompanyWorkdayDefaults />
      </div>
    </div>
  );
}
