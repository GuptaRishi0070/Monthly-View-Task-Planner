export type Category = 'To Do' | 'In Progress' | 'Review' | 'Completed';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  category: Category;
  startDate: string;
  endDate: string;
  description?: string;
  priority?: Priority;
}

export interface Filters {
  categories: Category[];
  timeRange: string | null;
  searchQuery: string;
  priorities: Priority[];
}

export const CATEGORY_COLORS = {
  'To Do': '#FF9800',
  'In Progress': '#2196F3',
  'Review': '#9C27B0',
  'Completed': '#4CAF50'
};

export const PRIORITY_COLORS = {
  'low': '#8BC34A',
  'medium': '#FFC107',
  'high': '#F44336'
};

export const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];