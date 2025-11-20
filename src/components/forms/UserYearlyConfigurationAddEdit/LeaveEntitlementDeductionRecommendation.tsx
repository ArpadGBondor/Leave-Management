import BankHolidayRegion from '../../../interface/BankHolidayRegion.interface';
import InfoBubble from '../../info/InfoBubble';

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
      <InfoBubble>
        If the employee’s contract does not include bank holidays in addition to
        their annual leave entitlement, the number of bank holidays that
        coincide with their working days should be deducted from their total
        entitlement.
      </InfoBubble>
      <p className=" text-brand-green-800">
        Number of bank holiday days when team member is scheduled to work in{' '}
        {year}:{' '}
        <span className="font-bold">{formData.numberOfBankHolidays}</span>
      </p>
    </div>
  );
}
