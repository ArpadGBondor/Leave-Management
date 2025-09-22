import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../../assets/googleIcon.svg';

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for user
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Create user
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate('/');
    } catch (error) {
      toast.error('Could not autorise with Google.');
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
