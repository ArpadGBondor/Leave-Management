import { Timestamp } from 'firebase/firestore';

export default interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
  timestamp: Timestamp;
}
