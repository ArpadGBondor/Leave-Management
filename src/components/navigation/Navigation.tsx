import { useState } from 'react';
import NavButton from '../buttons/NavButton';
import useNavItems from '../../hooks/useNavItems';
import { useUserContext } from '../../context/user/useUserContext';
import ProfileBadge from '../profile/ProfileBadge';

const appName = 'Manage your leaves';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { topNavItems, bottomNavItems } = useNavItems();
  const { user } = useUserContext();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden min-w-72 lg:flex flex-col justify-between gap-2 w-60 h-screen bg-brand-green-700 text-white p-4 overflow-auto">
        <div>
          <h1 className="text-xl font-bold mb-4">{appName}</h1>
          <hr className="my-1" />
          <nav className="flex flex-col gap-2">
            {topNavItems.map((item) => (
              <NavButton key={item.name} label={item.name} link={item.link} />
            ))}
          </nav>
        </div>
        <div>
          {user && (
            <>
              <ProfileBadge />
              <hr className="my-2" />
            </>
          )}
          <nav className="flex flex-col gap-2">
            {bottomNavItems.map((item) => (
              <NavButton key={item.name} label={item.name} link={item.link} />
            ))}
          </nav>
        </div>
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
        <div className="lg:hidden fixed top-13 left-0 w-full bg-brand-green-700 text-white p-4 pt-0 z-40 shadow-lg rounded-b-2xl overflow-auto ">
          <hr className="my-1" />
          <div>
            <nav className="flex flex-col gap-2">
              {topNavItems.map((item) => (
                <NavButton
                  key={item.name}
                  label={item.name}
                  link={item.link}
                  onClick={() => setIsOpen(!isOpen)}
                />
              ))}
            </nav>
            <hr className="my-1" />
            <nav className="flex flex-col gap-2">
              {bottomNavItems.map((item) => (
                <NavButton
                  key={item.name}
                  label={item.name}
                  link={item.link}
                  onClick={() => setIsOpen(!isOpen)}
                />
              ))}
            </nav>
            {user && (
              <>
                <hr className="mt-1 mb-4" />
                <ProfileBadge />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
