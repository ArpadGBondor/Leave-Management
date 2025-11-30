import InfoBubble from './InfoBubble';

export default function PasswordComplexityInfo() {
  return (
    <InfoBubble>
      <p>Your password must meet the following criteria:</p>
      <ul className="list-disc pl-6 ">
        <li>Be at least 8 characters long.</li>
        <li>Include at least one lowercase letter.</li>
        <li>Include at least one uppercase letter.</li>
        <li>Include at least one number.</li>
        <li>Include at least one special character.</li>
      </ul>
    </InfoBubble>
  );
}
