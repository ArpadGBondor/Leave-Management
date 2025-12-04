import UserPicker from '../components/userPicker/UserPicker';
import { useNavigate } from 'react-router-dom';

export default function ManageTeam() {
  const navigate = useNavigate();
  return (
    <div className="p-4 md:p-8 w-full h-full md:w-auto md:h-auto md:m-4 md:rounded-xl md:border-4 md:border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <h1 className="text-4xl font-bold text-brand-purple-600">Manage team</h1>
      <UserPicker onClick={(user) => navigate(`/manage-team/${user.id}`)} />
    </div>
  );
}
