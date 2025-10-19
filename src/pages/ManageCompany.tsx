import CompanyBankHolidayRegionDefault from '../components/forms/CompanyBankHolidayRegionDefault';
import CompanyHolidayDefaults from '../components/forms/CompanyHolidayDefaults';
import CompanyImportBankHolidays from '../components/forms/CompanyImportBankHolidays';
import CompanyWorkdayDefaults from '../components/forms/CompanyWorkdayDefaults';

export default function ManageCompany() {
  return (
    <div className="p-4 md:p-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <div className="flex flex-col justify-stretch items-stretch gap-4 w-full">
        <h2 className="text-4xl font-bold text-brand-purple-700">
          Manage company
        </h2>

        <p className="text-brand-green-800">
          These are default fallback values, in case employees are not
          configured individually for a certain year.
        </p>
        <CompanyImportBankHolidays />
        <CompanyWorkdayDefaults />
        <CompanyBankHolidayRegionDefault />
        <CompanyHolidayDefaults />
      </div>
    </div>
  );
}
