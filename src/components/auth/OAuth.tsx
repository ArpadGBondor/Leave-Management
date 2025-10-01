import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import googleIcon from '../../assets/googleIcon.svg';
import { useUserContext } from '../../context/user/useUserContext';

function OAuth() {
  const { loginWithGoogle } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not autorise with Google.'
      );
    }
  };

  return (
    <div className="flex flex-row gap-8 justify-center items-center">
      <p className="text-xl font-bold text-brand-purple-600">
        Or sign {location.pathname === '/login' ? 'in' : 'up'} with
      </p>
      <button className="bg-brand-purple-200 hover:bg-brand-purple-100 rounded-full p-4">
        <img
          className="w-12 h-12"
          src={googleIcon}
          alt="Google"
          onClick={onGoogleClick}
        />
      </button>
    </div>
  );
}

export default OAuth;
