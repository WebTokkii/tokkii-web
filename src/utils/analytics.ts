/**
 * Utilidad para enviar eventos personalizados a Google Analytics 4.
 * Asegúrate de que el script de gtag.js esté cargado en index.html.
 */

declare global {
  interface Window {
    gtag: (command: string, action: string, params?: object) => void;
  }
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.warn('Google Analytics (gtag) no está cargado.');
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};
