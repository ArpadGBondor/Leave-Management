import BackgroundDecor from './components/decoration/BackgroundDecor';
export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative bg-brand-purple-50 bg-no-repeat bg-cover bg-bottom overflow-hidden">
      <BackgroundDecor />
      <div className="relative p-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50">
        <h1 className="text-4xl font-bold text-brand-purple-600">
          Manage your leaves
        </h1>
        <button className="mt-6 px-6 py-2 rounded-xl bg-brand-green-500 text-white hover:bg-brand-green-600 transition">
          Get Started
        </button>
      </div>
    </div>
  );
}
