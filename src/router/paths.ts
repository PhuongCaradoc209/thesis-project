export const NAV_PATH = {
  HOME: '/',
  MAP: '/map',
  LOADING: '/loading',
  TOUR: '/tour/:sceneId',
  REVIEW: '/review',
  // Add more paths here as the project grows
} as const;

export type NavPath = (typeof NAV_PATH)[keyof typeof NAV_PATH];
