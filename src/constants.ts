import { CategoryInfo } from './types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'religious',
    title: 'الثقافة الدينية',
    icon: '🕌',
    color: 'bg-emerald-500',
    description: 'أسئلة حول التاريخ الإسلامي والسيرة النبوية.',
  },
  {
    id: 'geographical',
    title: 'الثقافة الجغرافية',
    icon: '🌍',
    color: 'bg-blue-500',
    description: 'القارات، الدول، والمدن.',
  },
  {
    id: 'societal',
    title: 'الثقافة المجتمعية',
    icon: '👥',
    color: 'bg-amber-500',
    description: 'العادات والقيم الاجتماعية.',
  },
  {
    id: 'national',
    title: 'الثقافة الوطنية',
    icon: '🇸🇦',
    color: 'bg-indigo-600',
    description: 'تاريخ وإنجازات الوطن.',
  },
];
