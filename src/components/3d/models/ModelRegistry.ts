import { lazy } from 'react';

/**
 * Only assets that need bespoke scene behaviour belong here. Every other
 * Firestore scene asset is rendered by GenericSceneAsset.
 */
export const CUSTOM_MODEL_RENDERERS: Record<string, React.LazyExoticComponent<any>> = {
  zAHnJ5paAFvzrtT4hwOH: lazy(() => import('./common/TuDuc/TuducTombs')),
  RiCq8XwhEEr7y9raJgMT: lazy(() => import('./common/DenHung/Gate')),
  QpJCBK3eFzn7hnN8t8yZ: lazy(() => import('./common/DenHung/SmallHouse')),
};
