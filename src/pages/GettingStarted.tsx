import NavButton from '../components/buttons/NavButton';

export default function GettingStarted() {
  return (
    <div className="p-4 md:p-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-xl">
      <div className="w-full space-y-4">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-brand-purple-600">
            Getting started
          </h1>
          <h2 className="text-2xl font-bold text-brand-green-700">
            Welcome to my demo app!
          </h2>
          <p className="text-brand-green-800">
            Every user begins with the Employee role, but you can switch roles
            at any time from your Profile page (for demo purposes). Each role
            adds more capabilities on top of the previous one.
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
            Employees have access to their personal workspace. This is where
            every user begins.
          </p>

          <p className="font-semibold text-brand-green-800">What you can do:</p>
          <ul className="list-disc pl-6 text-brand-green-800 space-y-2">
            <li>
              <span className="font-semibold">
                View and update your personal details
              </span>
              <div>
                Visit your{' '}
                <a
                  href="/profile"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  Profile
                </a>{' '}
                page to keep your personal information up to date.
              </div>
            </li>
            <li>
              <span className="font-semibold">Submit leave requests</span>
              <div>
                Create a{' '}
                <a
                  href="/requests/new"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  new leave request
                </a>
                , or view{' '}
                <a
                  href="/requests"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  your pending requests
                </a>
                . Requests remain pending until an admin approves or rejects
                them.
              </div>
            </li>
            <li>
              <span className="font-semibold">
                View your approved leaves and request changes
              </span>
              <div>
                See{' '}
                <a
                  href="/approved-leaves"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  your approved leaves
                </a>
                , and submit change or cancellation requests when needed.
              </div>
            </li>
            <li>
              <span className="font-semibold">
                Review your rejected leaves requests
              </span>
              <div>
                Review{' '}
                <a
                  href="/rejected-leaves"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  your rejected requests
                </a>
                , and submit new requests based on adjusted plans.
              </div>
            </li>
            <li>
              <span className="font-semibold">View your calendar</span>
              <div>
                Access your personal calendar on the{' '}
                <a
                  href="/"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  Home
                </a>{' '}
                page. It shows your days off, approved and pending leaves, bank
                holidays, and workdays. You can also view your yearly holiday
                entitlement on your Home screen. This will display the company’s
                default values until an admin configures your individual
                entitlement.
              </div>
            </li>
          </ul>

          <p className="font-semibold text-brand-green-800">
            Where to go next:
          </p>
          <ul className="list-disc pl-6 text-brand-green-800">
            <li>
              Visit your{' '}
              <a
                href="/profile"
                className="underline text-brand-purple-600 hover:text-brand-purple-700"
              >
                Profile
              </a>{' '}
              page to try switching to a different role (Manager or Owner) if
              you want to explore additional features.
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
                <a
                  href="/manage-requests"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  team’s pending requests
                </a>{' '}
                page, or view the team’s{' '}
                <a
                  href="/manage-approved-leaves"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  approved leaves
                </a>{' '}
                and{' '}
                <a
                  href="/manage-rejected-leaves"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  rejected leave requests
                </a>{' '}
                on their dedicated pages.
              </div>
            </li>
            <li>
              <span className="font-semibold">
                Manage employment details for team members
              </span>
              <div>
                Update team member information on the{' '}
                <a
                  href="/manage-team"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  Manage Team
                </a>{' '}
                page:
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
                <a
                  href="/calendars"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  Calendars
                </a>{' '}
                page to track leave patterns and staffing levels.
              </div>
            </li>
          </ul>
        </section>

        <hr className="border-brand-green-600" />

        <section className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-green-700">
            As an Owner
          </h2>
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
                <a
                  href="/manage-company"
                  className="underline text-brand-purple-600 hover:text-brand-purple-700"
                >
                  Manage Company
                </a>{' '}
                page:
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
      </div>
    </div>
  );
}
