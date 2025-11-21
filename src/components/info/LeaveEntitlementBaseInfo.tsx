import InfoBubble from './InfoBubble';

export default function LeaveEntitlementBaseInfo() {
  return (
    <InfoBubble>
      <span className="font-bold">Base leave entitlement</span>: This is the
      standard amount of annual holiday an employer provides before any
      adjustments are applied. Organisations or local regulations define this
      baseline. For example, a full-time employee in the UK might receive 28
      days per year as a typical starting allowance.
    </InfoBubble>
  );
}
