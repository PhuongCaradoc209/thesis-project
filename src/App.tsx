import { createBrowserRouter, RouterProvider } from 'react-router';
import BackgroundMusic from './components/music/BackgroundMusic';
import { routes } from './router';

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <BackgroundMusic />
    </>
  );
  // return (
  //   <div className='relative h-screen w-screen overflow-hidden bg-black text-white'>
  //     <BaseScene>
  //       <SmallHouse />
  //       <Gate position={[-30, -3.8, 0]} />
  //     </BaseScene>
  //   </div>
  // );
}

export default App;
