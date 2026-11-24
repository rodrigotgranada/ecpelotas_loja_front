import type { MetadataRoute } from 'next';
import { PDV_BASE_PATH } from '@/features/pdv';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [PDV_BASE_PATH, `${PDV_BASE_PATH}/`],
    },
  };
}
