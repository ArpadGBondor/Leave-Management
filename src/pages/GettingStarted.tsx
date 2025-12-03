import { useUserContext } from '../context/user/useUserContext';
import UserCalendar from '../components/userCalendar/UserCalendar';

export default function GettingStarted() {
  return (
    <div className="p-4 md:p-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto  max-w-xl">
      <div className="flex flex-col justify-stretch items-stretch gap-2 w-full">
        <h1 className="text-4xl font-bold text-brand-purple-600">
          Getting started
        </h1>
        <h2 className="text-2xl font-bold text-brand-green-700">
          Welcome to my demo app!
        </h2>
        <p className="text-brand-green-800">
          Every user begins with the Employee role, but you can switch roles at
          any time from your Profile page (for demo purposes). Each role adds
          more capabilities on top of the previous one.
        </p>
        <p className="text-brand-green-800">
          Below are the three main sections you need to know to get started.
        </p>
        <h2 className="text-2xl font-bold text-brand-green-700">
          As an Employee
        </h2>
        <p className="text-brand-green-800">
          Employees have access to their personal workspace. This is where every
          user begins.
        </p>
        <p className="text-brand-green-800">
          What you can do:
          <ul className="list-disc pl-6">
            <li>
              <p className="font-semibold">
                View and update your personal details
              </p>
              <p>Keep your profile information up to date.</p>
            </li>
            <li>
              <p className="font-semibold">Submit leave requests</p>
              <p>
                Create new requests, track their status, and view
                approvals/declines.
              </p>
            </li>
            <li>
              <p className="font-semibold">View your calendar</p>
              <p>
                See your upcoming leave, approved days off, and any relevant
                workplace dates.
              </p>
            </li>
          </ul>
        </p>
        <p className="text-brand-green-800">
          Where to go next:
          <ul className="list-disc pl-6">
            <li>
              <p>
                Visit your Profile page to try switching to a different role
                (Manager or Owner) if you want to explore additional features.
              </p>
            </li>
          </ul>
        </p>
        <h2 className="text-2xl font-bold text-brand-green-700">
          As a Manager
        </h2>
        <p className="text-brand-green-800">
          Managers have all Employee permissions plus team-level management
          tools.
        </p>
        <p className="text-brand-green-800">
          What you can do:
          <ul className="list-disc pl-6">
            <li>
              <p className="font-semibold">Approve or reject leave requests</p>
              <p>
                Review requests from employees and manage the team’s schedule.
              </p>
            </li>
            <li>
              <p className="font-semibold">
                Manage employment details for team members
              </p>
              <ul className="list-disc pl-6">
                <li>Start and end dates</li>
                <li>User type (role)</li>
                <li>Individual yearly leave entitlements</li>
                <li>Workdays and bank holidays</li>
              </ul>
            </li>
            <li>
              <p className="font-semibold">Monitor team availability</p>
              <p>
                Use calendars and request overviews to keep track of leave
                patterns and staffing levels.
              </p>
            </li>
          </ul>
        </p>
        <h2 className="text-2xl font-bold text-brand-green-700">As an Owner</h2>
        <p className="text-brand-green-800">
          Owners have full administrative control. This role includes all
          Manager and Employee capabilities.
        </p>
        <p className="text-brand-green-800">
          What you can do:
          <ul className="list-disc pl-6">
            <li>
              <p className="font-semibold">Configure company-level defaults</p>
              <p>Set fallback values that apply across the organisation:</p>
              <ul className="list-disc pl-6">
                <li>Default annual leave entitlements</li>
                <li>Standard workdays</li>
                <li>Company-wide bank holidays</li>
              </ul>
            </li>
            <li>
              <p className="font-semibold">
                Ensure consistency and simplify onboarding
              </p>
              <p>
                These defaults are applied automatically unless overridden for
                individual employees.
              </p>
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
}
