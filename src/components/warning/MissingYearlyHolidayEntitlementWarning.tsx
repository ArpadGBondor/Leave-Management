import WarningBubble from './WarningBubble';

export default function MissingYearlyHolidayEntitlementWarning() {
  return (
    <WarningBubble collapsedByDefault={true}>
      <span className="font-bold">Yearly leave entitlement not configured</span>
      <br />
      The system is showing a fallback entitlement, which may not match the team
      member’s actual holiday entitlement. You may need to contact a manager to
      have the correct entitlement configured.
    </WarningBubble>
  );
}
