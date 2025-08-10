import React from 'react';
import { type Task } from '../../types/calendar';
import { CATEGORY_COLORS, PRIORITY_COLORS } from '../../types/calendar';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onClick: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onClick }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: CATEGORY_COLORS[task.category],
        color: 'white',
        borderRadius: '4px',
        padding: '6px 8px',
        marginBottom: '6px',
        cursor: 'move',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: 1
        }
      }}
      onClick={onClick}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        flexGrow: 1,
        overflow: 'hidden'
      }}>
        {task.priority && (
          <Box sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: PRIORITY_COLORS[task.priority],
            mr: 1,
            flexShrink: 0
          }} />
        )}
        <Typography 
          variant="body2" 
          sx={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            fontWeight: 500
          }}
        >
          {task.name}
        </Typography>
      </Box>
      <IconButton
        size="small"
        sx={{ 
          color: 'white', 
          p: '4px',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.2)'
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
      >
        <Close fontSize="small" />
      </IconButton>
    </Paper>
  );
};