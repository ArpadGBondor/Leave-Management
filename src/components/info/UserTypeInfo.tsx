import InfoBubble from './InfoBubble';

export default function UserTypeInfo() {
  return (
    <InfoBubble>
      <p className="font-semibold">User Roles and Permissions:</p>
      <ul className="list-disc pl-6">
        <li>
          <span className="font-bold">Employee:</span> Manages personal details
          and submits leave requests.
        </li>
        <li>
          <span className="font-bold">Manager:</span> (Includes all Employee
          permissions)
          <ul className="list-disc pl-6 mt-1">
            <li>Approves/rejects leave requests.</li>
            <li>
              Manages other users' **Employment Details** (start/end dates, user
              types, and individual leave entitlements).
            </li>
          </ul>
        </li>
        <li>
          <span className="font-bold">Owner:</span> (Includes all Manager
          permissions)
          <ul className="list-disc pl-6 mt-1">
            <li>
              Configures **Company Default Fallback Values** (entitlements,
              workdays, and bank holidays).
            </li>
          </ul>
        </li>
      </ul>
    </InfoBubble>
  );
}
