import OAuth from '../components/auth/OAuth';
import LoginForm from '../components/forms/LoginForm';

export default function Login() {
  return (
    <div className="p-4 md:p-8 m-4 md:m-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50  overflow-auto">
      <h1 className="text-4xl font-bold text-brand-purple-700 mb-10">Login</h1>
      <LoginForm />
      <OAuth />
    </div>
  );
}
