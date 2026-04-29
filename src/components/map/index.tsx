import { MapPinIcon } from '@phosphor-icons/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Map, { Marker, NavigationControl, Popup, Source } from 'react-map-gl/maplibre';
import { useNavigate } from 'react-router';
import { MARKER_DATA } from '../../constants/markers';
import { NAV_PATH } from '../../router/paths';

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string;

const INITIAL_VIEW_STATE = {
  longitude: 107.5656,
  latitude: 16.4326,
  zoom: 5,
  pitch: 0,
  bearing: 0,
};

type TerrainMapProps = {
  selectedSiteId: string | null;
  hoveredSiteId: string | null;
  onMarkerHoverChange: (id: string | null) => void;
  onMarkerClick: (id: string) => void;
  onMapBackgroundClick: () => void;
};

export default function TerrainMap({
  selectedSiteId,
  hoveredSiteId,
  onMarkerHoverChange,
  onMarkerClick,
  onMapBackgroundClick,
}: TerrainMapProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mapStyle = `https://api.maptiler.com/maps/satellite-v4/style.json?key=${MAPTILER_KEY}`;
  const terrainSourceUrl = useMemo(() => `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`, []);

  const displayedMarker = useMemo(() => {
    const activeId = hoveredSiteId || selectedSiteId;
    return MARKER_DATA.find((m) => m.id === activeId);
  }, [hoveredSiteId, selectedSiteId]);

  return (
    <Map
      reuseMaps
      initialViewState={INITIAL_VIEW_STATE}
      mapStyle={mapStyle as any}
      terrain={{ source: 'maptiler-terrain', exaggeration: 1.5 }}
      minZoom={4.5}
      onClick={onMapBackgroundClick}>
      <NavigationControl position='bottom-left' />

      {MARKER_DATA.map((marker) => (
        <Marker key={marker.id} longitude={marker.longitude} latitude={marker.latitude} anchor='bottom'>
          <div
            onMouseEnter={() => onMarkerHoverChange(marker.id)}
            onMouseLeave={() => onMarkerHoverChange(null)}
            onClick={(event) => {
              event.stopPropagation();
              onMarkerClick(marker.id);
            }}
            className='origin-bottom cursor-pointer text-3xl transition-transform duration-200 ease-out hover:scale-125'
            style={{ filter: 'drop-shadow(0px 0px 8px rgba(255,255,255,0.2))' }}>
            <MapPinIcon size={50} weight='fill' className='text-primary-container' />
          </div>
        </Marker>
      ))}

      {displayedMarker && (
        <Popup
          longitude={displayedMarker.longitude}
          latitude={displayedMarker.latitude}
          anchor='left'
          offset={[30, -10]}
          closeButton={false}
          closeOnClick={false}
          className='z-10'>
          <div className='max-w-xs space-y-2 text-neutral-900'>
            <img
              src={displayedMarker.thumbnail}
              alt={t(displayedMarker.nameKey)}
              className='aspect-video w-full rounded-md object-cover'
            />
            <h3 className='text-base font-bold'>{t(displayedMarker.nameKey)}</h3>
            <p className='line-clamp-3 text-sm'>{t(displayedMarker.descriptionKey)}</p>
            <button
              onClick={() => navigate(`${NAV_PATH.LOADING}?sceneId=${displayedMarker.sceneId}`)}
              className='bg-primary hover:bg-primary-container w-full rounded-md py-2 text-white transition ease-in-out'>
              {t('actions.startExploring')}
            </button>
          </div>
        </Popup>
      )}

      <Source id='maptiler-terrain' type='raster-dem' url={terrainSourceUrl} tileSize={512} maxzoom={14} />
    </Map>
  );
}
