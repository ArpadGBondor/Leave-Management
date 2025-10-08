import * as FaIcons from 'react-icons/fa';

export default interface navItem {
  name: string;
  link: string;
  icon?: keyof typeof FaIcons;
}
