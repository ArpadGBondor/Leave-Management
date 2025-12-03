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
              <div>Keep your profile information up to date.</div>
            </li>
            <li>
              <span className="font-semibold">Submit leave requests</span>
              <div>
                Create new requests, track their status, and view
                approvals/declines.
              </div>
            </li>
            <li>
              <span className="font-semibold">View your calendar</span>
              <div>
                See your upcoming leave, approved days off, and any relevant
                workplace dates.
              </div>
            </li>
          </ul>

          <p className="font-semibold text-brand-green-800">
            Where to go next:
          </p>
          <ul className="list-disc pl-6 text-brand-green-800">
            <li>
              Visit your Profile page to try switching to a different role
              (Manager or Owner) if you want to explore additional features.
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
                Review requests from employees and manage the team’s schedule.
              </div>
            </li>
            <li>
              <span className="font-semibold">
                Manage employment details for team members
              </span>
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
                Use calendars and request overviews to keep track of leave
                patterns and staffing levels.
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
              <p className="text-brand-green-800">
                Set fallback values that apply across the organisation:
              </p>
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
