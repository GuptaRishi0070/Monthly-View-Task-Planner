import React from 'react';
import { Task } from '../../../types/calendar';
import { TaskItem } from './TaskItem';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { isCurrentMonth, isToday } from '../../../utils/dateUtils';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onAddTask: (date: Date) => void;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  currentMonth,
  tasks,
  onTaskClick,
  onTaskDelete,
  onAddTask,
  onMouseDown,
  onMouseEnter
}) => {
  const isInCurrentMonth = isCurrentMonth(date, currentMonth);
  const isCurrentDay = isToday(date);
  const dayOfMonth = date.getDate();
  const isFirstOfMonth = dayOfMonth === 1;
  const monthName = date.toLocaleString('default', { month: 'short' });

  return (
    <Box
      sx={{
        minHeight: '120px',
        backgroundColor: isInCurrentMonth ? 'background.paper' : 'action.hover',
        position: 'relative',
        padding: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: isInCurrentMonth ? 'action.hover' : 'action.selected'
        }
      }}
      onMouseDown={() => onMouseDown(date)}
      onMouseEnter={() => onMouseEnter(date)}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '4px'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: isCurrentDay ? 'primary.main' : 'transparent',
          color: isCurrentDay ? 'primary.contrastText' : isInCurrentMonth ? 'text.primary' : 'text.disabled'
        }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: isCurrentDay ? 'bold' : 'normal',
            }}
          >
            {dayOfMonth}
          </Typography>
        </Box>
        {isInCurrentMonth && (
          <Tooltip title="Add task">
            <IconButton
              size="small"
              sx={{ 
                p: '4px',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'transparent'
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onAddTask(date);
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      {isFirstOfMonth && !isInCurrentMonth && (
        <Typography variant="caption" sx={{ 
          position: 'absolute',
          top: 4,
          left: 4,
          color: 'text.disabled'
        }}>
          {monthName}
        </Typography>
      )}
      
      <Box sx={{ 
        overflowY: 'auto', 
        maxHeight: 'calc(100% - 30px)',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'divider',
          borderRadius: '2px',
        }
      }}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onTaskDelete}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </Box>
    </Box>
  );
};