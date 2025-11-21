import InfoBubble from './InfoBubble';

export default function LeaveEntitlementMultiplierInfo() {
  return (
    <InfoBubble>
      <span className="font-bold">Leave entitlement multiplier</span>: This
      value adjusts a team member’s annual holiday allowance by taking into
      account both their weekly working pattern and how much of the year they
      are employed. Someone working five days a week for the full year receives
      a multiplier of 1.0, while part-time staff or mid-year starters receive a
      proportionally lower value so their entitlement accurately reflects their
      actual working time.
    </InfoBubble>
  );
}
