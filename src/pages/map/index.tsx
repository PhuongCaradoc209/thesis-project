import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TerrainMap from '../../components/map';
import { MapTicket, MapTicketStrip } from '../../components/map/MapTicket';
import { MARKER_DATA } from '../../constants/markers';
import { formatTicketNumber } from '../../constants/siteDetails';

const TICKET_SPRING = { type: 'spring', stiffness: 320, damping: 30 } as const;

const SEARCH_LANGUAGES = ['vi', 'en'] as const;

// Bỏ dấu tiếng Việt và chữ hoa để "tu duc" khớp với "Tự Đức"
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

  const filteredSites = useMemo(() => {
    const keyword = normalizeSearchValue(searchKeyword);
    if (!keyword) return MARKER_DATA;
    // So khớp cả tên tiếng Việt và tiếng Anh, không phụ thuộc ngôn ngữ đang chọn
    return MARKER_DATA.filter((site) =>
      SEARCH_LANGUAGES.some((lng) => normalizeSearchValue(t(site.nameKey, { lng })).includes(keyword)),
    );
  }, [searchKeyword, t]);

  const ticketSiteId =
    selectedSiteId && filteredSites.some((site) => site.id === selectedSiteId)
      ? selectedSiteId
      : (filteredSites[0]?.id ?? selectedSiteId ?? MARKER_DATA[0].id);
  const activeSiteId = hoveredSiteId ?? ticketSiteId;

  useEffect(() => {
    const marker = MARKER_DATA.find((site) => site.id === activeSiteId);
    if (!marker) return;

    const loadingBackground = new Image();
    loadingBackground.src = marker.loadingBackground ?? marker.thumbnail;
  }, [activeSiteId]);

  const clearSelection = () => {
    setHoveredSiteId(null);
    setSelectedSiteId(null);
  };

  return (
    <div className='bg-background text-on-background grid min-h-svh overflow-x-clip bg-[url(/common/image/paper.webp)] bg-cover bg-center pt-17 lg:h-svh lg:grid-cols-[500px_1fr]'>
      <aside className='annotation-scrollbar border-on-background/85 order-2 px-5 py-7 md:px-10 lg:order-1 lg:overflow-x-hidden lg:overflow-y-auto lg:border-r-[1.5px] lg:pt-8 lg:pr-9'>
        <div className='text-on-surface-variant font-mono text-[12.5px] tracking-[.12em] uppercase'>
          {t('mapPage.label', { count: MARKER_DATA.length })}
        </div>
        <h1 className='font-headline mt-3.5 text-[42px] leading-[1.15] font-extrabold uppercase [font-stretch:75%] md:text-[50px]'>
          {t('mapPage.title')}
          <br />
          <span className='text-primary'>{t('mapPage.titleAccent')}</span>
        </h1>

        <label className='border-on-background bg-surface-bright focus-within:bg-surface-container-high mt-6 flex items-center gap-2.5 border-[1.5px] px-3.5 py-2.5 transition-colors'>
          <MagnifyingGlassIcon size={18} className='text-on-surface-variant shrink-0' aria-hidden />
          <input
            type='search'
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && filteredSites[0]) setSelectedSiteId(filteredSites[0].id);
            }}
            placeholder={t('mapPage.searchPlaceholder')}
            aria-label={t('mapPage.searchPlaceholder')}
            className='placeholder:text-on-surface-variant w-full bg-transparent font-mono text-sm tracking-[.04em] outline-none'
          />
        </label>

        <div className='mt-3.5 flex flex-col gap-3.5'>
          {filteredSites.length === 0 && (
            <p className='text-on-surface-variant border-on-background/40 border-[1.5px] border-dashed px-4 py-5 font-mono text-[13px]'>
              {t('mapPage.noResults')}
            </p>
          )}
          {filteredSites.map((marker) => {
            const index = MARKER_DATA.indexOf(marker);
            const isOpen = marker.id === ticketSiteId;

            return (
              <motion.div key={marker.id} layout transition={TICKET_SPRING}>
                <AnimatePresence mode='wait' initial={false}>
                  <motion.div
                    key={isOpen ? 'ticket' : 'strip'}
                    layout
                    initial={isOpen ? { opacity: 0, y: 28, rotate: -2, scale: 0.96 } : { opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
                    transition={TICKET_SPRING}>
                    {isOpen ? (
                      <MapTicket marker={marker} no={formatTicketNumber(index)} onHoverChange={setHoveredSiteId} />
                    ) : (
                      <MapTicketStrip
                        marker={marker}
                        no={formatTicketNumber(index)}
                        onSelect={setSelectedSiteId}
                        onHoverChange={setHoveredSiteId}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </aside>

      <div className='order-1 h-[62svh] p-3 md:p-6 lg:order-2 lg:h-auto lg:min-h-0 lg:py-6.5 lg:pr-7.5 lg:pl-8.5'>
        <div className='relative h-full'>
          <TerrainMap
            selectedSiteId={selectedSiteId}
            activeSiteId={activeSiteId}
            onMarkerHoverChange={setHoveredSiteId}
            onMarkerClick={setSelectedSiteId}
            onMapBackgroundClick={clearSelection}
          />
        </div>
      </div>
    </div>
  );
}

export default MapPage;
