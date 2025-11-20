import InfoBubble from '../../info/InfoBubble';

export default function LeaveEntitlementBaseRecommendation() {
  return (
    <div>
      <h4 className="text-xl font-medium text-brand-green-700">
        Base leave entitlement recommendation
      </h4>
      <InfoBubble>
        Base leave entitlement is the standard amount of annual holiday an
        employer provides before any adjustments are made. This value is set by
        the organisation or by local employment regulations. For example, in the
        UK a common baseline is 28 days per year for full-time employees.
      </InfoBubble>
    </div>
  );
}
