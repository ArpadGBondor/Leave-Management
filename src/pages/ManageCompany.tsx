import { useRef } from 'react';
import Button from '../components/buttons/Button';
import CompanyBankHolidayRegionDefault from '../components/forms/CompanyBankHolidayRegionDefault';
import CompanyHolidayDefaults from '../components/forms/CompanyHolidayDefaults';
import CompanyImportBankHolidays from '../components/forms/CompanyImportBankHolidays';
import CompanyWorkdayDefaults from '../components/forms/CompanyWorkdayDefaults';
import { toast } from 'react-toastify';
import { useLoadingContext } from '../context/loading/useLoadingContext';
import SubmitFormResponse from '../interface/SubmitFormResponse.interface';

type FormRef = {
  submit: () => Promise<SubmitFormResponse>;
};

export default function ManageCompany() {
  const workdayRef = useRef<FormRef | null>(null);
  const regionRef = useRef<FormRef | null>(null);
  const holidayRef = useRef<FormRef | null>(null);
  const { startLoading, stopLoading } = useLoadingContext();

  const handleSubmitAll = async () => {
    startLoading('submit-company-configs');
    try {
      const responses = await Promise.all([
        workdayRef.current?.submit(),
        regionRef.current?.submit(),
        holidayRef.current?.submit(),
      ]);
      const errors = responses.filter((res) => res?.error);
      if (errors.length > 0) {
        errors.forEach((res) => res && toast.error(res.message));
      } else {
        if (responses.some((res) => res?.submitted)) {
          toast.info('Updated default company configuration');
        } else {
          toast.info('No update needed');
        }
      }
    } finally {
      stopLoading('submit-company-configs');
    }
  };

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
        <CompanyWorkdayDefaults ref={workdayRef} />
        <CompanyBankHolidayRegionDefault ref={regionRef} />
        <CompanyHolidayDefaults ref={holidayRef} />
        <Button
          type="button"
          label="Update default company configuration"
          onClick={handleSubmitAll}
        />
      </div>
    </div>
  );
}
