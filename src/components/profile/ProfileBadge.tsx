import { useUserContext } from '../../context/user/useUserContext';

export default function ProfileBadge() {
  const { user } = useUserContext();

  if (!user) return <div></div>;
  return (
    <div className="w-full flex flex-row items-center gap-4">
      <img
        src={user.photo}
        alt="Profile picture"
        className="w-16 h-16 rounded-full border-4 border-brand-purple-300"
      />
      <div className="flex flex-col items-start">
        <p className="text-brand-purple-200 font-bold">{user.name}</p>
        <p className="text-brand-green-200">{user.userType}</p>
      </div>
    </div>
  );
}
