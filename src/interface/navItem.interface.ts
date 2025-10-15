import * as FaIcons from 'react-icons/fa';

export default interface NavItem {
  name: string;
  link: string;
  icon?: keyof typeof FaIcons;
}
