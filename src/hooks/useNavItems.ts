import { useUserContext } from '../context/user/useUserContext';

const useNavItems = () => {
  const { loggedIn, loading: userLoading } = useUserContext();

  const navItems: {
    name: string;
    link: string;
  }[] = [];
  navItems.push({ name: 'Home', link: '/' });
  if (userLoading) {
    // skip
  } else if (loggedIn) {
    navItems.push({ name: 'Profile', link: '/profile' });
    navItems.push({ name: 'Logout', link: '/logout' });
  } else {
    navItems.push({ name: 'Login', link: '/login' });
    navItems.push({ name: 'Register', link: '/register' });
  }
  navItems.push({ name: 'About', link: '/about' });
  return { navItems };
};

export default useNavItems;
