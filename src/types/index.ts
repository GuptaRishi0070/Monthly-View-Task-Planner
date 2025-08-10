// src/types.ts

// Allowed category names
export type Category = 'To Do' | 'In Progress' | 'Review' | 'Completed';

// Task type
export type Task = {
  id: string;
  title: string;
  category: Category;
  startDate: string; // ISO date string: "YYYY-MM-DD"
  endDate: string;   // ISO date string: "YYYY-MM-DD"
  color?: string;    // optional color for category display
};
