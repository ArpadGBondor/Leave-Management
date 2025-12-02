import InfoBubble from './InfoBubble';

export default function EmailMaskingInfo() {
  return (
    <InfoBubble>
      For the privacy of registered testers, email addresses are redacted. For
      example, an address like test.user@company.net appears as
      t**r@company.net."
    </InfoBubble>
  );
}
