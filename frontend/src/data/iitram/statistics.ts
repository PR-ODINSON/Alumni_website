import type { InstituteStatistic } from './types';
import { SOURCES } from './sources';

export const instituteStatistics: InstituteStatistic[] = [
  {
    id: 'students',
    metric: 'Students',
    value: '2176+',
    note: 'Official website figure — verified 2026-08-25',
    source: SOURCES.homepage,
  },
  {
    id: 'phd-students',
    metric: 'Ph.D. Students',
    value: '145+',
    note: 'Official website figure — verified 2026-08-25',
    source: SOURCES.homepage,
  },
  {
    id: 'coe',
    metric: 'Centers of Excellence',
    value: '5+',
    note: 'Official website figure — verified 2026-08-25',
    source: SOURCES.homepage,
  },
  {
    id: 'funded-projects',
    metric: 'Funded Research Projects',
    value: '32+',
    note: 'Official website figure — verified 2026-08-25',
    source: SOURCES.homepage,
  },
  {
    id: 'publications',
    metric: 'Research Publications',
    value: '1285+',
    note: 'Official website figure — verified 2026-08-25',
    source: SOURCES.homepage,
  },
  {
    id: 'faculty',
    metric: 'Faculty Members',
    value: '55+',
    note: 'Official website figure — verified 2026-08-25',
    source: SOURCES.homepage,
  },
  {
    id: 'citations',
    metric: 'Google Scholar Citations',
    value: '41630+',
    note: 'Official website figure — verified 2026-08-25',
    source: SOURCES.homepage,
  },
  {
    id: 'hostel-capacity',
    metric: 'Hostel Capacity',
    value: '1200+',
    note: 'Official website figure — verified 2026-08-25',
    source: SOURCES.homepage,
  },
];
