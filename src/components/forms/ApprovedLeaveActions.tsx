import { useNavigate } from 'react-router-dom';
import { LeaveRequest } from '../../interface/LeaveRequest.interface';
import Button from '../buttons/Button';

interface ApprovedLeaveActionsProp {
  request: LeaveRequest;
}

export default function ApprovedLeaveActions({
  request,
}: ApprovedLeaveActionsProp) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-stretch gap-1 md:gap-4">
        <Button
          type="button"
          variant="secondary"
          label={'Back'}
          onClick={() => navigate('/approved-leaves')}
        />
      </div>
    </>
  );
}
