import { ArrowCounterClockwiseIcon, CaretDownIcon, XIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  QUALITY_LEVELS,
  SHADOW_QUALITIES,
  WALK_SPEEDS,
  matchGraphicsPreset,
  type GraphicsPreset,
} from '../../constants/settings';
import { useSettingsStore } from '../../store/useSettingsStore';

type SettingsPanelProps = {
  onClose: () => void;
  onReplayControls: () => void;
};

type SegmentedOption<T extends string> = { value: T; label: string };

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div role='radiogroup' aria-label={label} className='flex bg-[#ead7b5] p-0.5'>
      {options.map((option) => (
        <button
          key={option.value}
          type='button'
          role='radio'
          aria-checked={option.value === value}
          className={`flex-1 px-2.5 py-1.5 text-xs font-semibold transition-colors ${
            option.value === value ? 'text-primary bg-[#fff8f5]' : 'text-on-surface-variant hover:bg-white/40'
          }`}
          onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type='button'
      role='switch'
      aria-label={label}
      aria-checked={checked}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-amber-950/25'}`}
      onClick={() => onChange(!checked)}>
      <span
        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-[#fff8f5] transition-transform ${checked ? 'translate-x-5' : ''}`}
      />
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='py-2'>
      <p className='mb-1.5 text-[13px] font-semibold'>{label}</p>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className='flex items-center justify-between gap-4 py-2'>
      <div>
        <p className='text-[13px] font-semibold'>{label}</p>
        <p className='text-on-surface-variant mt-0.5 text-xs leading-5'>{hint}</p>
      </div>
      <Toggle label={label} checked={checked} onChange={onChange} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='border-on-background/20 border-b py-5 last:border-b-0'>
      <h3 className='text-secondary mb-3 text-[0.7rem] font-semibold tracking-[0.24em] uppercase'>{title}</h3>
      {children}
    </section>
  );
}

export function SettingsPanel({ onClose, onReplayControls }: SettingsPanelProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const graphics = useSettingsStore((state) => state.graphics);
  const walkSpeed = useSettingsStore((state) => state.walkSpeed);
  const headBob = useSettingsStore((state) => state.headBob);
  const applyPreset = useSettingsStore((state) => state.applyPreset);
  const setGraphics = useSettingsStore((state) => state.setGraphics);
  const setWalkSpeed = useSettingsStore((state) => state.setWalkSpeed);
  const setHeadBob = useSettingsStore((state) => state.setHeadBob);
  const resetDefaults = useSettingsStore((state) => state.resetDefaults);
  const activePreset = matchGraphicsPreset(graphics);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(activePreset === 'custom');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const levelOptions = QUALITY_LEVELS.map((level) => ({ value: level, label: t(`settings.levels.${level}`) }));

  return (
    <motion.div
      className='absolute inset-0 z-50 flex justify-end'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      {/* Lớp phủ làm mờ cảnh phía sau; bấm vào để đóng */}
      <button
        type='button'
        aria-label={t('settings.close')}
        className='absolute inset-0 cursor-default bg-[#170f09]/35 backdrop-blur-[3px]'
        onClick={onClose}
      />

      <motion.aside
        role='dialog'
        aria-modal='true'
        aria-labelledby='settings-title'
        className='text-on-surface border-on-background bg-surface-bright relative flex h-full w-[min(25rem,100vw)] flex-col border-l-[1.5px]'
        initial={reduceMotion ? false : { x: '100%' }}
        animate={{ x: 0 }}
        exit={reduceMotion ? undefined : { x: '100%' }}
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}>
        <header className='border-on-background/20 flex items-start justify-between border-b px-7 pt-6 pb-4'>
          <div>
            <h2 id='settings-title' className='font-headline text-primary text-2xl font-semibold'>
              {t('settings.title')}
            </h2>
            <div className='mt-2 flex items-center gap-1.5' aria-hidden='true'>
              <span className='bg-secondary h-px w-10' />
              <span className='border-secondary h-1.5 w-1.5 rotate-45 border' />
            </div>
          </div>
          <button
            type='button'
            aria-label={t('settings.close')}
            className='text-on-surface-variant p-2 transition-colors hover:bg-amber-950/5'
            onClick={onClose}>
            <XIcon size={18} />
          </button>
        </header>

        <div className='flex-1 overflow-y-auto px-7'>
          <Section title={t('settings.graphics.title')}>
            <div role='radiogroup' aria-label={t('settings.graphics.title')} className='grid grid-cols-3 gap-2'>
              {QUALITY_LEVELS.map((preset: GraphicsPreset) => (
                <button
                  key={preset}
                  type='button'
                  role='radio'
                  aria-checked={activePreset === preset}
                  className={`border px-2 py-3 text-sm font-semibold transition-colors ${
                    activePreset === preset
                      ? 'border-primary bg-primary text-on-primary'
                      : 'text-on-surface border-on-background/30 bg-surface-bright hover:border-on-background'
                  }`}
                  onClick={() => applyPreset(preset)}>
                  {t(`settings.graphics.presets.${preset}`)}
                </button>
              ))}
            </div>
            <p className='text-on-surface-variant mt-2.5 text-[13px] leading-5'>
              {activePreset === 'custom' && (
                <span className='text-primary mr-1 font-semibold'>{t('settings.graphics.presets.custom')}.</span>
              )}
              {t(`settings.graphics.presetDescriptions.${activePreset}`)}
            </p>

            <button
              type='button'
              aria-expanded={isAdvancedOpen}
              className='mt-3 flex w-full items-center justify-between py-1.5 text-sm font-semibold transition-colors hover:text-amber-950'
              onClick={() => setIsAdvancedOpen((open) => !open)}>
              {t('settings.graphics.advanced')}
              <CaretDownIcon size={16} className={`transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence initial={false}>
              {isAdvancedOpen && (
                <motion.div
                  className='overflow-hidden'
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}>
                  <Field label={t('settings.graphics.resolution')}>
                    <Segmented
                      label={t('settings.graphics.resolution')}
                      value={graphics.resolution}
                      options={levelOptions}
                      onChange={(resolution) => setGraphics({ resolution })}
                    />
                  </Field>
                  <Field label={t('settings.graphics.shadows')}>
                    <Segmented
                      label={t('settings.graphics.shadows')}
                      value={graphics.shadows}
                      options={SHADOW_QUALITIES.map((level) => ({ value: level, label: t(`settings.levels.${level}`) }))}
                      onChange={(shadows) => setGraphics({ shadows })}
                    />
                  </Field>
                  <ToggleRow
                    label={t('settings.graphics.ambientOcclusion')}
                    hint={t('settings.graphics.ambientOcclusionHint')}
                    checked={graphics.ambientOcclusion}
                    onChange={(ambientOcclusion) => setGraphics({ ambientOcclusion })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Section>

          <Section title={t('settings.controls.title')}>
            <Field label={t('settings.controls.walkSpeed')}>
              <Segmented
                label={t('settings.controls.walkSpeed')}
                value={walkSpeed}
                options={WALK_SPEEDS.map((speed) => ({ value: speed, label: t(`settings.controls.speeds.${speed}`) }))}
                onChange={setWalkSpeed}
              />
            </Field>
            <button
              type='button'
              className='border-secondary/50 text-secondary mt-2 w-full border px-4 py-2.5 text-[13px] font-semibold transition-colors hover:bg-white/30'
              onClick={onReplayControls}>
              {t('settings.controls.replayOnboarding')}
            </button>
          </Section>

          <Section title={t('settings.comfort.title')}>
            <ToggleRow
              label={t('settings.comfort.headBob')}
              hint={t('settings.comfort.headBobHint')}
              checked={headBob}
              onChange={setHeadBob}
            />
          </Section>
        </div>

        <footer className='border-on-background/20 flex justify-end border-t bg-[#ead7b5] px-7 py-3'>
          <button
            type='button'
            className='text-on-surface-variant flex items-center gap-2 px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-white/30'
            onClick={resetDefaults}>
            <ArrowCounterClockwiseIcon size={16} />
            {t('settings.reset')}
          </button>
        </footer>
      </motion.aside>
    </motion.div>
  );
}
