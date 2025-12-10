import { useRequestsContext } from '../context/requests/useRequestsContext';
import { useUserContext } from '../context/user/useUserContext';
import NavItem from '../interface/NavItem.interface';

const useNavItems = () => {
  const { user, userCount, loggedIn, loading: userLoading } = useUserContext();
  const {
    ownRejectedLeavesCount,
    ownApprovedLeavesCount,
    ownRequestCount,
    managableRequestCount,
    managableRejectedLeavesCount,
    managableApprovedLeavesCount,
  } = useRequestsContext();

  const topNavItems: NavItem[] = [];
  const bottomNavItems: NavItem[] = [];

  topNavItems.push({
    name: 'Getting started',
    link: '/',
    icon: 'FaRocket',
  });
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
      name: `Team member calendars (${userCount})`,
      link: '/calendars',
      icon: 'FaCalendarAlt',
    });
  }
  if (loggedIn && user?.claims?.ADMIN) {
    topNavItems.push({
      name: `Team's pending requests  (${managableRequestCount})`,
      link: '/manage-requests',
      icon: 'FaClipboardQuestion',
    });
  }
  if (loggedIn && user?.claims?.ADMIN) {
    topNavItems.push({
      name: `Team's approved leaves  (${managableApprovedLeavesCount})`,
      link: '/manage-approved-leaves',
      icon: 'FaCalendarCheck',
    });
  }
  if (loggedIn && user?.claims?.ADMIN) {
    topNavItems.push({
      name: `Team's rejected leaves  (${managableRejectedLeavesCount})`,
      link: '/manage-rejected-leaves',
      icon: 'FaCalendarTimes',
    });
  }
  if (loggedIn) {
    topNavItems.push({
      name: `Your calendar`,
      link: '/your-calendar',
      icon: 'FaRegCalendarAlt',
    });
    topNavItems.push({
      name: `Your pending requests (${ownRequestCount})`,
      link: '/requests',
      icon: 'FaQuestionCircle',
    });
    topNavItems.push({
      name: `Your approved leaves (${ownApprovedLeavesCount})`,
      link: '/approved-leaves',
      icon: 'FaCheckCircle',
    });
    topNavItems.push({
      name: `Your rejected leaves (${ownRejectedLeavesCount})`,
      link: '/rejected-leaves',
      icon: 'FaTimesCircle',
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
