import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useParams } from 'react-router';
import { NAV_PATH } from '../router/paths';
import { useTourismStore } from '../store/useTourismStore';
import { getScenePresentation } from '../utils/scenePresentation';

const ReviewLayout = () => {
  const { t } = useTranslation();
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);
  const { sceneId } = useParams<{ sceneId: string }>();
  const presentation = getScenePresentation(sceneId ?? null, t);

  return (
    <div className='flex min-h-screen flex-col bg-white text-white'>
      {!selectedArtifactId && (
        <>
          {presentation && (
            <div className='bg-surface-bright border-on-background text-on-background fixed top-4 left-4 z-50 min-w-56 border-[1.5px] px-4 pt-3 pb-3.5 md:top-6 md:left-6'>
              <div className='text-on-surface-variant font-mono text-[11.5px] tracking-[.12em] uppercase'>
                {t('tourHud.visiting')} · {presentation.city}
              </div>
              <h1 className='font-headline mt-1 text-[26px] leading-[1.15] font-extrabold uppercase [font-stretch:75%] md:text-[30px]'>
                {presentation.name}
              </h1>
            </div>
          )}
          <NavLink
            to={NAV_PATH.MAP}
            className='bg-surface-bright border-on-background text-on-background hover:bg-on-background hover:text-background fixed top-4 right-4 z-50 flex items-center gap-2 border-[1.5px] px-3.5 py-2.5 font-mono text-[12.5px] font-semibold tracking-[.06em] uppercase transition-colors md:top-6 md:right-6'>
            <ArrowLeftIcon size={16} weight='bold' />
            {t('tourHud.leave')}
          </NavLink>
        </>
      )}

      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};

export default ReviewLayout;
