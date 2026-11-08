import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Map, { Marker, ScaleControl, Source, type MapRef } from 'react-map-gl/maplibre';
import { MARKER_DATA } from '../../constants/markers';
import { formatTicketNumber } from '../../constants/siteDetails';
import Compass from './Compass';

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string;

const INITIAL_VIEW_STATE = {
  longitude: 106.2,
  latitude: 16.2,
  zoom: 4.7,
  pitch: 0,
  bearing: 0,
};

const CONTROL =
  'bg-surface-bright text-on-background hover:bg-surface-container-high grid size-[38px] place-items-center font-mono text-base font-semibold transition-colors';

type TerrainMapProps = {
  selectedSiteId: string | null;
  activeSiteId: string | null;
  onMarkerHoverChange: (id: string | null) => void;
  onMarkerClick: (id: string) => void;
  onMapBackgroundClick: () => void;
};

export default function TerrainMap({
  selectedSiteId,
  activeSiteId,
  onMarkerHoverChange,
  onMarkerClick,
  onMapBackgroundClick,
}: TerrainMapProps) {
  const { t } = useTranslation();
  const mapRef = useRef<MapRef | null>(null);
  const [bearing, setBearing] = useState(0);
  const mapStyle = `https://api.maptiler.com/maps/satellite-v4/style.json?key=${MAPTILER_KEY}`;
  const terrainSourceUrl = useMemo(() => `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`, []);

  useEffect(() => {
    if (!selectedSiteId) return;

    const targetMarker = MARKER_DATA.find((marker) => marker.id === selectedSiteId);
    if (!targetMarker) return;

    mapRef.current?.flyTo({
      center: [targetMarker.longitude, targetMarker.latitude],
      zoom: 12,
      duration: 2500,
      essential: true,
    });
  }, [selectedSiteId]);

  const recenter = () => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      bearing: 0,
      pitch: 0,
      duration: 1800,
    });
  };

  return (
    <div className='atlas-map relative h-full w-full'>
      <Map
        ref={mapRef}
        reuseMaps
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={mapStyle}
        terrain={{ source: 'maptiler-terrain', exaggeration: 1.5 }}
        minZoom={4.5}
        attributionControl={{ compact: true }}
        onMove={(event) => setBearing(event.viewState.bearing)}
        onClick={onMapBackgroundClick}>
        <ScaleControl position='bottom-left' unit='metric' />

        {MARKER_DATA.map((marker, index) => {
          const isActive = marker.id === activeSiteId;

          return (
            <Marker key={marker.id} longitude={marker.longitude} latitude={marker.latitude} anchor='center'>
              <button
                type='button'
                aria-label={t(marker.nameKey)}
                onMouseEnter={() => onMarkerHoverChange(marker.id)}
                onMouseLeave={() => onMarkerHoverChange(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkerClick(marker.id);
                }}
                className='relative block cursor-pointer'>
                <span
                  className={`block rounded-full border-[3px] border-[#fffaf0] transition-all duration-200 ${
                    isActive ? 'bg-secondary-fixed size-[30px]' : 'bg-primary size-[22px]'
                  }`}
                  style={{
                    boxShadow: isActive ? '0 0 0 2px #2b1d12, 0 0 0 11px rgba(246,196,83,.35)' : '0 0 0 2px #2b1d12',
                  }}
                />
                <span className='bg-surface-bright border-on-background text-on-background absolute top-1/2 left-full ml-3 -translate-y-1/2 border-[1.5px] px-[7px] py-[3px] font-mono text-[11.5px] font-semibold tracking-[.06em] whitespace-nowrap uppercase'>
                  {formatTicketNumber(index)}
                  {isActive && ` ${t(marker.nameKey)}`}
                </span>
              </button>
            </Marker>
          );
        })}

        <Source id='maptiler-terrain' type='raster-dem' url={terrainSourceUrl} tileSize={512} maxzoom={14} />
      </Map>

      <div className='atlas-fade pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(43,29,18,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(43,29,18,.07)_1px,transparent_1px)] bg-size-[96px_96px]' />

      <button
        type='button'
        aria-label={t('mapPage.compass')}
        title={t('mapPage.compass')}
        onClick={() => mapRef.current?.resetNorthPitch({ duration: 800 })}
        className='absolute top-3 right-3 size-20 md:top-4 md:right-4 md:size-24'>
        <Compass bearing={bearing} />
      </button>

      <div className='border-on-background absolute right-3 bottom-12 flex flex-col divide-y-[1.5px] divide-[#2b1d12] border-[1.5px] md:right-4'>
        <button type='button' aria-label={t('mapPage.zoomIn')} onClick={() => mapRef.current?.zoomIn()} className={CONTROL}>
          +
        </button>
        <button type='button' aria-label={t('mapPage.zoomOut')} onClick={() => mapRef.current?.zoomOut()} className={CONTROL}>
          −
        </button>
        <button
          type='button'
          aria-label={t('mapPage.recenter')}
          title={t('mapPage.recenter')}
          onClick={recenter}
          className={CONTROL}>
          ⌖
        </button>
      </div>
    </div>
  );
}
