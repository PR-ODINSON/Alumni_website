import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', options || { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export function formatSalary(min?: number, max?: number, currency = 'INR', period = 'annual'): string {
  if (!min && !max) return 'Not disclosed';
  const fmt = (n: number) => {
    if (currency === 'INR') {
      if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
      return `₹${n.toLocaleString('en-IN')}`;
    }
    return `$${(n / 1000).toFixed(0)}k`;
  };
  if (min && max) return `${fmt(min)} – ${fmt(max)} ${period === 'annual' ? 'p.a.' : ''}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return 'Not disclosed';
}

export function getJobTypeBadgeColor(type: string): string {
  const map: Record<string, string> = {
    'full-time': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'part-time': 'bg-blue-50 text-blue-700 border-blue-100',
    'internship': 'bg-purple-50 text-purple-700 border-purple-100',
    'contract': 'bg-amber-50 text-amber-700 border-amber-100',
    'freelance': 'bg-orange-50 text-orange-700 border-orange-100',
  };
  return map[type] || 'bg-slate-50 text-slate-700 border-slate-100';
}

export function getLocationTypeBadge(type: string): string {
  const map: Record<string, string> = {
    'remote': 'bg-teal-50 text-teal-700',
    'hybrid': 'bg-indigo-50 text-indigo-700',
    'onsite': 'bg-slate-50 text-slate-700',
  };
  return map[type] || 'bg-slate-50 text-slate-700';
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export const DEPARTMENTS = [
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Computer Science & Engineering',
  'Information Technology',
  'Chemical Engineering',
  'Electronics & Communication',
  'Urban & Regional Planning',
  'Infrastructure Engineering',
  'Architecture',
  'MBA',
  'PhD',
];

export const INDUSTRIES = [
  'Technology', 'Finance', 'Consulting', 'Infrastructure', 'Manufacturing',
  'Healthcare', 'Education', 'Government', 'Startup', 'Real Estate',
  'Energy', 'Transportation', 'Research', 'Defense', 'Media', 'Other',
];

export const SKILLS_COMMON = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Java', 'C++',
  'AutoCAD', 'MATLAB', 'SAP', 'Project Management', 'Leadership',
  'Data Analysis', 'Machine Learning', 'Cloud Computing', 'DevOps',
  'Structural Analysis', 'Civil Design', 'Financial Modeling', 'Agile',
];
