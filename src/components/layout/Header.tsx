import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';
import { i18nLanguages, type I18nLanguage } from '../../i18n';
import { NAV_PATH } from '../../router/paths';

type NavItem = {
  key: string;
  labelKey: string;
  path: string;
};

const navItems: NavItem[] = [
  { key: 'home', labelKey: 'nav.home', path: NAV_PATH.HOME },
  { key: 'map', labelKey: 'nav.map', path: NAV_PATH.MAP },
  { key: 'heritage', labelKey: 'nav.heritage', path: NAV_PATH.HERITAGE },
  { key: 'about', labelKey: 'nav.about', path: NAV_PATH.ABOUT },
];

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const activeLanguage: I18nLanguage = (() => {
    const normalized = (i18n.language || 'en').split('-')[0] as I18nLanguage;
    return normalized in i18nLanguages ? normalized : 'en';
  })();

  const nextLanguage: I18nLanguage = activeLanguage === 'en' ? 'vi' : 'en';

  const isMapPage = location.pathname === NAV_PATH.MAP;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeKey = useMemo(() => navItems.find((item) => item.path === location.pathname)?.key ?? null, [location.pathname]);

  const isSolidHeader = isMapPage || isScrolled || isMenuOpen;
  const solidHeaderClass = isMapPage
    ? 'border-stone-200/50 bg-white/90 backdrop-blur-md'
    : 'border-stone-200/50 bg-white/80 shadow-md backdrop-blur-md';

  return (
    <nav
      aria-label={t('nav.label')}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isSolidHeader ? solidHeaderClass : 'border-transparent bg-linear-to-b from-white/40 to-transparent'
      }`}>
      <div className='flex h-20 w-full max-w-full items-center justify-between px-8 py-4'>
        <NavLink to={NAV_PATH.HOME} className='font-headline text-xl font-bold tracking-tighter text-red-800 uppercase'>
          {t('brand.name')}
        </NavLink>

        <div
          className='absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex'
          onMouseLeave={() => setHoveredKey(null)}>
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
                  {t(item.labelKey)}
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

        <div className='flex items-center gap-3'>
          <button
            type='button'
            aria-label={t('actions.switchLanguage')}
            onClick={() => i18n.changeLanguage(nextLanguage)}
            className='font-label rounded-md border border-stone-200/60 px-3 py-1 text-xs font-semibold tracking-wider text-stone-700 transition-colors hover:border-stone-300/80 hover:bg-stone-100/70'>
            {i18nLanguages[activeLanguage]}
          </button>
          <button
            type='button'
            aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls='mobile-nav'
            onClick={() => setIsMenuOpen((open) => !open)}
            className='flex h-11 w-11 items-center justify-center rounded-md text-stone-700 transition-colors hover:bg-stone-100/70 md:hidden'>
            {/* Icon nằm trong span: stylesheet Material Symbols (ngoài layer Tailwind) sẽ đè md:hidden nếu gắn trên nút */}
            <span className='material-symbols-outlined' aria-hidden='true'>
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id='mobile-nav' className='border-t border-stone-200/60 px-8 pb-6 md:hidden'>
          <ul className='flex flex-col'>
            {navItems.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-label block border-b border-stone-200/60 py-4 text-base ${
                    activeKey === item.key ? 'text-red-800' : 'text-stone-700'
                  }`}>
                  {t(item.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
