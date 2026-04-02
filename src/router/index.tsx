import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import MapPage from '../pages/map';
import { NAV_PATH } from './paths';

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
    ],
  },
];

const privateRoutes: RouteObject[] = [];

export const routes: RouteObject[] = [...privateRoutes, ...publicRoutes];
