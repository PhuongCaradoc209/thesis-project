// Chữ trên Firestore có thể là chuỗi thường (hiện vật cũ) hoặc song ngữ { vi, en } (hiện vật mới)
export type LocalizedText = string | { vi?: string; en?: string };

// Lấy chữ theo ngôn ngữ đang dùng; thiếu bản dịch thì lấy bản còn lại
export function pickLang(text: LocalizedText | undefined, language: string): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  const wanted = language.startsWith('en') ? text.en : text.vi;
  return wanted || text.vi || text.en || '';
}
