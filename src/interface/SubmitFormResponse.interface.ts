export default interface SubmitFormResponse {
  submitted: boolean; // action completed
  skipped: boolean; // no action required
  error: boolean; // validation failed / error happened
  message: string;
}

export const formResponse = (
  status: 'submitted' | 'skipped' | 'error',
  message: string
): SubmitFormResponse => ({
  submitted: status === 'submitted',
  skipped: status === 'skipped',
  error: status === 'error',
  message,
});
