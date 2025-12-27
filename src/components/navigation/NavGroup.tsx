import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavItem from '../../interface/NavItem.interface';
import NavButton from '../buttons/NavButton';
import * as FaIcons from '../../icons/fa';
import { FaArrowAltCircleRight } from '../../icons/fa';

interface NavGroupProps {
  group: NavItem;
}

export default function NavGroup({ group }: NavGroupProps) {
  const location = useLocation();

  const hasActiveChild = group.children?.some(
    (item) => item.link === location.pathname
  );

  const [open, setOpen] = useState(hasActiveChild);

  // auto-expand when route changes
  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  const IconComponent = group.icon ? FaIcons[group.icon] : null;

  if (!group.children?.length) return <></>;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between px-4 py-2 transition-all duration-300 border-2 hover:bg-brand-green-600 cursor-pointer ${
          open
            ? 'bg-brand-green-700 rounded-t-xl border-brand-green-800'
            : 'bg-brand-green-700 rounded-xl border-brand-green-700'
        } `}
      >
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent />}
          <span className="font-semibold">{group.name}</span>
        </div>
        <span
          className={`transition-all duration-300 ${open ? 'rotate-90' : ''}`}
        >
          <FaArrowAltCircleRight />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] border-b-2 border-x-2' : 'grid-rows-[0fr]'
        } border-brand-green-800 rounded-b-2xl`}
      >
        <div className="overflow-hidden flex flex-col">
          {group.children
            .filter((item) => item.link)
            .map((item) => (
              <div className="px-1 py-1" key={item.name}>
                <NavButton
                  label={item.name}
                  link={item.link!}
                  icon={item.icon}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
