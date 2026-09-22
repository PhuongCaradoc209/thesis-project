import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TerrainMap from '../../components/map';
import { MARKER_DATA } from '../../constants/markers';

const normalizeSearchValue = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/g, 'd')
    .replace(/\u0110/g, 'D')
    .toLocaleLowerCase()
    .trim();

function MapPage() {
  const { t } = useTranslation();
  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const selectedSite = useMemo(() => MARKER_DATA.find((site) => site.id === selectedSiteId) ?? null, [selectedSiteId]);
  const filteredSites = useMemo(() => {
    const normalizedKeyword = normalizeSearchValue(searchKeyword);

    if (!normalizedKeyword) {
      return MARKER_DATA;
    }

    return MARKER_DATA.filter((site) => normalizeSearchValue(t(site.nameKey)).includes(normalizedKeyword));
  }, [searchKeyword, t]);

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
          className='pointer-events-auto relative h-full w-[26rem] overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-40'
          onClick={(event) => event.stopPropagation()}>
          <div className='relative z-10 flex h-full flex-col gap-4'>
            <div className='relative'>
              <MagnifyingGlassIcon
                size={18}
                className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/70'
              />
              <input
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder='Tim kiem dia diem...'
                className='w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-4 pl-11 text-sm text-white outline-none placeholder:text-white/60 focus:border-white/40'
              />
            </div>

            <div className='flex-1 space-y-3 overflow-y-auto pr-1'>
              {filteredSites.map((site) => {
                const isActive = site.id === selectedSite?.id;

                return (
                  <button
                    key={site.id}
                    type='button'
                    onClick={() => setSelectedSiteId(site.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                      isActive
                        ? 'border-white/40 bg-white/20 shadow-lg'
                        : 'border-white/10 bg-black/15 hover:border-white/30 hover:bg-white/12'
                    }`}>
                    <img src={site.thumbnail} alt={t(site.nameKey)} className='h-24 w-32 rounded-xl object-cover' />

                    <div className='min-w-0 space-y-2'>
                      <h3 className='line-clamp-2 text-base font-semibold text-white'>{t(site.nameKey)}</h3>
                      <p className='line-clamp-3 text-sm leading-relaxed text-gray-100'>{t(site.descriptionKey)}</p>
                    </div>
                  </button>
                );
              })}

              {filteredSites.length === 0 && (
                <div className='rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-white/80'>
                  Khong tim thay dia diem phu hop.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
