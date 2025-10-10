import OAuth from '../components/auth/OAuth';
import RegisterForm from '../components/forms/RegisterForm';

export default function Register() {
  return (
    <div className="p-4 md:p-8 m-4 md:m-8 md:min-w-sm lg:min-w-md max-w-lg rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto">
      <h1 className="text-4xl font-bold text-brand-purple-700 mb-4">
        Register
      </h1>
      <RegisterForm />
      <OAuth />
    </div>
  );
}
