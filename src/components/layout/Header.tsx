import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { NAV_PATH } from '../../router/paths';

const navItems = [
  { label: 'Trang chủ', path: NAV_PATH.HOME },
  { label: 'Bản đồ', path: NAV_PATH.MAP },
  { label: 'Di sản', path: '#' },
  { label: 'Liên hệ', path: '#' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-stone-200/50 bg-white/80 shadow-md backdrop-blur-md'
          : 'border-transparent bg-linear-to-b from-white/40 to-transparent'
      }`}
    >
      <div className='flex h-20 w-full max-w-full items-center justify-between px-8 py-4'>
        <NavLink to={NAV_PATH.HOME} className='font-headline text-xl font-bold tracking-tighter text-red-800 uppercase'>
          VIETNAM VIRTUAL
        </NavLink>

        <div className='hidden items-center gap-8 md:flex'>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredPath === item.path;

            return (
              <div
                key={item.label}
                className='relative px-1 py-1'
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <NavLink
                  to={item.path}
                  className={`font-label text-sm tracking-wide transition-colors ${
                    isActive ? 'text-red-800' : 'text-stone-700 hover:text-red-800'
                  }`}
                >
                  {item.label}
                </NavLink>

                {/* The sliding underline indicator */}
                <AnimatePresence>
                  {(isHovered || (isActive && !hoveredPath)) && (
                    <motion.div
                      layoutId='nav-underline'
                      className='absolute right-[-4px] -bottom-1 left-[-4px] h-0.5 bg-red-800'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </AnimatePresence>
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
