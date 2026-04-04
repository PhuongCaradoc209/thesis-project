import { Outlet } from 'react-router';

/**
 * LoadingLayout
 * Provides a clean, full-screen container for cinematic or loading pages.
 * Bypasses the standard Header and Footer found in MainLayout.
 */
const LoadingLayout = () => {
  return (
    <div
      className='relative min-h-screen w-full overflow-hidden text-white'
      style={{ backgroundImage: `url(${'/image/loading.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <main className='relative z-10 flex min-h-screen flex-col items-center justify-center'>
        <Outlet />
      </main>
    </div>
  );
};

export default LoadingLayout;
