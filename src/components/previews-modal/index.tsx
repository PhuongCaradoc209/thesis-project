import { CaretLeftIcon, CaretRightIcon, InfoIcon, XIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useTourismStore } from '../../store/useTourismStore';
import { getArtifactPreviewConfig } from './artifact-config';
import { ModelPreviewCanvas } from './ModelPreviewCanvas';

function InspectModal() {
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);
  const clear = useTourismStore((state) => state.clear);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const previewConfig = getArtifactPreviewConfig(selectedArtifactId);

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className='absolute inset-0 z-20'
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={clear}>
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className='relative flex h-full w-full flex-col overflow-hidden bg-white text-slate-50 shadow-2xl'
          exit={{ opacity: 0, scale: 0.98, y: 18 }}
          initial={{ opacity: 0, scale: 0.985, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}>
          <motion.header
            animate={{ opacity: 1, y: 0 }}
            className='relative z-10 flex h-18 items-center justify-between border-b border-white/10 px-4 md:px-6'
            initial={{ opacity: 0, y: -16 }}
            transition={{ delay: 0.08, duration: 0.26 }}>
            <div className='flex min-w-0 items-center gap-3 md:gap-6'>
              <h1 className='logo text-primary text-3xl font-bold uppercase'>Heritage</h1>
              {/* <nav className='flex min-w-0 items-center gap-2 overflow-x-auto'>
                <button className='rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-sm font-medium text-cyan-50 transition-colors hover:bg-cyan-300/18'>
                  Overview
                </button>
                <button className='rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/10'>
                  Materials
                </button>
                <button className='rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/10'>
                  Notes
                </button>
              </nav> */}
            </div>

            <button
              className='bg-button-primary hover:bg-primary cursor-pointer rounded-full p-2 transition-colors'
              onClick={clear}>
              <XIcon size={20} className='transition-colors hover:text-slate-200' color='white' />
            </button>
          </motion.header>

          <div className='relative flex min-h-0 flex-1 overflow-hidden'>
            <motion.section
              animate={{ opacity: 1, x: 0 }}
              className='relative min-w-0 flex-1 border-r border-white/8'
              initial={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.14, duration: 0.32 }}>
              <div className='flex h-full min-h-0 flex-col bg-slate-950/38'>
                <div className='relative min-h-0 flex-1 overflow-hidden border-white/10 bg-slate-900/70'>
                  {previewConfig ? (
                    <ModelPreviewCanvas modelUrl={previewConfig.modelUrl} cameraPosition={previewConfig.cameraPosition} />
                  ) : (
                    <div className='flex h-full items-center justify-center border border-dashed border-white/15 bg-slate-950/40 px-6 text-center text-slate-400'>
                      Khong tim thay cau hinh review cho hien vat nay.
                    </div>
                  )}

                  <div className='bg-contrast/70 absolute top-3 left-6 space-y-1 rounded-xl border-gray-200 px-6 py-4'>
                    <h2 className='title truncate text-lg font-semibold text-white italic md:text-xl'>
                      {previewConfig?.title ?? 'Artifact preview'}
                    </h2>
                    {previewConfig?.type && <span className='text-secondary text-sm uppercase'>{previewConfig.type}</span>}
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.aside
              animate={{ width: isPanelCollapsed ? 28 : 360 }}
              className='relative flex h-full shrink-0 border-l bg-gray-100 backdrop-blur-xl'
              initial={false}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <button
                aria-label={isPanelCollapsed ? 'Expand tools panel' : 'Collapse tools panel'}
                className='bg-button-primary hover:bg-primary absolute top-1/2 -left-4 z-20 flex h-14 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-slate-100 shadow-lg transition-colors'
                onClick={() => setIsPanelCollapsed((previous) => !previous)}>
                {isPanelCollapsed ? <CaretLeftIcon size={18} /> : <CaretRightIcon size={18} />}
              </button>

              <AnimatePresence initial={false} mode='wait'>
                {!isPanelCollapsed ? (
                  <motion.div
                    key='panel-open'
                    animate={{ opacity: 1, x: 0 }}
                    className='flex h-full w-full min-w-0 flex-col overflow-y-auto p-4 md:p-5'
                    exit={{ opacity: 0, x: 24 }}
                    initial={{ opacity: 0, x: 32 }}
                    transition={{ duration: 0.22 }}>
                    <div className='flex items-center gap-2'>
                      <InfoIcon size={20} className='text-primary' />
                      <p className='title text-primary text-xl'>Thống kê di vật</p>
                    </div>
                    <p className='text-subtle mt-1 text-sm uppercase'>
                      Cổ vật <span>{previewConfig?.dynasty ?? 'Chưa rõ'}</span>
                    </p>

                    <div className='border-l-contrast mt-6 border-l-4 pl-2'>
                      <p className='text-neutral-900'>
                        Chất liệu: <span>{previewConfig?.material ?? 'Chưa rõ'}</span>
                      </p>
                    </div>
                    <div className='border-l-contrast mt-6 border-l-4 pl-2'>
                      <p className='text-neutral-900'>
                        Năm <span>{previewConfig?.year ?? 'Chưa rõ'}</span>
                      </p>
                    </div>

                    <div className='mt-4 rounded-md bg-[#FFF1EA] p-2 text-neutral-900'>
                      <p className='mt-1 text-sm leading-6'>{previewConfig?.history ?? 'Chưa có thông tin.'}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key='panel-collapsed'
                    animate={{ opacity: 1 }}
                    className='flex h-full w-full items-center justify-center'
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}>
                    <div className='-rotate-90 text-[0.7rem] tracking-[0.35em] whitespace-nowrap text-slate-400 uppercase'>
                      Review panel
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.aside>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default InspectModal;
