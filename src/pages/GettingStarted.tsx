import InternalLink from '../components/link/InternalLink';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function GettingStarted() {
  return (
    <PageWrapper title={'Getting started'} size={'max-w-4xl'}>
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-brand-green-700">
          Welcome to my Leave Management demo app!
        </h2>

        <p className="text-brand-green-800">
          Before exploring the app, you’ll need to{' '}
          <InternalLink to="/register" label="register" /> or{' '}
          <InternalLink to="/login" label="log in" />.
        </p>
        <ul className="list-disc pl-6 text-brand-green-800 space-y-1">
          <li>Register with an email and password</li>
          <li>
            Or sign in instantly using{' '}
            <span className="font-semibold">Google SSO</span>
          </li>
        </ul>

        <p className="text-brand-green-800">
          Every user begins with the{' '}
          <span className="font-semibold">Employee</span> role, but you can
          switch roles at any time from your Profile page (for demo purposes).
          Each role adds more capabilities on top of the previous one.
        </p>

        <p className="text-brand-green-800">
          If you’re testing and want to remove your account, the app includes a
          full
          <span className="font-semibold"> Right to Be Forgotten</span>{' '}
          feature—allowing you to permanently delete all your data.
        </p>

        <p className="text-brand-green-800">
          Below are the three main sections you need to know to get started.
        </p>
      </header>

      <hr className="border-brand-green-600" />

      <section className="space-y-2">
        <h2 className="text-2xl font-bold text-brand-green-700">
          As an Employee
        </h2>
        <p className="text-brand-green-800">
          Employees have access to their personal workspace. This is where every
          user begins.
        </p>

        <p className="font-semibold text-brand-green-800">What you can do:</p>
        <ul className="list-disc pl-6 text-brand-green-800 space-y-2">
          <li>
            <span className="font-semibold">
              View and update your personal details
            </span>
            <div>
              Visit your <InternalLink to="/profile" label="Profile" /> page to
              keep your personal information up to date.
            </div>
          </li>
          <li>
            <span className="font-semibold">Submit leave requests</span>
            <div>
              Create a{' '}
              <InternalLink to="/requests/new" label="new leave request" />, or
              view <InternalLink to="/requests" label="your pending requests" />
              . Requests remain pending until an admin approves or rejects them.
            </div>
          </li>
          <li>
            <span className="font-semibold">
              View your approved leaves and request changes
            </span>
            <div>
              See{' '}
              <InternalLink
                to="/approved-leaves"
                label="your approved leaves"
              />
              , and submit change or cancellation requests when needed.
            </div>
          </li>
          <li>
            <span className="font-semibold">
              Review your rejected leaves requests
            </span>
            <div>
              Review{' '}
              <InternalLink
                to="/rejected-leaves"
                label="your rejected requests"
              />
              , and submit new requests based on adjusted plans.
            </div>
          </li>
          <li>
            <span className="font-semibold">View your calendar</span>
            <div>
              Go to <InternalLink to="/your-calendar" label="your calendar" />{' '}
              to view your days off, approved and pending leaves, workdays, and
              bank holidays. Your yearly holiday entitlement is also shown
              here—using the company’s default values until an admin updates
              your personal entitlement.
            </div>
          </li>
        </ul>

        <p className="font-semibold text-brand-green-800">Where to go next:</p>
        <ul className="list-disc pl-6 text-brand-green-800">
          <li>
            Visit your <InternalLink to="/profile" label="Profile" /> page to
            try switching to a different role (Manager or Owner) if you want to
            explore additional features.
          </li>
        </ul>
      </section>

      <hr className="border-brand-green-600" />

      <section className="space-y-2">
        <h2 className="text-2xl font-bold text-brand-green-700">
          As a Manager
        </h2>
        <p className="text-brand-green-800">
          Managers have all Employee permissions plus team-level management
          tools.
        </p>

        <p className="font-semibold text-brand-green-800">What you can do:</p>
        <ul className="list-disc pl-6 text-brand-green-800 space-y-2">
          <li>
            <span className="font-semibold">
              Approve or reject leave requests
            </span>
            <div>
              Review and manage team requests on the{' '}
              <InternalLink
                to="/manage-requests"
                label="team’s pending requests"
              />{' '}
              page, or view the team’s{' '}
              <InternalLink
                to="/manage-approved-leaves"
                label="approved leaves"
              />{' '}
              and{' '}
              <InternalLink
                to="/manage-rejected-leaves"
                label="rejected leave requests"
              />{' '}
              on their dedicated pages.
            </div>
          </li>
          <li>
            <span className="font-semibold">
              Manage employment details for team members
            </span>
            <div>
              Update team member information on the{' '}
              <InternalLink to="/manage-team" label="Manage Team" /> page:
            </div>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Employment start and end dates</li>
              <li>User type (role)</li>
              <li>Individual yearly leave entitlements</li>
              <li>Workdays and bank holidays</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold">Monitor team availability</span>
            <div>
              View individual team member calendars on the{' '}
              <InternalLink to="/calendars" label="Calendars" /> page to track
              leave patterns and staffing levels.
            </div>
          </li>
          <li>
            <span className="font-semibold">Generate reports</span>
            <div>
              Access the <InternalLink to="/reports" label="Reports" /> page to
              generate on-demand summaries of leave data across the
              organisation.
            </div>
          </li>
        </ul>
      </section>

      <hr className="border-brand-green-600" />

      <section className="space-y-2">
        <h2 className="text-2xl font-bold text-brand-green-700">As an Owner</h2>
        <p className="text-brand-green-800">
          Owners have full administrative control. This role includes all
          Manager and Employee capabilities.
        </p>

        <p className="font-semibold text-brand-green-800">What you can do:</p>
        <ul className="list-disc pl-6 text-brand-green-800 space-y-2">
          <li>
            <span className="font-semibold">
              Configure company-level defaults
            </span>
            <div>
              Set organisation-wide fallback values on the{' '}
              <InternalLink to="/manage-company" label="Manage Company" /> page:
            </div>
            <ul className="list-disc pl-6 mt-1">
              <li>Default annual leave entitlements</li>
              <li>Standard workdays</li>
              <li>Company-wide bank holidays</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold">
              Ensure consistency and simplify onboarding
            </span>
            <div>
              These defaults are applied automatically unless overridden for
              individual employees.
            </div>
          </li>
        </ul>
      </section>
    </PageWrapper>
  );
}
