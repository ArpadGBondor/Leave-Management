import { Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BackgroundDecor from './components/decoration/BackgroundDecor';
import Navigation from './components/navigation/Navigation';
import PrivateRoute from './components/auth/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LoadingOverlay from './components/loading/LoadingOverlay';

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row justify-stretch items-stretch bg-brand-purple-50 bg-no-repeat bg-cover bg-bottom overflow-hidden relative">
      <LoadingOverlay />
      <div className="navigation grow-0 shrink-0">
        <Navigation />
      </div>
      <div className="w-full h-full overflow-hidden relative">
        <BackgroundDecor />
        <main className="relative w-full h-full flex flex-col justify-center items-center">
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <ToastContainer />
        </main>
      </div>
    </div>
  );
}
