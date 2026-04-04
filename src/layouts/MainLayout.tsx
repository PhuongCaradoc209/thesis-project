import { Outlet } from 'react-router';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import ScrollToTop from '../components/scroll-to-top';

const MainLayout = () => {
  return (
    <div className='flex min-h-screen flex-col bg-white text-white'>
      <ScrollToTop />
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className='flex-1'>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
