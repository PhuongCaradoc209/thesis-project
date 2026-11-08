import { BookOpenIcon, GearSixIcon, MapTrifoldIcon, type Icon } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type TourToolbarProps = {
  visible: boolean;
  shortcutsEnabled: boolean;
  showJournal: boolean;
  isMapOpen: boolean;
  isJournalOpen: boolean;
  isSettingsOpen: boolean;
  onToggleMap: () => void;
  onToggleJournal: () => void;
  onToggleSettings: () => void;
};

type ToolbarButtonProps = {
  icon: Icon;
  label: string;
  shortcut: string;
  active: boolean;
  onClick: () => void;
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function ToolbarButton({ icon: ButtonIcon, label, shortcut, active, onClick }: ToolbarButtonProps) {
  return (
    <button
      type='button'
      aria-pressed={active}
      aria-keyshortcuts={shortcut}
      aria-label={label}
      className={`group border-on-background relative grid size-13 place-items-center border-[1.5px] transition-colors ${
        active ? 'bg-primary text-on-primary' : 'bg-surface-bright text-on-background hover:bg-surface-container-high'
      }`}
      onClick={onClick}>
      <ButtonIcon size={22} />
      <kbd className='bg-surface-bright border-on-background text-on-background absolute -right-1.5 -bottom-1.5 border-[1.5px] border-b-[3px] px-1 font-mono text-[10px] leading-4 font-semibold'>
        {shortcut}
      </kbd>
      <span className='bg-on-background text-background pointer-events-none absolute right-full mr-2.5 hidden px-2.5 py-1.5 font-mono text-xs whitespace-nowrap group-hover:block group-focus-visible:block'>
        {label}
      </span>
    </button>
  );
}

export function TourToolbar({
  visible,
  shortcutsEnabled,
  showJournal,
  isMapOpen,
  isJournalOpen,
  isSettingsOpen,
  onToggleMap,
  onToggleJournal,
  onToggleSettings,
}: TourToolbarProps) {
  const { t } = useTranslation();

  // Dùng event.code (vị trí phím) để phím tắt vẫn đúng khi bật bộ gõ tiếng Việt
  useEffect(() => {
    if (!shortcutsEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || isEditableTarget(event.target)) return;

      // Khi một panel đang mở, chỉ phím của chính panel đó mới đóng được nó
      if (event.code === 'KeyM' && !isJournalOpen && !isSettingsOpen) onToggleMap();
      if (event.code === 'KeyJ' && showJournal && !isSettingsOpen) onToggleJournal();
      if (event.code === 'KeyO' && !isJournalOpen) onToggleSettings();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJournalOpen, isSettingsOpen, onToggleJournal, onToggleMap, onToggleSettings, shortcutsEnabled, showJournal]);

  if (!visible) return null;

  return (
    <nav
      aria-label={t('toolbar.label')}
      className={`absolute bottom-4 flex flex-col gap-2.5 md:bottom-6 ${
        // Khi Cài đặt mở: nằm trên lớp phủ, bên trái ngăn kéo rộng 25rem; màn hẹp thì ngăn kéo chiếm hết nên ẩn đi
        isSettingsOpen ? 'right-106 z-55 max-sm:hidden' : 'right-4 z-30 md:right-6'
      }`}>
      <ToolbarButton icon={MapTrifoldIcon} label={t('toolbar.map')} shortcut='M' active={isMapOpen} onClick={onToggleMap} />
      {showJournal && (
        <ToolbarButton
          icon={BookOpenIcon}
          label={t('toolbar.journal')}
          shortcut='J'
          active={isJournalOpen}
          onClick={onToggleJournal}
        />
      )}
      <ToolbarButton
        icon={GearSixIcon}
        label={t('toolbar.settings')}
        shortcut='O'
        active={isSettingsOpen}
        onClick={onToggleSettings}
      />
    </nav>
  );
}
