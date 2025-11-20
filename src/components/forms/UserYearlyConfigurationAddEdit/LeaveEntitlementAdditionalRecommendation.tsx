import InfoBubble from '../../info/InfoBubble';

export default function LeaveEntitlementAdditionalRecommendation() {
  return (
    <div>
      <h4 className="text-xl font-medium text-brand-green-700">
        Additional leave entitlement recommendation
      </h4>
      <InfoBubble>
        Additional leave entitlement covers any extra holiday granted beyond the
        organisation’s base allowance. This may include contractual benefits,
        long-service awards, or company-specific policies. If the employee is
        entitled to these additional days, they are added to the base
        entitlement before applying the leave entitlement multiplier.
      </InfoBubble>
    </div>
  );
}
