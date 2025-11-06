import type * as FaIcons from '../icons/fa';

export default interface NavItem {
  name: string;
  link: string;
  icon?: keyof typeof FaIcons;
}
