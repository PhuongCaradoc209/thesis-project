type InteractionPromptProps = {
  label: string;
};

export function InteractionPrompt({ label }: InteractionPromptProps) {
  return (
    <div className='bg-surface-bright border-on-background text-on-background flex w-max max-w-[16rem] items-center gap-2.5 border-[1.5px] py-1.5 pr-3 pl-1.5'>
      <kbd className='bg-primary text-on-primary border-on-background flex h-7 min-w-7 shrink-0 items-center justify-center border-[1.5px] border-b-[3px] px-1.5 font-mono text-[13px] font-semibold'>
        F
      </kbd>
      <span className='line-clamp-2 text-sm leading-snug font-semibold' title={label}>
        {label}
      </span>
    </div>
  );
}
