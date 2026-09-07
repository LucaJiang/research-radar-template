import settings from '../../site.config.json';
export const site = settings;
export const t = (zh: string, en: string) => site.language === 'zh-CN' ? zh : en;
export const withBase = (path: string) => /^(?:[a-z]+:|\/\/|#)/i.test(path)
  ? path : import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');
