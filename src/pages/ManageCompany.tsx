import { useRef } from 'react';
import Button from '../components/buttons/Button';
import CompanyBankHolidayRegionDefault from '../components/forms/CompanyBankHolidayRegionDefault';
import CompanyHolidayDefaults from '../components/forms/CompanyHolidayDefaults';
import CompanyImportBankHolidays from '../components/forms/CompanyImportBankHolidays';
import CompanyWorkdayDefaults from '../components/forms/CompanyWorkdayDefaults';
import { toast } from 'react-toastify';
import { useLoadingContext } from '../context/loading/useLoadingContext';
import SubmitFormResponse from '../interface/SubmitFormResponse.interface';
import PageWrapper from '../components/pageWrapper/PageWrapper';

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
    <PageWrapper title={'Manage company'} size={'max-w-6xl'} backPath="/">
      <p className="text-brand-green-800">
        These values act as defaults when an employee does not have a specific
        configuration for a given year.
      </p>
      <CompanyImportBankHolidays />
      <CompanyBankHolidayRegionDefault ref={regionRef} />
      <CompanyWorkdayDefaults ref={workdayRef} />
      <CompanyHolidayDefaults ref={holidayRef} />
      <Button
        type="button"
        label="Update default company configuration"
        onClick={handleSubmitAll}
      />
    </PageWrapper>
  );
}
