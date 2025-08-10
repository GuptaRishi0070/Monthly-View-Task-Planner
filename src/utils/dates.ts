import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isSameDay,
  parseISO,
  isWithinInterval,
  addDays,
  startOfWeek,
  endOfWeek
} from 'date-fns';

// Gets all days to display in calendar view (including padding days)
export const getCalendarDays = (currentMonth: Date): Date[] => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

// Format date to ISO string (yyyy-MM-dd)
export const formatISODate = (date: Date): string => format(date, 'yyyy-MM-dd');

// Date comparison helpers
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => 
  isSameMonth(date, currentMonth);

export const isToday = (date: Date): boolean => 
  isSameDay(date, new Date());

// Month navigation
export const getPrevMonth = (currentMonth: Date): Date => 
  subMonths(currentMonth, 1);

export const getNextMonth = (currentMonth: Date): Date => 
  addMonths(currentMonth, 1);

// Date range validation
export const isWithinDateRange = (
  date: Date,
  startDate: string,
  endDate: string
): boolean => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return isWithinInterval(date, { start, end });
};

// Parse task dates safely
export const parseTaskDates = (task: Task): { start: Date; end: Date } => {
  return {
    start: parseISO(task.startDate),
    end: parseISO(task.endDate)
  };
};