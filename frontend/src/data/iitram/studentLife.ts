import type { StudentClub } from './types';
import { SOURCES } from './sources';

export const studentLifeOverview = {
  title: 'Office of Student Activities, Involvement & Leadership',
  description:
    'The Office of Student Activities, Involvement & Leadership complements students\' academic experiences by providing services and resources that engage students in creating campus culture through various student clubs. Currently, it mentors and funds over 10+ student clubs, organizing more than 40+ events throughout the academic year.',
  source: SOURCES.homepage,
};

export const studentClubs: StudentClub[] = [
  // Sports & Games
  { id: 'chess', name: 'Chess Club', category: 'sports', source: SOURCES.homepage },
  { id: 'kabaddi', name: 'Kabaddi Club', category: 'sports', source: SOURCES.homepage },
  { id: 'gymnasium', name: 'Gymnasium', category: 'sports', source: SOURCES.homepage },
  { id: 'ski', name: 'SKI', category: 'sports', source: SOURCES.homepage },
  // Literary & Cultural
  { id: 'fine-arts', name: 'Fine Arts', category: 'literary-cultural', source: SOURCES.homepage },
  { id: 'performing-arts', name: 'Performing Arts', category: 'literary-cultural', source: SOURCES.homepage },
  { id: 'singers', name: 'Singers Club', category: 'literary-cultural', source: SOURCES.homepage },
  { id: 'drama', name: 'Drama Club', category: 'literary-cultural', source: SOURCES.homepage },
  { id: 'nest', name: 'NEST Club', category: 'literary-cultural', source: SOURCES.homepage },
  { id: 'ink', name: 'INK', category: 'literary-cultural', source: SOURCES.homepage },
  { id: 'dayatva', name: 'Dayatva', category: 'literary-cultural', source: SOURCES.homepage },
  { id: 'economics', name: 'Economics Club', category: 'literary-cultural', source: SOURCES.homepage },
  { id: 'nss', name: 'NSS', category: 'literary-cultural', source: SOURCES.homepage },
  // Science & Technology
  { id: 'coding', name: 'Coding Club', category: 'science-technology', source: SOURCES.homepage },
  { id: 'robotics', name: 'Robotics & Aeromodelling Club', category: 'science-technology', source: SOURCES.homepage },
];

export const studentLifeCategories = {
  sports: { label: 'Sports & Games', clubs: studentClubs.filter((c) => c.category === 'sports') },
  literaryCultural: {
    label: 'Literary & Cultural',
    clubs: studentClubs.filter((c) => c.category === 'literary-cultural'),
  },
  scienceTechnology: {
    label: 'Science & Technology',
    clubs: studentClubs.filter((c) => c.category === 'science-technology'),
  },
};

export const extracurricularActivities = {
  description:
    'IITRAM actively supports student engagement through cultural clubs, technical events, NSS, and an annual tech fest.',
  source: SOURCES.faq,
};
