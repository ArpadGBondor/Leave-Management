import { useEffect, useState } from 'react';
import Button from '../components/buttons/Button';
import PageWrapper from '../components/pageWrapper/PageWrapper';
import { useNavigate } from 'react-router-dom';
import SelectInput from '../components/inputs/SelectInput';
import { useCompanyContext } from '../context/company/useCompanyContext';

export default function Reports() {
  const [leaveSummaryYear, setLeaveSummaryYear] = useState<string>('');
  const navigate = useNavigate();
  const { importedYears } = useCompanyContext();

  useEffect(() => {
    if (!importedYears?.length) return;
    const currentYear = new Date().getFullYear();
    const closestYear = importedYears
      .map((y) => Number(y))
      .reduce((prev, curr) =>
        Math.abs(curr - currentYear) < Math.abs(prev - currentYear)
          ? curr
          : prev
      );

    setLeaveSummaryYear(String(closestYear));
  }, [importedYears]);

  return (
    <PageWrapper title={'Reports'} size={'max-w-4xl'} backPath="/">
      <div className="p-4 rounded-xl border border-brand-green-600 bg-brand-purple-100 space-y-4">
        <SelectInput
          id="leaveSummaryYear"
          label="Leave Summary Year"
          name="leaveSummaryYear"
          value={leaveSummaryYear}
          options={importedYears}
          placeholder="Please select a year"
          onChange={(e) => setLeaveSummaryYear(e.target.value)}
        />

        <Button
          label={'Leave Summary Report'}
          disabled={!Boolean(leaveSummaryYear)}
          onClick={() => navigate(`/reports/leave-summary/${leaveSummaryYear}`)}
        />
      </div>
    </PageWrapper>
  );
}
