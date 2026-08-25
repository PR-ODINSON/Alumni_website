import { useEffect } from 'react';

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | IITRAM Alumni Network`;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    if (description) {
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = 'IITRAM Alumni Network';
    };
  }, [title, description]);
}
