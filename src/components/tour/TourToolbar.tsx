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
      className={`flex min-h-11 items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-semibold shadow-[0_8px_24px_rgba(20,12,7,0.2)] transition-colors ${
        active
          ? 'border-primary bg-primary text-on-primary'
          : 'text-on-surface border-[#b69462]/55 bg-[#f3e7cf] hover:bg-[#f8edd9]'
      }`}
      onClick={onClick}>
      <ButtonIcon size={20} className={active ? '' : 'text-primary'} />
      {label}
      <kbd
        className={`rounded border px-1.5 font-sans text-[0.7rem] ${
          active ? 'border-primary-fixed/50 text-primary-fixed' : 'text-on-surface-variant border-amber-950/25'
        }`}>
        {shortcut}
      </kbd>
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
      className={`absolute bottom-4 flex items-center gap-2 ${
        // Khi Cài đặt mở: nằm trên lớp phủ, bên trái ngăn kéo rộng 25rem; màn hẹp thì ngăn kéo chiếm hết nên ẩn đi
        isSettingsOpen ? 'right-106 z-55 max-sm:hidden' : 'right-4 z-30'
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
