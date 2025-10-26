import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <div className="p-4 md:p-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto max-w-full space-y-4">
      <div className="flex flex-col justify-stretch items-stretch gap-4 w-full">
        <h2 className="text-4xl font-bold text-brand-purple-700">
          Forgot Password
        </h2>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
