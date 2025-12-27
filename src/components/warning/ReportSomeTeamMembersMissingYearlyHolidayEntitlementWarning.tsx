import WarningBubble from './WarningBubble';

export default function ReportSomeTeamMembersMissingYearlyHolidayEntitlementWarning() {
  return (
    <WarningBubble collapsedByDefault={true}>
      <span className="font-bold">
        Some highlighted team members do not have a yearly leave entitlement
        configured.
      </span>
      <br />A fallback value is being used, which may not reflect their actual
      entitlement. Please contact an administrator or manager to configure the
      correct entitlement.
    </WarningBubble>
  );
}
