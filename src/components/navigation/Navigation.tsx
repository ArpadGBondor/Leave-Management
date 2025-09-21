import { useState } from 'react';
import NavButton from '../buttons/NavButton';

const navItems = [{ name: 'Home' }, { name: 'Profile' }, { name: 'Settings' }];

const appName = 'Manage your leaves';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-60 h-screen bg-brand-green-700 text-white p-4">
        <h1 className="text-xl font-bold mb-6">{appName}</h1>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <NavButton key={item.name} label={item.name} />
          ))}
        </nav>
      </div>

      {/* Mobile/Tablet Top Navbar */}
      <div className="lg:hidden w-full bg-brand-green-700 text-white flex items-center justify-between px-4 py-3 shadow-md z-50">
        <h1 className="text-lg font-bold">{appName}</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed top-12 left-0 w-full bg-brand-green-700 text-white p-4 z-40 shadow-lg rounded-b-2xl">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavButton
                key={item.name}
                label={item.name}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
