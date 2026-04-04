import { ArrowLeftIcon } from '@phosphor-icons/react';
import { NavLink, Outlet } from 'react-router';
import { NAV_PATH } from '../router/paths';
import { useTourismStore } from '../store/useTourismStore';

const ReviewLayout = () => {
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);

  return (
    <div className='flex min-h-screen flex-col bg-white text-white'>
      {/* Header - Hidden when inspecting an artifact */}
      {!selectedArtifactId && (
        <div className='fixed top-0 z-50 w-full bg-white/90 transition-all duration-300'>
          <div className='flex h-20 w-full max-w-full items-center justify-between px-8 py-4'>
            <NavLink to={NAV_PATH.HOME} className='font-headline text-xl font-bold tracking-tighter text-red-800 uppercase'>
              VIETNAM VIRTUAL
            </NavLink>

            <div className='flex items-center gap-8'>
              <span className='text-primary border-primary border-b-2 p-2 text-lg font-semibold'>Lăng Tự Đức </span>
              <NavLink to={NAV_PATH.MAP}>
                <button className='bg-primary hover:bg-primary-container flex items-center gap-2 rounded-md px-4 py-2 text-white shadow transition-colors ease-in-out'>
                  <ArrowLeftIcon size={16} weight='bold' />
                  Back To Map
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};

export default ReviewLayout;
