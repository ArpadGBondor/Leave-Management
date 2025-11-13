import User from '../../interface/User.interface';

interface ProfileBadgeProps {
  user: User;
}

export default function ProfileBadge({ user }: ProfileBadgeProps) {
  if (!user) return <div></div>;
  return (
    <div className="w-full flex flex-row items-center gap-4">
      <img
        src={user.photo}
        alt="Profile picture"
        className="w-16 h-16 rounded-full border-4 border-white"
      />
      <div className="flex flex-col items-start">
        <p className="text-white font-bold">{user.name}</p>
        <p className="text-brand-green-200">{user.userType}</p>
      </div>
    </div>
  );
}
