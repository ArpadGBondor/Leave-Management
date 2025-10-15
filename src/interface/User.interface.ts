import { Timestamp } from 'firebase/firestore';

export const userTypeOptions = ['Employee', 'Manager', 'Owner'] as const;

export type UserType = (typeof userTypeOptions)[number];

export type UserClaims = {
  ADMIN?: boolean;
  SUPER_ADMIN?: boolean;
};

export default interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
  created?: Timestamp;
  updated?: Timestamp;
  userType: UserType;
  claims?: UserClaims;
}
