import type * as FaIcons from '../icons/fa';

export default interface NavItem {
  name: string;
  link?: string; // undefined = group header
  markActive?: string[];
  icon?: keyof typeof FaIcons;
  children?: NavItem[]; // group items
}
