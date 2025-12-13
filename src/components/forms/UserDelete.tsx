import { toast } from 'react-toastify';
import { useLoadingContext } from '../../context/loading/useLoadingContext';
import { useUserContext } from '../../context/user/useUserContext';
import Button from '../buttons/Button';
import RightToBeForgottenInfo from '../info/RightToBeForgottenInfo';
import { useConfirmationContext } from '../../context/confirmation/useConfirmationContext';
import { defaultConfirmationOptions } from '../../context/confirmation/types';

export default function UserDelete() {
  const { user, deleteUser } = useUserContext();
  const { startLoading, stopLoading } = useLoadingContext();
  const { confirm } = useConfirmationContext();

  if (!user) return <></>;

  const onDeleteConfirm = () => {
    confirm(
      defaultConfirmationOptions(
        'You’re about to permanently delete your account and all associated personal data. This includes your yearly entitlement settings and all leave requests. Once deleted, this information cannot be recovered.',
        onDelete
      )
    );
  };

  const onDelete = async () => {
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
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-brand-purple-700">
        You have the right to be forgotten
      </h2>
      <RightToBeForgottenInfo />
      <div>
        <Button
          variant="danger"
          label="Delete user profile"
          onClick={onDeleteConfirm}
        />
      </div>
    </div>
  );
}
