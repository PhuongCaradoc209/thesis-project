import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const activeLanguage: I18nLanguage = (() => {
    const normalized = (i18n.language || 'en').split('-')[0] as I18nLanguage;
    return normalized in i18nLanguages ? normalized : 'en';
  })();

  const nextLanguage: I18nLanguage = activeLanguage === 'en' ? 'vi' : 'en';

  const activeKey = useMemo(() => navItems.find((item) => item.path === location.pathname)?.key ?? null, [location.pathname]);

  return (
    <nav
      aria-label={t('nav.label')}
      className='bg-background text-on-background border-on-background/85 fixed top-0 z-50 w-full border-b-[1.5px]'>
      <div className='mx-auto flex h-17 max-w-[1312px] items-center justify-between px-5 md:px-16'>
        <NavLink
          to={NAV_PATH.HOME}
          className='font-headline bg-primary text-on-primary hover:text-on-primary px-[11px] py-[7px] text-lg font-extrabold tracking-[.06em] uppercase'>
          {t('brand.name')}
        </NavLink>

        <div className='hidden items-center gap-[34px] md:flex'>
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={`hover:text-primary font-mono text-[13px] font-medium tracking-[.06em] uppercase transition-colors ${
                activeKey === item.key ? 'text-primary underline decoration-2 underline-offset-[7px]' : 'text-on-background'
              }`}>
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>

        <div className='flex items-center gap-3 md:gap-5'>
          <button
            type='button'
            aria-label={t('actions.switchLanguage')}
            onClick={() => i18n.changeLanguage(nextLanguage)}
            className='text-on-background hover:text-primary px-1 py-1 font-mono text-[13px] font-semibold tracking-[.06em] transition-colors'>
            {i18nLanguages[activeLanguage]} / {i18nLanguages[nextLanguage]}
          </button>
          <Link
            to={NAV_PATH.MAP}
            className='border-on-background text-on-background hover:bg-on-background hover:text-background hidden border-[1.5px] px-3.5 py-2 font-mono text-[13px] font-semibold tracking-[.06em] uppercase transition-colors lg:inline-block'>
            {t('nav.enterMap')}
          </Link>
          <button
            type='button'
            aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls='mobile-nav'
            onClick={() => setIsMenuOpen((open) => !open)}
            className='text-on-background hover:bg-surface-container-high flex h-11 w-11 items-center justify-center transition-colors md:hidden'>
            <span className='material-symbols-outlined' aria-hidden='true'>
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id='mobile-nav' className='border-on-background/85 border-t-[1.5px] px-5 pb-4 md:hidden'>
          <ul className='flex flex-col'>
            {navItems.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block border-b border-black/15 py-4 font-mono text-sm tracking-[.06em] uppercase ${
                    activeKey === item.key ? 'text-primary' : 'text-on-background'
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
