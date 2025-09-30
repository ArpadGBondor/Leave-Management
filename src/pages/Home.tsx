import { toast } from 'react-toastify';
import Spinner from '../components/spinner/Spinner';
export default function Home() {
  return (
    <div className="p-8 m-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto">
      <h1 className="text-4xl font-bold text-brand-purple-600">
        Manage your leaves
      </h1>
      <div className="mt-10 flex flex-col justify-center items-center">
        <Spinner variant="secondary" />
        <div className="text-brand-green-600">Work in progress...</div>
      </div>
    </div>
  );
}
