import { Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import BackgroundDecor from './components/decoration/BackgroundDecor';
import Navigation from './components/navigation/Navigation';
import PrivateRoute from './components/auth/PrivateRoute';

import Home from './pages/Home';
import Requests from './pages/Requests';
import Login from './pages/Login';
import About from './pages/About';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LoadingOverlay from './components/loading/LoadingOverlay';
import Unauthorised from './pages/Unauthorised';
import PrivateManagerRoute from './components/auth/PrivateManagerRoute';
import ManageTeam from './pages/ManageTeam';
import NotFound from './pages/NotFound';
import ManageCompany from './pages/ManageCompany';
import ManageTeamMember from './pages/ManageTeamMember';
import ManageRequests from './pages/ManageRequests';
import ForgotPassword from './pages/ForgotPassword';
import RequestAddEdit from './pages/RequestAddEdit';

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
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/requests/:requestId" element={<RequestAddEdit />} />
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
              <Route path="/manage-requests" element={<ManageRequests />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/about" element={<About />} />
            <Route path="/unauthorised" element={<Unauthorised />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </main>
      </div>
    </div>
  );
}
