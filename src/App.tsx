import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import BackgroundDecor from './components/decoration/BackgroundDecor';
import Navigation from './components/navigation/Navigation';
import PrivateRoute from './components/auth/PrivateRoute';
import PrivateManagerRoute from './components/auth/PrivateManagerRoute';
import LoadingOverlay from './components/loading/LoadingOverlay';
import Spinner from './components/spinner/Spinner';

const Home = lazy(() => import('./pages/Home'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const Requests = lazy(() => import('./pages/Requests'));
const Login = lazy(() => import('./pages/Login'));
const About = lazy(() => import('./pages/About'));
const Logout = lazy(() => import('./pages/Logout'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Unauthorised = lazy(() => import('./pages/Unauthorised'));
const ManageCompany = lazy(() => import('./pages/ManageCompany'));
const ManageTeam = lazy(() => import('./pages/ManageTeam'));
const ManageTeamMember = lazy(() => import('./pages/ManageTeamMember'));
const ManageRequests = lazy(() => import('./pages/ManageRequests'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const RequestAddEdit = lazy(() => import('./pages/RequestAddEdit'));
const ManageRequestApproveReject = lazy(
  () => import('./pages/ManageRequestApproveReject')
);
const Calendars = lazy(() => import('./pages/Calendars'));
const CalendarOfUser = lazy(() => import('./pages/CalendarOfUser'));
const ApprovedLeaves = lazy(() => import('./pages/ApprovedLeaves'));
const ApprovedLeavesViev = lazy(() => import('./pages/ApprovedLeavesViev'));
const RejectedLeaves = lazy(() => import('./pages/RejectedLeaves'));
const RejectedLeavesViev = lazy(() => import('./pages/RejectedLeavesViev'));
const ManageRejectedLeaves = lazy(() => import('./pages/ManageRejectedLeaves'));
const ManageApprovedLeaves = lazy(() => import('./pages/ManageApprovedLeaves'));
const ManageApprovedLeavesView = lazy(
  () => import('./pages/ManageApprovedLeavesView')
);

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row justify-stretch items-stretch bg-brand-purple-50 bg-no-repeat bg-cover bg-bottom overflow-hidden relative">
      <LoadingOverlay />
      <div className="navigation grow-0 shrink-0">
        <Navigation />
      </div>
      <div className="w-full h-full overflow-hidden relative bg-[url('/images/background.jpg')] bg-cover bg-center h-screen">
        {/* 
          <BackgroundDecor /> 
          Replaced by single image, because this decoration was overwhelming to process for mobile devices.
          I still want to keep the code of the component, because this has sentimental value to me as the 
          initial and core component of the application.
        */}
        <main className="relative w-full h-full flex flex-col justify-center items-center">
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/getting-started" element={<GettingStarted />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/requests" element={<Requests />} />
                <Route
                  path="/requests/:requestId"
                  element={<RequestAddEdit />}
                />
                <Route path="/approved-leaves" element={<ApprovedLeaves />} />
                <Route
                  path="/approved-leaves/:requestId"
                  element={<ApprovedLeavesViev />}
                />
                <Route path="/rejected-leaves" element={<RejectedLeaves />} />
                <Route
                  path="/rejected-leaves/:requestId"
                  element={<RejectedLeavesViev />}
                />
              </Route>
              <Route
                element={<PrivateManagerRoute restrictToClaim="SUPER_ADMIN" />}
              >
                <Route path="/manage-company" element={<ManageCompany />} />
              </Route>
              <Route element={<PrivateManagerRoute restrictToClaim="ADMIN" />}>
                <Route path="/manage-team" element={<ManageTeam />} />
                <Route
                  path="/manage-team/:userId"
                  element={<ManageTeamMember />}
                />
                <Route path="/calendars" element={<Calendars />} />
                <Route path="/calendars/:userId" element={<CalendarOfUser />} />
                <Route path="/manage-requests" element={<ManageRequests />} />
                <Route
                  path="/manage-requests/:requestId"
                  element={<ManageRequestApproveReject />}
                />
                <Route
                  path="/manage-approved-leaves"
                  element={<ManageApprovedLeaves />}
                />
                <Route
                  path="/manage-approved-leaves/:requestId"
                  element={<ManageApprovedLeavesView />}
                />
                <Route
                  path="/manage-rejected-leaves"
                  element={<ManageRejectedLeaves />}
                />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/about" element={<About />} />
              <Route path="/unauthorised" element={<Unauthorised />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ToastContainer />
        </main>
      </div>
    </div>
  );
}
