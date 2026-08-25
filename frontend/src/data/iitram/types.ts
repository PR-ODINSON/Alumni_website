export interface OfficialSource {
  name: string;
  url: string;
  verifiedAt: string;
}

export interface InstituteStatistic {
  id: string;
  metric: string;
  value: string;
  unit?: string;
  note?: string;
  source: OfficialSource;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  source: OfficialSource;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  disciplines?: string[];
  programs?: string[];
  researchAreas?: string[];
  officialUrl: string;
  source: OfficialSource;
}

export interface AcademicProgram {
  id: string;
  level: 'undergraduate' | 'postgraduate' | 'doctoral' | 'addon';
  name: string;
  disciplines?: string[];
  admissionInfo?: string;
  source: OfficialSource;
}

export interface CenterOfExcellence {
  id: string;
  name: string;
  description?: string;
  focusAreas?: string[];
  officialUrl: string;
  source: OfficialSource;
}

export interface ResearchCategory {
  id: string;
  category: string;
  title: string;
  description?: string;
  officialUrl: string;
  source: OfficialSource;
}

export interface StudentClub {
  id: string;
  name: string;
  category: 'sports' | 'literary-cultural' | 'science-technology';
  source: OfficialSource;
}

export interface Facility {
  id: string;
  name: string;
  description?: string;
  officialUrl?: string;
  source: OfficialSource;
}

export interface LeadershipPerson {
  name: string;
  designation: string;
  department?: string;
  email?: string;
  phone?: string;
  officialUrl?: string;
  source: OfficialSource;
}

export interface InstituteNavItem {
  label: string;
  href: string;
  description: string;
}
