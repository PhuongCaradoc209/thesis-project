import { lazy } from 'react';

export const MODEL_REGISTRY: Record<string, React.LazyExoticComponent<any>> = {
  zAHnJ5paAFvzrtT4hwOH: lazy(() => import('./common/TuDuc/TuducTombs')),
  RiCq8XwhEEr7y9raJgMT: lazy(() => import('./common/DenHung/Gate')),
  QpJCBK3eFzn7hnN8t8yZ: lazy(() => import('./common/DenHung/SmallHouse')),
};
