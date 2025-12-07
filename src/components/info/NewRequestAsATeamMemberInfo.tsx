import InfoBubble from './InfoBubble';

export default function NewRequestAsATeamMemberInfo() {
  return (
    <InfoBubble>
      Managers can create and edit leave requests on behalf of team members.
      This helps with onboarding by allowing historical or mid-year leave
      entries, and also supports organizations where a single administrator or
      accountant manages all employee leave without requiring individual logins.
    </InfoBubble>
  );
}
