import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TerrainMap from '../../components/map';
import { MARKER_DATA } from '../../constants/markers';

function MapPage() {
  const { t } = useTranslation();
  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const selectedSite = useMemo(() => MARKER_DATA.find((site) => site.id === selectedSiteId) ?? null, [selectedSiteId]);

  const closeOverlayFromMap = () => {
    setHoveredSiteId(null);
    setSelectedSiteId(null);
  };

  return (
    <div className='relative h-screen w-full'>
      <div className='h-full w-full'>
        <TerrainMap
          selectedSiteId={selectedSiteId}
          hoveredSiteId={hoveredSiteId}
          onMarkerHoverChange={setHoveredSiteId}
          onMarkerClick={setSelectedSiteId}
          onMapBackgroundClick={closeOverlayFromMap}
        />
      </div>

      <div className='pointer-events-none absolute top-30 left-30 z-10 h-[80%]'>
        <div
          className='pointer-events-auto h-full w-80 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-40'
          onClick={(event) => event.stopPropagation()}>
          {selectedSite && (
            <div className='relative z-10 space-y-3'>
              <img
                src={selectedSite.thumbnail}
                alt={t(selectedSite.nameKey)}
                className='aspect-video w-full rounded-xl object-cover'
              />
              <h3 className='text-xl font-semibold text-white'>{t(selectedSite.nameKey)}</h3>
              <p className='text-sm leading-relaxed text-gray-100'>{t(selectedSite.descriptionKey)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapPage;
