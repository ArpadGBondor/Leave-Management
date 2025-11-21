import InfoBubble from './InfoBubble';

export default function LeaveEntitlementDeductionInfo() {
  return (
    <InfoBubble>
      <span className="font-bold">Deducted leave entitlement</span>: If the
      employee’s contract does not include bank holidays in addition to their
      annual leave entitlement, the number of bank holidays that coincide with
      their working days should be deducted from their total entitlement.
    </InfoBubble>
  );
}
