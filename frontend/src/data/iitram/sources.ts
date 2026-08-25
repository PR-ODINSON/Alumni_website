import type { OfficialSource } from './types';

export const VERIFIED_DATE = '2026-08-25';

export const SOURCES = {
  homepage: {
    name: 'IITRAM Official Website',
    url: 'https://iitram.ac.in/',
    verifiedAt: VERIFIED_DATE,
  },
  aboutUs: {
    name: 'IITRAM Official Website — About Us',
    url: 'https://iitram.ac.in/about_us',
    verifiedAt: VERIFIED_DATE,
  },
  faq: {
    name: 'IITRAM Official Website — FAQ',
    url: 'https://iitram.ac.in/faq',
    verifiedAt: VERIFIED_DATE,
  },
  researchAreas: {
    name: 'IITRAM Official Website — Research Areas',
    url: 'https://www.iitram.ac.in/res_area',
    verifiedAt: VERIFIED_DATE,
  },
  coeBrochure: {
    name: 'IITRAM Official Website — CoE Laboratory Brochure',
    url: 'https://iitram.ac.in/frontend/Academics/Centers_of_Excellence/Consultancy/IITRAM_CoEs_Lab_brochure_2024.pdf',
    verifiedAt: VERIFIED_DATE,
  },
  ssdri: {
    name: 'IITRAM Official Website — CoE-SSDRI',
    url: 'https://iitram.ac.in/ssdri',
    verifiedAt: VERIFIED_DATE,
  },
  hostel: {
    name: 'IITRAM Official Website — Hostel',
    url: 'https://iitram.ac.in/hostel',
    verifiedAt: VERIFIED_DATE,
  },
  library: {
    name: 'IITRAM Official Website — Library',
    url: 'https://iitram.ac.in/library',
    verifiedAt: VERIFIED_DATE,
  },
  alumniAbout: {
    name: 'IITRAM Alumni Relations — About',
    url: 'https://alumni.iitram.ac.in/about',
    verifiedAt: VERIFIED_DATE,
  },
  alumniHome: {
    name: 'IITRAM Alumni Relations',
    url: 'https://alumni.iitram.ac.in/',
    verifiedAt: VERIFIED_DATE,
  },
  sitemap: {
    name: 'IITRAM Official Website — Sitemap',
    url: 'https://iitram.ac.in/sitemap',
    verifiedAt: VERIFIED_DATE,
  },
} satisfies Record<string, OfficialSource>;
