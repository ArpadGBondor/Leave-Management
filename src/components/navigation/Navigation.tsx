import { useState } from 'react';
import NavButton from '../buttons/NavButton';
import useNavItems from '../../hooks/useNavItems';
import { useUserContext } from '../../context/user/useUserContext';
import ProfileBadge from '../profile/ProfileBadge';
import NavbarToggler from '../buttons/NavBarToggler';

const appName = 'Manage your leaves';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { topNavItems, bottomNavItems } = useNavItems();
  const { user } = useUserContext();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col justify-between gap-2 w-80 h-screen bg-brand-green-700 text-white overflow-auto">
        <div className="overflow-y-auto px-4 pt-4">
          <h1 className="text-xl font-bold mb-4">{appName}</h1>
          <hr className="my-1" />
          <nav className="flex flex-col gap-2">
            {topNavItems.map((item) => (
              <NavButton
                key={item.name}
                label={item.name}
                link={item.link}
                icon={item.icon}
              />
            ))}
          </nav>
        </div>
        <div className="px-4 pb-4">
          {user && (
            <>
              <hr className="mb-2" />
              <ProfileBadge user={user} />
              <hr className="my-2" />
            </>
          )}
          <nav className="flex flex-col gap-2">
            {bottomNavItems.map((item) => (
              <NavButton
                key={item.name}
                label={item.name}
                link={item.link}
                icon={item.icon}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile/Tablet Top Navbar */}
      <div className="lg:hidden w-full bg-brand-green-700 text-white flex items-center justify-between px-4 py-3 shadow-md z-50">
        <h1 className="text-lg font-bold">{appName}</h1>
        <NavbarToggler isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* Mobile Menu Drawer */}

      <div
        className={`lg:hidden fixed top-13 left-0 p-4 pt-0 w-full bg-brand-green-700 text-white z-40 shadow-lg rounded-b-2xl transform-gpu origin-top transition-transform duration-500 ease-in-out ${
          isOpen ? 'scale-y-100' : 'scale-y-0 pointer-events-none'
        }`}
      >
        <hr className="my-1" />
        <div>
          <nav className="flex flex-col gap-2">
            {topNavItems.map((item) => (
              <NavButton
                key={item.name}
                label={item.name}
                link={item.link}
                icon={item.icon}
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
                icon={item.icon}
                onClick={() => setIsOpen(!isOpen)}
              />
            ))}
          </nav>
          {user && (
            <>
              <hr className="mt-1 mb-4" />
              <ProfileBadge user={user} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
