import { useUserContext } from '../context/user/useUserContext';
import navItem from '../interface/navItem.interface';

const useNavItems = () => {
  const { loggedIn, loading: userLoading } = useUserContext();

  const topNavItems: navItem[] = [];
  const bottomNavItems: navItem[] = [];

  topNavItems.push({ name: 'Home', link: '/' });
  topNavItems.push({ name: 'About', link: '/about' });

  if (userLoading) {
    // skip
  } else if (loggedIn) {
    bottomNavItems.push({ name: 'Profile', link: '/profile' });
    bottomNavItems.push({ name: 'Logout', link: '/logout' });
  } else {
    bottomNavItems.push({ name: 'Login', link: '/login' });
    bottomNavItems.push({ name: 'Register', link: '/register' });
  }
  return { topNavItems, bottomNavItems };
};

export default useNavItems;
