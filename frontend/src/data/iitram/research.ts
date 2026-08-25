import type { ResearchCategory } from './types';
import { SOURCES } from './sources';

export const researchOverview = {
  summary:
    'The Institute is engaged in cutting-edge research in diverse areas across Basic Sciences, Civil Engineering, Electrical and Computer Science Engineering, Humanities and Social Sciences, and Mechanical and Aerospace Engineering.',
  source: SOURCES.researchAreas,
};

export const researchCategories: ResearchCategory[] = [
  {
    id: 'undergraduate-research',
    category: 'Research',
    title: 'Undergraduate Research',
    description:
      'IITRAM promotes R&D through Centers of Excellence (CoEs), innovation cells, and faculty-guided projects. UG students can participate in research and innovation.',
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.faq,
  },
  {
    id: 'graduate-research',
    category: 'Research',
    title: 'Graduate Research',
    description:
      'Ph.D. program includes coursework and research components. Applications are invited twice a year (Autumn and Spring) with selection through written test and/or interview.',
    officialUrl: 'https://iitram.ac.in/faq',
    source: SOURCES.faq,
  },
  {
    id: 'research-areas',
    category: 'Research',
    title: 'Research Areas',
    description:
      'Research spans departments including Basic Sciences, Civil Engineering, Electrical and Computer Science Engineering, Humanities and Social Sciences, and Mechanical and Aerospace Engineering.',
    officialUrl: 'https://www.iitram.ac.in/res_area',
    source: SOURCES.researchAreas,
  },
  {
    id: 'research-publications',
    category: 'Research',
    title: 'Research Publications',
    description:
      'According to IITRAM\'s official website, the institute has 1285+ research publications (verified 2026-08-25).',
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.homepage,
  },
  {
    id: 'research-facilities',
    category: 'Research',
    title: 'Research Facilities',
    description:
      'IITRAM offers state-of-the-art laboratories and training facilities, including instrumentation facilities and CoE laboratories.',
    officialUrl: 'https://iitram.ac.in/frontend/Academics/Centers_of_Excellence/Consultancy/IITRAM_CoEs_Lab_brochure_2024.pdf',
    source: SOURCES.coeBrochure,
  },
  {
    id: 'research-collaborations',
    category: 'Research',
    title: 'Research Collaborations',
    description:
      'CoE-SSDRI fosters collaboration among academia, industry, and policymakers for infrastructure research and innovation.',
    officialUrl: 'https://iitram.ac.in/ssdri',
    source: SOURCES.ssdri,
  },
  {
    id: 'funding-opportunities',
    category: 'Research',
    title: 'Funding Opportunities',
    description:
      'According to IITRAM\'s official website, the institute has 32+ funded research projects (verified 2026-08-25).',
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.homepage,
  },
  {
    id: 'research-projects',
    category: 'Research',
    title: 'Research Projects',
    description:
      'The CoEs conduct extensive research on advance topics and current/futuristic problems in their respective domains.',
    officialUrl: 'https://iitram.ac.in/frontend/Academics/Centers_of_Excellence/Consultancy/IITRAM_CoEs_Lab_brochure_2024.pdf',
    source: SOURCES.coeBrochure,
  },
  {
    id: 'office-of-rd',
    category: 'Research',
    title: 'Office of R&D',
    description:
      'For enquiries regarding Centres of Excellence and research: dean_research@iitram.ac.in, Phone: +91-79-67775430.',
    officialUrl: 'https://iitram.ac.in/frontend/Academics/Centers_of_Excellence/Consultancy/IITRAM_CoEs_Lab_brochure_2024.pdf',
    source: SOURCES.coeBrochure,
  },
];
