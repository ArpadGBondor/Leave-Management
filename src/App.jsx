import BackgroundDecor from './components/decoration/BackgroundDecor';
import Navigation from './components/navigation/Navigation';

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row justify-stretch items-stretch bg-brand-purple-50 bg-no-repeat bg-cover bg-bottom overflow-hidden">
      <div className="navigation grow-0 shrink-0">
        <Navigation />
      </div>
      <div className="w-full h-full overflow-hidden relative">
        <BackgroundDecor />
        <main className="relative w-full h-full flex flex-col justify-center items-center">
          <div className="p-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50">
            <h1 className="text-4xl font-bold text-brand-purple-600">
              Manage your leaves
            </h1>
            <button className="mt-6 px-6 py-2 rounded-xl bg-brand-green-500 text-white hover:bg-brand-green-600 transition">
              Get Started
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
