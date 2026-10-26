type InteractionPromptProps = {
  label: string;
};

export function InteractionPrompt({ label }: InteractionPromptProps) {
  return (
    <div className='text-on-surface flex items-center gap-2.5 rounded-full border border-[#b69462]/55 bg-[#f3e7cf] py-1.5 pr-4 pl-1.5 whitespace-nowrap shadow-[0_8px_24px_rgba(20,12,7,0.25)]'>
      <kbd className='bg-primary text-on-primary flex h-7 w-7 items-center justify-center rounded-full font-sans text-sm font-bold'>
        F
      </kbd>
      <span className='font-headline text-[15px]'>{label}</span>
    </div>
  );
}
