import { Navigate, useSearchParams } from 'react-router';
import { NAV_PATH } from '../../router/paths';

function LoadingPage() {
  const [searchParams] = useSearchParams();
  const sceneId = searchParams.get('sceneId');

  return <Navigate to={sceneId ? NAV_PATH.TOUR.replace(':sceneId', sceneId) : NAV_PATH.MAP} replace />;
}

export default LoadingPage;
