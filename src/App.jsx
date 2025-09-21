import { Route, Routes } from 'react-router-dom';
import BackgroundDecor from './components/decoration/BackgroundDecor';
import Navigation from './components/navigation/Navigation';
import Home from './pages/Home';
import About from './pages/About';

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row justify-stretch items-stretch bg-brand-purple-50 bg-no-repeat bg-cover bg-bottom overflow-hidden">
      <div className="navigation grow-0 shrink-0">
        <Navigation />
      </div>
      <div className="w-full h-full overflow-hidden relative">
        <BackgroundDecor />
        <main className="relative w-full h-full flex flex-col justify-center items-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
