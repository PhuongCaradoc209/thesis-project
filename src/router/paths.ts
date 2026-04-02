export const NAV_PATH = {
  HOME: '/',
  MAP: '/map',
  // Add more paths here as the project grows
} as const;

export type NavPath = (typeof NAV_PATH)[keyof typeof NAV_PATH];
