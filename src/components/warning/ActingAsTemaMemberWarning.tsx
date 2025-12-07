import WarningBubble from './WarningBubble';

interface ActingAsTemaMemberWarningProps {
  name: string;
}

export default function ActingAsTemaMemberWarning({
  name,
}: ActingAsTemaMemberWarningProps) {
  return (
    <WarningBubble collapsedByDefault={true}>
      <span className="font-bold">You are acting on behalf of: </span>
      <span className="font-bold text-brand-purple-700">{name}</span>
      <br />
      This feature is intended for onboarding and administrative scenarios, such
      as entering historical or mid-year leave records. It also supports setups
      where a single administrator or accountant manages all leave data without
      employees needing to log in.
      <br />
      <span className="font-bold">Important</span>: Actions taken here will
      appear as if submitted directly by{' '}
      <span className="font-bold text-brand-purple-700">{name}</span>. Please
      ensure you are acting on the correct employee’s behalf.
    </WarningBubble>
  );
}
