import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { NAV_PATH } from '../../router/paths';

type NavItem = {
  key: string;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  { key: 'home', label: 'Trang chủ', path: NAV_PATH.HOME },
  { key: 'map', label: 'Bản đồ', path: NAV_PATH.MAP },
  { key: 'heritage', label: 'Di sản', path: '#' },
  { key: 'contact', label: 'Liên hệ', path: '#' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const location = useLocation();

  const isMapPage = location.pathname === NAV_PATH.MAP;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeKey = useMemo(
    () => navItems.find((item) => item.path !== '#' && item.path === location.pathname)?.key ?? null,
    [location.pathname],
  );

  const isSolidHeader = isMapPage || isScrolled;
  const solidHeaderClass = isMapPage
    ? 'border-stone-200/50 bg-white/90 backdrop-blur-md'
    : 'border-stone-200/50 bg-white/80 shadow-md backdrop-blur-md';

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isSolidHeader ? solidHeaderClass : 'border-transparent bg-linear-to-b from-white/40 to-transparent'
      }`}>
      <div className='flex h-20 w-full max-w-full items-center justify-between px-8 py-4'>
        <NavLink to={NAV_PATH.HOME} className='font-headline text-xl font-bold tracking-tighter text-red-800 uppercase'>
          VIETNAM VIRTUAL
        </NavLink>

        <div className='relative hidden items-center gap-8 md:flex' onMouseLeave={() => setHoveredKey(null)}>
          {navItems.map((item) => {
            const isActive = activeKey === item.key;
            const showUnderline = hoveredKey === item.key || (!hoveredKey && isActive);

            return (
              <div key={item.key} className='relative px-1 py-1' onMouseEnter={() => setHoveredKey(item.key)}>
                <NavLink
                  to={item.path}
                  className={`font-label text-sm tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-red-800' : 'text-stone-700 hover:text-red-800'
                  }`}>
                  {item.label}
                </NavLink>

                {showUnderline && (
                  <motion.div
                    layoutId='nav-underline'
                    className='absolute right-0 -bottom-1 left-0 h-0.5 bg-red-800'
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className='flex items-center gap-4'>
          <button className='material-symbols-outlined scale-95 text-red-800 transition-all duration-300 ease-out'>
            account_circle
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
