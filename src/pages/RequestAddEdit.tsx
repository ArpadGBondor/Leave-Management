import { useParams } from 'react-router-dom';
import RequestAddEditForm from '../components/forms/RequestAddEditForm';

export default function RequestAddEdit() {
  const { requestId } = useParams();

  return (
    <div className="p-4 md:p-8 md:min-w-xl w-full h-full md:w-auto md:h-auto md:m-4 md:rounded-xl md:border-4 md:border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <RequestAddEditForm requestId={requestId} />
    </div>
  );
}
