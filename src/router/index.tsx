import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import LoadingPage from '../pages/loading';
import MapPage from '../pages/map';
import TourPage from '../pages/tour';
import { NAV_PATH } from './paths';

import LoadingLayout from '../layouts/LoadingLayout';
import ReviewLayout from '../layouts/ReviewLayout';

const HomePage = lazy(() => import('../pages/home'));

const publicRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: NAV_PATH.HOME,
        element: <HomePage />,
        index: true,
      },
      {
        path: NAV_PATH.MAP,
        element: <MapPage />,
      },
      {
        path: NAV_PATH.REVIEW,
        element: <div className='p-8'>Review Page Placeholder</div>,
      },
    ],
  },
  {
    element: <LoadingLayout />,
    children: [
      {
        path: NAV_PATH.LOADING,
        element: <LoadingPage />,
      },
    ],
  },
  {
    element: <ReviewLayout />,
    children: [
      {
        path: NAV_PATH.TOUR,
        element: <TourPage />,
      },
    ],
  },
];

const privateRoutes: RouteObject[] = [];

export const routes: RouteObject[] = [...privateRoutes, ...publicRoutes];
