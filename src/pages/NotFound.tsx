import NavButton from '../components/buttons/NavButton';

export default function NotFound() {
  return (
    <div className="max-w-md m-8 p-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto">
      <h1 className="text-4xl font-bold text-brand-purple-600 mb-4">
        Page Not Found
      </h1>
      <p className="mb-4 text-brand-green-800">
        Oops! The page you are looking for does not exist.
      </p>
      <div className="flex flex-col items-center">
        <NavButton label="Back to Home" link="/" />
      </div>
    </div>
  );
}
