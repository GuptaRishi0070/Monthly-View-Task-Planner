import React from 'react';
import { Paper } from '@mui/material';
import { DayCell } from './DayCell';
import { getCalendarDays } from '../../utils/dateUtils';
import { type Task } from '../../types/calendar';

interface CalendarGridProps {
  currentMonth: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onAddTask: (date: Date) => void;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: () => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  tasks,
  onTaskClick,
  onTaskDelete,
  onAddTask,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  const daysInView = getCalendarDays(currentMonth);

  return (
    <Paper 
      elevation={1}
      sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1px',
        backgroundColor: 'divider',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden'
      }}
      onMouseUp={onMouseUp}
    >
      {daysInView.map((date, i) => {
        const tasksForDay = tasks.filter(task => {
          const taskStart = new Date(task.startDate);
          const taskEnd = new Date(task.endDate);
          return date >= taskStart && date <= taskEnd;
        });
        
        return (
          <DayCell
            key={i}
            date={date}
            currentMonth={currentMonth}
            tasks={tasksForDay}
            onTaskClick={onTaskClick}
            onTaskDelete={onTaskDelete}
            onAddTask={onAddTask}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
          />
        );
      })}
    </Paper>
  );
};