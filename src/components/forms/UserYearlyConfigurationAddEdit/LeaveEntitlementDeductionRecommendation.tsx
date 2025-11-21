import BankHolidayRegion from '../../../interface/BankHolidayRegion.interface';
import LeaveEntitlementDeductionInfo from '../../info/LeaveEntitlementDeductionInfo';

interface LeaveEntitlementDeductionRecommendationProps<T> {
  formData: T;
  year: string;
}

export default function LeaveEntitlementDeductionRecommendation<
  T extends BankHolidayRegion
>({ formData, year }: LeaveEntitlementDeductionRecommendationProps<T>) {
  return (
    <div>
      <h4 className="text-xl font-medium text-brand-green-700">
        Leave entitlement deduction recommendation
      </h4>
      <LeaveEntitlementDeductionInfo />
      <p className=" text-brand-green-800">
        Number of bank holiday days when team member is scheduled to work in{' '}
        {year}:{' '}
        <span className="font-bold">{formData.numberOfBankHolidays}</span>
      </p>
    </div>
  );
}
