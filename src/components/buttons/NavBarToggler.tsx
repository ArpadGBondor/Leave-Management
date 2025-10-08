import { FaTimes, FaBars } from 'react-icons/fa';

type NavbarTogglerProps = {
  isOpen: boolean;
  onClick?: () => void;
};

const NavbarToggler = ({ isOpen, onClick }: NavbarTogglerProps) => {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex h-8 w-12 items-center justify-center text-2xl transition-transform duration-300 ease-in-out"
      aria-label="Toggle navigation"
    >
      <span
        className={`block transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'rotate-360' : 'rotate-0'
        }`}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </span>
    </button>
  );
};

export default NavbarToggler;
