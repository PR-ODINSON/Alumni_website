import type { CenterOfExcellence } from './types';
import { SOURCES } from './sources';

export const centersOfExcellence: CenterOfExcellence[] = [
  {
    id: 'aiml',
    name: 'Centre of Excellence in Artificial Intelligence and Machine Learning (CoE: AIML)',
    description:
      'Part of IITRAM\'s Centres of Excellence established with financial support from Government of Gujarat and industry support. The CoEs aim to develop an advanced, self-sustaining, dynamic and industry relevant learning platform to bridge the gap in technological skills between industries and academia.',
    focusAreas: [
      'Knowledge sharing and skill development',
      'Elective courses, minors\' program, short term training programs',
      'Research on advance topics in AI and ML',
    ],
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.coeBrochure,
  },
  {
    id: 'drone-technology',
    name: 'Centre of Excellence in Drone Technology (CoE: DT)',
    description:
      'Part of IITRAM\'s Centres of Excellence. Conducts extensive research on advance topics and current/futuristic problems in drone technology domains.',
    focusAreas: ['Student projects', 'Internships', 'Workshops and demonstration sessions'],
    officialUrl: 'https://iitram.ac.in/dt_people',
    source: SOURCES.coeBrochure,
  },
  {
    id: 'aerospace-defence',
    name: 'Centre of Excellence in Aerospace and Defence (CoE: A&D)',
    description:
      'Part of IITRAM\'s Centres of Excellence with state-of-the-art laboratories and facilities in aerospace and defence areas.',
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.coeBrochure,
  },
  {
    id: 'advanced-defence-technologies',
    name: 'Centre of Excellence for Advanced Defence Technology (CoE: CADT)',
    description:
      'Part of IITRAM\'s Centres of Excellence. Aims to serve as a nodal/coordinating centre for technical workforce with an objective to contribute towards smart and sustainable infrastructure development.',
    officialUrl: 'https://iitram.ac.in/cadt_people',
    source: SOURCES.coeBrochure,
  },
  {
    id: 'siemens',
    name: "Siemens' Centre of Excellence in Industrial Machinery, Industrial Automation, and Electrical Switchgear",
    description:
      'Part of IITRAM\'s Centres of Excellence established with support from Siemens and Government of Gujarat.',
    officialUrl: 'https://www.iitram.ac.in/siemens_people',
    source: SOURCES.coeBrochure,
  },
  {
    id: 'ssdri',
    name: 'Centre of Excellence for Smart, Sustainable and Disaster Resilient Infrastructure (CoE-SSDRI)',
    description:
      'The Centre promotes infrastructure systems that are environmentally responsible, technologically advanced, and resilient to natural and human-induced hazards. By integrating sustainability principles, climate-responsive design, efficient resource management, and disaster risk reduction strategies, CoE-SSDRI contributes to safeguarding both the environment and society.',
    focusAreas: [
      'Smart and Sustainable Infrastructure',
      'Sustainable Urban Environment',
      'Intelligent Transportation System',
      'Sustainable Construction Materials',
      'Waste Management and Recycling',
      'Disaster Resilient Infrastructure',
      'Urban Floods, Flood Mitigation and Erosion Studies',
      'Fire and Earthquake Hazard: Assessment and Mitigation',
      'Forensic Analysis of Infrastructure Failures',
    ],
    officialUrl: 'https://iitram.ac.in/ssdri',
    source: SOURCES.ssdri,
  },
];
