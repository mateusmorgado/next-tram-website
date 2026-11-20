/** English-only stand-in for the app's i18n module (the site is English). */
import en from '@app/i18n/en.ts';
type Params = Record<string, string | number>;
export function t(key: string, params: Params = {}): string {
  const raw = (en as Record<string, unknown>)[key];
  const s = typeof raw === 'string' ? raw : key;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}
