import { toast } from 'react-toastify';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { useUserContext } from '../../context/user/useUserContext';
import Button from '../buttons/Button';

export default function DeleteUser() {
  const { user, deleteUser } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();

  if (!user) return <></>;

  const clickDelete = async () => {
    startLoading('delete-user');
    try {
      await deleteUser(user);
      toast.info('User profile deleted');
    } catch (error: any) {
      toast.error(error.message || 'Could not delete user profile');
    } finally {
      stopLoading('delete-user');
    }
  };
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-brand-purple-700 mb-4">
        You have the right to be forgotten
      </h2>
      <div>
        <Button
          variant="danger"
          label="Delete user profile"
          onClick={clickDelete}
        />
      </div>
    </div>
  );
}
