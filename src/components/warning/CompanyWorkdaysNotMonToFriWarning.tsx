import WarningBubble from './WarningBubble';

export default function CompanyWorkdaysNotMonToFriWarning() {
  return (
    <WarningBubble>
      <span className="font-bold">
        Bank holiday deduction cannot be calculated automatically
      </span>
      : Because your selected workdays do not include all weekdays
      (Monday–Friday), the number of bank holidays that fall on your workdays
      varies each year. <br />
      <span className="font-bold">Recommendation</span>: Leave the “Default bank
      holiday region” unset and do not deduct bank holidays when calculating
      holiday entitlement. Employees should request bank holidays manually.
    </WarningBubble>
  );
}
