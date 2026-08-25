import type { LeadershipPerson } from './types';
import { SOURCES } from './sources';

export const alumniRelations = {
  purpose:
    'The Office of Alumni Relations was established by IITRAM Ahmedabad to provide a platform for its alumni to connect with their alma mater. The alumni can approach the Alumni Relations office for any assistance related to the institute.',
  engagement:
    'The office serves as a facilitator to enhance the connections among IITRAM alumni and foster a community of knowledgeable and well-connected alumni who are willing to assist each other and the institute.',
  connection:
    'Furthermore, it keeps the alumni informed about various events and activities taking place on campus, thereby enabling them to stay connected with IITRAM Ahmedabad.',
  source: SOURCES.alumniAbout,
};

export const alumniLeadership: LeadershipPerson[] = [
  {
    name: 'Dr. Manish Sharma',
    designation: 'Dean of Outreach and Alumni Affairs',
    source: SOURCES.alumniAbout,
  },
  {
    name: 'Dr. Ravi Bhandari',
    designation: 'Coordinator of Alumni Affairs',
    source: SOURCES.alumniAbout,
  },
];

export const alumniCommitteeMembers: LeadershipPerson[] = [
  { name: 'Dr. Rohan Kar', designation: 'Committee Member, Alumni Relations', source: SOURCES.alumniAbout },
  { name: 'Dr. Ram Kumar', designation: 'Committee Member, Alumni Relations', source: SOURCES.alumniAbout },
];

export const alumniStudentCoordinator: LeadershipPerson = {
  name: 'Priyanshu Sahu',
  designation: 'Student Coordinator Alumni Affairs',
  email: 'AR_Coordinator@iitram.ac.in',
  phone: '+91 92288 81575',
  source: SOURCES.alumniAbout,
};

export const alumniStudentTeam: string[] = [
  'Aastha Motwani',
  'Ankita Sewada',
  'Kushagra Gupta',
  'Sayantan Halder',
  'Prithviraj Verma',
  'Hemanshu Tala',
  'Nirmal Joshi',
  'Satyam Kumar',
  'Kislay Rai',
  'Hemant Tiwari',
  'Subhi Singh',
  'Ariba Shaikh',
  'Indraneel Chakraborty',
  'Rahul Bhoiya',
  'Tirth Pancholi',
];
