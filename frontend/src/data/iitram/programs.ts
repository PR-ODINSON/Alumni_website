import type { AcademicProgram } from './types';
import { SOURCES } from './sources';

export const academicPrograms: AcademicProgram[] = [
  {
    id: 'btech',
    level: 'undergraduate',
    name: 'Bachelor of Technology (B.Tech.)',
    disciplines: [
      'Civil Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Computer Engineering',
    ],
    admissionInfo:
      'Admissions via ACPC Counseling (50% seats, GUJCET) and JoSAA/CSAB Counseling (50% seats, JEE Main). IITRAM does not offer management quota admissions.',
    source: SOURCES.faq,
  },
  {
    id: 'mtech',
    level: 'postgraduate',
    name: 'Master of Technology (M.Tech.)',
    disciplines: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
    admissionInfo: 'Admissions through CCMT (50%) and ACPC Merit List (50%).',
    source: SOURCES.faq,
  },
  {
    id: 'phd',
    level: 'doctoral',
    name: 'Doctor of Philosophy (Ph.D.)',
    disciplines: [
      'Civil Engineering',
      'Electrical & Computer Science Engineering',
      'Mechanical & Aerospace Engineering',
      'Basic Sciences (Physics, Chemistry, Mathematics)',
      'Humanities & Social Sciences (English, Economics, Psychology, Sociology)',
    ],
    admissionInfo:
      'Full-time and part-time options available. Applications invited twice a year (Autumn and Spring). Selection includes written test and/or interview.',
    source: SOURCES.faq,
  },
  {
    id: 'honours',
    level: 'addon',
    name: 'B.Tech. with Honours',
    disciplines: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
    admissionInfo: 'Available without additional charges.',
    source: SOURCES.faq,
  },
  {
    id: 'minor',
    level: 'addon',
    name: 'B.Tech. with Minor',
    disciplines: ['Drone Technology', 'Computer Science and Engineering', 'Management'],
    admissionInfo: 'Available without additional charges.',
    source: SOURCES.faq,
  },
  {
    id: 'micro-specialization',
    level: 'addon',
    name: 'B.Tech. with Micro Specialization',
    admissionInfo: 'Available without additional charges.',
    source: SOURCES.faq,
  },
];
