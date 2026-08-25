import type { InstituteNavItem } from './types';

export const instituteNavItems: InstituteNavItem[] = [
  {
    label: 'About IITRAM',
    href: '/institute/about',
    description: 'Vision, mission, and institutional background',
  },
  {
    label: 'Academics',
    href: '/institute/academics',
    description: 'Programs from B.Tech. to Ph.D. and add-on degrees',
  },
  {
    label: 'Departments',
    href: '/institute/departments',
    description: 'Five academic departments and schools',
  },
  {
    label: 'Research',
    href: '/institute/research',
    description: 'Research areas, facilities, and innovation',
  },
  {
    label: 'Centers of Excellence',
    href: '/institute/centers',
    description: 'CoEs in AI/ML, drones, defence, and more',
  },
  {
    label: 'Student Life',
    href: '/institute/student-life',
    description: 'Clubs, activities, and campus engagement',
  },
  {
    label: 'Campus & Facilities',
    href: '/institute/campus',
    description: 'Hostel, library, labs, and infrastructure',
  },
  {
    label: 'Alumni Relations',
    href: '/institute/alumni-relations',
    description: 'Official alumni office and engagement',
  },
];

export const homepageInstituteSections = [
  {
    title: 'About IITRAM',
    summary:
      'A Government Autonomous University established by Government of Gujarat, focused on infrastructure, technology, research, and management.',
    href: '/institute/about',
    cta: 'Explore IITRAM',
  },
  {
    title: 'Academics',
    summary:
      'B.Tech., M.Tech., and Ph.D. programs across engineering, sciences, and humanities with NEP 2020 aligned CBCS.',
    href: '/institute/academics',
    cta: 'Explore Academics',
  },
  {
    title: 'Research & Innovation',
    summary:
      'Cutting-edge research across departments, funded projects, and Centres of Excellence.',
    href: '/institute/research',
    cta: 'Explore Research',
  },
  {
    title: 'Campus Life',
    summary:
      'Residential campus with hostels, clubs, sports, and student activities across 10+ clubs.',
    href: '/institute/student-life',
    cta: 'Explore Campus',
  },
  {
    title: 'Alumni Relations',
    summary:
      'Connect with IITRAM through the official Alumni Relations Office in Ahmedabad.',
    href: '/institute/alumni-relations',
    cta: 'Connect with IITRAM',
  },
];

export * from './types';
export * from './sources';
export * from './institute';
export * from './history';
export * from './statistics';
export * from './programs';
export * from './departments';
export * from './centers';
export * from './research';
export * from './studentLife';
export * from './facilities';
export * from './alumni';
export * from './contact';
