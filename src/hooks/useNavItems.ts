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

  const configGroup: NavItem[] = [];
  if (loggedIn && user?.claims?.SUPER_ADMIN) {
    configGroup.push({
      name: 'Manage company',
      link: '/manage-company',
      icon: 'FaBriefcase',
    });
  }
  if (loggedIn && user?.claims?.ADMIN) {
    configGroup.push({
      name: `Manage team members (${userCount})`,
      link: '/manage-team',
      icon: 'FaUsers',
    });
  }
  if (configGroup.length) {
    topNavItems.push({
      name: 'Configuration',
      icon: 'FaTools',
      children: configGroup,
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
    const teamRequests: NavItem[] = [];
    teamRequests.push({
      name: `Team's pending requests  (${managableRequestCount})`,
      link: '/manage-requests',
      icon: 'FaClipboardQuestion',
    });
    teamRequests.push({
      name: `Team's approved leaves  (${managableApprovedLeavesCount})`,
      link: '/manage-approved-leaves',
      icon: 'FaCalendarCheck',
    });
    teamRequests.push({
      name: `Team's rejected leaves  (${managableRejectedLeavesCount})`,
      link: '/manage-rejected-leaves',
      icon: 'FaCalendarTimes',
    });
    if (teamRequests.length) {
      topNavItems.push({
        name: `Team's leave requests (${
          managableRequestCount +
          managableApprovedLeavesCount +
          managableRejectedLeavesCount
        })`,
        icon: 'FaUsers',
        children: teamRequests,
      });
    }
  }

  if (loggedIn) {
    topNavItems.push({
      name: `Your calendar`,
      link: '/your-calendar',
      icon: 'FaRegCalendarAlt',
    });
    const yourRequests: NavItem[] = [];

    yourRequests.push({
      name: `Your pending requests (${ownRequestCount})`,
      link: '/requests',
      icon: 'FaQuestionCircle',
    });
    yourRequests.push({
      name: `Your approved leaves (${ownApprovedLeavesCount})`,
      link: '/approved-leaves',
      icon: 'FaCheckCircle',
    });
    yourRequests.push({
      name: `Your rejected leaves (${ownRejectedLeavesCount})`,
      link: '/rejected-leaves',
      icon: 'FaTimesCircle',
    });
    if (yourRequests.length) {
      topNavItems.push({
        name: `Your leave requests (${
          ownRequestCount + ownApprovedLeavesCount + ownRejectedLeavesCount
        })`,
        icon: 'FaUser',
        children: yourRequests,
      });
    }
  }
  if (loggedIn && user?.claims?.ADMIN) {
    topNavItems.push({
      name: `Reports`,
      link: '/reports',
      icon: 'FaChartBar',
    });
  }
  topNavItems.push({ name: 'About', link: '/about', icon: 'FaInfoCircle' });

  if (userLoading) {
    // skip
  } else if (loggedIn) {
    bottomNavItems.push({
      name: 'Profile',
      link: '/profile',
      icon: 'FaUserCircle',
    });
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
