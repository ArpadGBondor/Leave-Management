import WarningBubble from './WarningBubble';

export default function MissingEmploymentStartDateWarning() {
  return (
    <WarningBubble collapsedByDefault>
      <span className="font-bold">Employment start date is not set</span>
      <br />
      Add the employment start and end dates on the team member’s profile page.
      This should be completed before a manager configures their yearly holiday
      entitlement.
    </WarningBubble>
  );
}
