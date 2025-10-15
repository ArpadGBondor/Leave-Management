import { useUserContext } from '../context/user/useUserContext';
import NavItem from '../interface/NavItem.interface';

const useNavItems = () => {
  const { user, loggedIn, loading: userLoading } = useUserContext();

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
      name: 'Manage team',
      link: '/manage-team',
      icon: 'FaUsers',
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
