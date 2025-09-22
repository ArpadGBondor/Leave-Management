import useAuthStatus from './useAuthStatus';

const useNavItems = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  const navItems: {
    name: string;
    link: string;
  }[] = [];
  navItems.push({ name: 'Home', link: '/' });
  if (checkingStatus) {
    // skip
  } else if (loggedIn) {
    navItems.push({ name: 'Account', link: '/account' });
    navItems.push({ name: 'Logout', link: '/logout' });
  } else {
    navItems.push({ name: 'Login', link: '/login' });
    navItems.push({ name: 'Register', link: '/register' });
  }
  navItems.push({ name: 'About', link: '/about' });
  return { navItems };
};

export default useNavItems;
