export type LocalizedText = string | { vi?: string; en?: string };

export function pickLang(text: LocalizedText | undefined, language: string): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  const wanted = language.startsWith('en') ? text.en : text.vi;
  return wanted || text.vi || text.en || '';
}
