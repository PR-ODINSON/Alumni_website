import type { Department } from './types';
import { SOURCES } from './sources';

export const departments: Department[] = [
  {
    id: 'basic-sciences',
    name: 'Department of Basic Sciences',
    shortName: 'Basic Sciences',
    description:
      'The Basic Science Department comprises of Physics, Chemistry and Mathematics disciplines.',
    disciplines: ['Physics', 'Chemistry', 'Mathematics'],
    researchAreas: [
      'Chemistry — Heterogeneous Catalysis, Material Chemistry, Nano-materials, Coordination Chemistry, Molecular Magnetism, Supramolecular Self-Assembly',
      'Mathematics — Algebraic Number Theory, Representation Theory, Dynamical Systems, Lie Groups, Number Theory, Fuzzy Set Theory, Banach Algebras & Harmonic Analysis, Operator Theory, Partial Differential Equations, Finite Element Methods, WEB-Spline Method',
      'Physics — Magnetic Materials, Computational Material Science, Multi-ferroics, Super-conductivity, Spectroscopy, Ionic Liquids, Functionalized Nanomaterials, High Energy Physics, Astrophysics & Cosmology, Condensed Matter Physics, Ferrite Thin Films and Bilayers Films',
    ],
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.homepage,
  },
  {
    id: 'civil-engineering',
    name: 'Department of Civil Engineering',
    shortName: 'Civil Engineering',
    description:
      'The Government of India is emphasizing on up-gradation of infrastructure by focusing on schemes such as development of Smart Cities, Atal Mission for Rejuvenation and Urban Transformation (AMRUT), National Highways Development Project (NHDP), and Setu Bharatam.',
    programs: ['B.Tech. Civil Engineering', 'M.Tech. Civil Engineering', 'Ph.D. Civil Engineering'],
    researchAreas: [
      'Environment Engineering — Urban Heat Island, Thermal Comfort',
      'Geo-Informatics and Geo-Technical Engineering — Remote Sensing, Sustainable Materials, Geo-technics, Soil-structure Interaction, High Performance Concrete, Reutilization of Waste',
      'Structural Engineering — Rehabilitation of Structures, High Strength and Ultra High Strength Concrete, Sustainable Concrete, Fracture Mechanics',
      'Transportation Engineering — Traffic Flow Modelling, Non-motorised Transportation, Road Safety, Pavement Design and Materials',
      'Water Resources Engineering — Computational Hydraulics, Sediment Transport, Pollutant Transport, Remote Sensing in Water Resources',
    ],
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.homepage,
  },
  {
    id: 'electrical-computer-science',
    name: 'Department of Electrical and Computer Science Engineering',
    shortName: 'Electrical & Computer Science',
    description:
      'The School of Engineering guides graduates to the higher reaches of their profession at national and international levels.',
    programs: [
      'B.Tech. Electrical Engineering',
      'B.Tech. Computer Engineering',
      'M.Tech. Electrical Engineering',
      'Ph.D. Electrical & Computer Science Engineering',
    ],
    researchAreas: [
      'Computer Networks — Design for Communication Networks, Intelligent Transportation System, ICT Applications',
      'Control Systems — Aircraft Flight Controls, Adaptive Control Systems, Cognitive Robotics, Machine Learning',
      'Electrical Machines — Condition Monitoring of Electrical Machines & Drives, Electrical Vehicles',
      'Power Systems, Power Electronics and Renewable Energy — Stability and Control, Renewable Energy Integration, Microgrid',
      'Microelectronics and VLSI — Semiconductor Device Fabrication, VLSI Design, Flexible & Wearable Electronics, Solar Cells',
      'Satellite and Wireless Communication — Satellite and Antenna design, Navigation System, Indoor Navigation',
      'Signal Processing & Image processing — Biomedical Signal Processing, Machine Learning, Deep Learning, Computer Vision',
    ],
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.homepage,
  },
  {
    id: 'humanities-social-sciences',
    name: 'Department of Humanities and Social Sciences',
    shortName: 'Humanities & Social Sciences',
    description:
      'The Department of Humanities and Social Sciences (HSS) at IITRAM houses the disciplines of Economics, English Literature, Psychology, and Sociology. At present, the Department has five faculty members who teach a diverse range of courses at both the graduate and postgraduate levels.',
    disciplines: ['Economics', 'English Literature', 'Psychology', 'Sociology'],
    researchAreas: [
      'Economics — FDI, Trade, Infrastructure Management',
      'English Literature — Cultural Studies, Eco-Criticism, Indigenous Literature, Diaspora Literature',
      'Psychology & Sociology — Sociology of Health and Illness, Social Development, Profession and Ethics, Neighborhood and Infrastructure',
    ],
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.homepage,
  },
  {
    id: 'mechanical-aerospace',
    name: 'Department of Mechanical and Aerospace Engineering',
    shortName: 'Mechanical & Aerospace',
    description:
      'Mechanical Engineers have a vital role to play in the development of infrastructural facilities related to power generation, manufacturing, and industrial refrigeration, to name a few.',
    programs: [
      'B.Tech. Mechanical Engineering',
      'M.Tech. Mechanical Engineering',
      'Ph.D. Mechanical & Aerospace Engineering',
    ],
    researchAreas: [
      'Machine Design — Fracture, Lubrication and Vibration',
      'Manufacturing Science and Engineering — Metal Cutting, Non-conventional Machining, Additive Manufacturing, Sustainable Machining',
      'Material Science — Computational Materials Science, Phase Field Modelling, Biomaterials, Polymer and Composites',
      'Production Engineering — Modeling and Optimization of Production Processes, Supply Chain Management',
      'Thermal & Fluids Engineering — IC Engines, Heat and Mass Transfer, Computational Fluid Dynamics, Supersonic Combustion',
    ],
    officialUrl: 'https://iitram.ac.in/',
    source: SOURCES.homepage,
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}
