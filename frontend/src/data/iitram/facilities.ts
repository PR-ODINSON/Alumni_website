import type { Facility } from './types';
import { SOURCES } from './sources';

export const campusFacilities: Facility[] = [
  {
    id: 'hostel',
    name: 'Hostel',
    description:
      'IITRAM is a residential campus with separate hostels for boys and girls, located approximately 1 KM away from the academic block. Rooms are available on sharing basis. Hostel offers bright, spacious rooms with bed, study desk, chair, and wardrobe. Includes 24x7 study room, entertainment area, and indoor/outdoor sports facilities.',
    officialUrl: 'https://iitram.ac.in/hostel',
    source: SOURCES.hostel,
  },
  {
    id: 'library',
    name: 'Library Resource Centre',
    description:
      'The Library Resource Centre provides vital support for teaching, learning, and research activities using state of the art library and information services. Fully automated with SOUL 3.0 Integrated Library Management Software and RFID Technology. Collection includes 7000+ books, 7,000+ e-books, 6,000+ e-journals, 45 print magazines/periodicals, and 10 newspapers.',
    officialUrl: 'https://iitram.ac.in/library',
    source: SOURCES.library,
  },
  {
    id: 'laboratories',
    name: 'Laboratories',
    description:
      'State of the art laboratories and training facilities across departments and Centres of Excellence.',
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.homepage,
  },
  {
    id: 'smart-classrooms',
    name: 'Smart Classrooms',
    description: 'Smart classrooms and advanced laboratories.',
    source: SOURCES.faq,
  },
  {
    id: 'computer-centres',
    name: 'Computer Centres & Language Labs',
    description: 'Computer centres and language labs available on campus.',
    source: SOURCES.faq,
  },
  {
    id: 'sports',
    name: 'Sports Facilities',
    description: 'Sports facilities (indoor & outdoor) available on campus.',
    source: SOURCES.faq,
  },
  {
    id: 'medical',
    name: 'Medical Facilities',
    description:
      'IITRAM offers basic medical facilities on campus and has tie-ups with Narayana Hospital for emergency services.',
    source: SOURCES.faq,
  },
  {
    id: 'gym',
    name: 'Gymnasium',
    description:
      'A well-equipped gym with a fitness trainer is available. Timings: 6:30–8:30 AM and 6:30–8:30 PM.',
    source: SOURCES.faq,
  },
  {
    id: 'canteen-mess',
    name: 'Canteen & Hostel Mess',
    description: 'Canteen and hostel mess services available on campus.',
    source: SOURCES.faq,
  },
  {
    id: 'wifi',
    name: 'Campus Wi-Fi',
    description: 'High-speed internet is accessible across academic and hostel areas.',
    source: SOURCES.faq,
  },
  {
    id: 'counselling',
    name: 'Counselling Center',
    description: 'Counselling services listed on the official IITRAM website.',
    officialUrl: 'https://iitram.ac.in/sitemap',
    source: SOURCES.sitemap,
  },
];

export const campusConnectivity = [
  { point: 'Sardar Vallabhbhai Patel International Airport', distance: '14 km' },
  { point: 'Kalupur Railway Station', distance: '5 km' },
  { point: 'Maninagar Railway Station', distance: '2 km' },
  { point: 'Asarva Railway Station', distance: '6 km' },
  { point: 'Sabarmati Railway Station', distance: '15 km' },
  { point: 'Gita Mandir Central Bus Station', distance: '4 km' },
];

export const workingHours = {
  weekdays: 'Monday to Friday: 9:00 AM – 5:30 PM',
  lunchBreak: 'Lunch Break: 1:00 PM – 2:00 PM',
  weekends: 'Saturday-Sunday: Closed',
  source: SOURCES.faq,
};
