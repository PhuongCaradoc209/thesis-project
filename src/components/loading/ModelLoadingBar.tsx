type ModelLoadingBarProps = {
  label: string;
};

export default function ModelLoadingBar({ label }: ModelLoadingBarProps) {
  return (
    <div
      role='status'
      aria-label={label}
      className='bg-primary/10 pointer-events-none absolute right-0 bottom-0 left-0 h-[3px] overflow-hidden'>
      <div className='model-loading-bar h-full w-2/5 bg-gradient-to-r from-transparent via-[#e9c400] to-[#9e0027]' />
      <span className='sr-only'>{label}</span>
    </div>
  );
}
