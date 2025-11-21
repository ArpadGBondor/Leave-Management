import { useRequestsContext } from '../context/requests/useRequestsContext';
import { useUserContext } from '../context/user/useUserContext';
import NavItem from '../interface/NavItem.interface';

const useNavItems = () => {
  const { user, userCount, loggedIn, loading: userLoading } = useUserContext();
  const { ownApprovedLeavesCount, ownRequestCount, managableRequestCount } =
    useRequestsContext();

  const topNavItems: NavItem[] = [];
  const bottomNavItems: NavItem[] = [];

  topNavItems.push({ name: 'Home', link: '/', icon: 'FaHome' });
  if (loggedIn && user?.claims?.SUPER_ADMIN) {
    topNavItems.push({
      name: 'Manage company',
      link: '/manage-company',
      icon: 'FaBriefcase',
    });
  }
  if (loggedIn && user?.claims?.ADMIN) {
    topNavItems.push({
      name: `Manage team (${userCount})`,
      link: '/manage-team',
      icon: 'FaUsers',
    });
  }
  if (loggedIn && user?.claims?.ADMIN) {
    topNavItems.push({
      name: `Calendars (${userCount})`,
      link: '/calendars',
      icon: 'FaCalendarAlt',
    });
  }
  if (loggedIn && user?.claims?.ADMIN) {
    topNavItems.push({
      name: `Manage requests  (${managableRequestCount})`,
      link: '/manage-requests',
      icon: 'FaClipboardCheck', // FaRegCalendarCheck
    });
  }
  if (loggedIn) {
    topNavItems.push({
      name: `Requests (${ownRequestCount})`,
      link: '/requests',
      icon: 'FaPaperPlane',
    });
    topNavItems.push({
      name: `Approved Leaves (${ownApprovedLeavesCount})`,
      link: '/approved-leaves',
      icon: 'FaCheckCircle',
    });
  }
  topNavItems.push({ name: 'About', link: '/about', icon: 'FaInfoCircle' });

  if (userLoading) {
    // skip
  } else if (loggedIn) {
    bottomNavItems.push({ name: 'Profile', link: '/profile', icon: 'FaUser' });
    bottomNavItems.push({
      name: 'Logout',
      link: '/logout',
      icon: 'FaSignOutAlt',
    });
  } else {
    bottomNavItems.push({ name: 'Login', link: '/login', icon: 'FaSignInAlt' });
    bottomNavItems.push({
      name: 'Register',
      link: '/register',
      icon: 'FaUserPlus',
    });
  }
  return { topNavItems, bottomNavItems };
};

export default useNavItems;
