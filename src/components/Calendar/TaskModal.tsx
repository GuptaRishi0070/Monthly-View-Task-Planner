import React from 'react';
import type { Task } from '../../types/calendar';
import { CATEGORY_COLORS, PRIORITY_COLORS } from '../../types/calendar';
import {
  Modal,
  Paper,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Partial<Task> | null;
  onTaskChange: (task: Partial<Task>) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  task,
  onTaskChange,
  onSave,
  onDelete
}) => {
  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
        outline: 'none'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {task?.id ? 'Edit Task' : 'New Task'}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <TextField
          fullWidth
          label="Task Name"
          value={task?.name || ''}
          onChange={(e) => onTaskChange({
            ...task,
            name: e.target.value
          })}
          sx={{ mb: 2 }}
          variant="outlined"
          size="small"
        />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={task?.category || 'To Do'}
              label="Category"
              onChange={(e) => onTaskChange({
                ...task,
                category: e.target.value as Task['category']
              })}
            >
              {(Object.keys(CATEGORY_COLORS) as Array<keyof typeof CATEGORY_COLORS>).map(category => (
                <MenuItem key={category} value={category}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: CATEGORY_COLORS[category]
                    }} />
                    {category}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={task?.priority || 'medium'}
              label="Priority"
              onChange={(e) => onTaskChange({
                ...task,
                priority: e.target.value as Task['priority']
              })}
            >
              <MenuItem value="low">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: PRIORITY_COLORS.low }} />
                  Low
                </Box>
              </MenuItem>
              <MenuItem value="medium">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: PRIORITY_COLORS.medium }} />
                  Medium
                </Box>
              </MenuItem>
              <MenuItem value="high">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: PRIORITY_COLORS.high }} />
                  High
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <TextField
          fullWidth
          label="Description"
          value={task?.description || ''}
          onChange={(e) => onTaskChange({
            ...task,
            description: e.target.value
          })}
          sx={{ mb: 2 }}
          variant="outlined"
          size="small"
          multiline
          rows={3}
        />
        
        <Box sx={{ 
          backgroundColor: 'action.hover',
          p: 2,
          borderRadius: 1,
          mb: 3
        }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Dates
          </Typography>
          <Typography variant="body2">
            {task?.startDate} to {task?.endDate}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {task?.id && (
            <Button 
              color="error" 
              variant="outlined"
              onClick={() => {
                onDelete(task.id!);
                onClose();
              }}
              sx={{ mr: 'auto' }}
            >
              Delete
            </Button>
          )}
          
          <Button 
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button 
            variant="contained" 
            onClick={onSave}
            disabled={!task?.name}
          >
            {task?.id ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};