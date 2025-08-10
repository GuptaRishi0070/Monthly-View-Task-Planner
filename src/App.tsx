import  { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  Divider
} from '@mui/material';
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
import { Close, Add, ChevronLeft, ChevronRight, Search, FilterList, Today } from '@mui/icons-material';

// Custom hook for localStorage
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

type Category = 'To Do' | 'In Progress' | 'Review' | 'Completed';

interface Task {
  id: string;
  name: string;
  category: Category;
  startDate: string;
  endDate: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}

const CATEGORY_COLORS = {
  'To Do': '#FF9800',
  'In Progress': '#2196F3',
  'Review': '#9C27B0',
  'Completed': '#4CAF50'
};

const PRIORITY_COLORS = {
  'low': '#8BC34A',
  'medium': '#FFC107',
  'high': '#F44336'
};

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useLocalStorage<Task[]>('calendar-tasks', []);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [dragSelection, setDragSelection] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [filters, setFilters] = useState({
    categories: ['To Do', 'In Progress', 'Review', 'Completed'] as Category[],
    timeRange: null as string | null,
    searchQuery: '',
    priorities: ['low', 'medium', 'high'] as ('low' | 'medium' | 'high')[]
  });
  const [showFilters, setShowFilters] = useState(false);

  // Generate calendar dates including padding days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const daysInView = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Filter tasks based on current filters
  const filteredTasks = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      const taskStart = parseISO(task.startDate);
      const taskEnd = parseISO(task.endDate);
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
        return false;
      }
      
      // Priority filter
      if (task.priority && filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }
      
      // Search filter
      if (filters.searchQuery && !task.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      // Time range filter
      if (filters.timeRange) {
        const daysInRange = parseInt(filters.timeRange.split(' ')[1]);
        const rangeEnd = addDays(today, daysInRange * 7);
        
        if (taskEnd < today || taskStart > rangeEnd) {
          return false;
        }
      }
      
      return true;
    });
  }, [tasks, filters]);

  // Handle month navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Task operations
  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (task: Task) => {
    setTasks(tasks.map(t => t.id === task.id ? task : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return filteredTasks().filter(task => 
      isWithinInterval(date, { 
        start: parseISO(task.startDate), 
        end: parseISO(task.endDate) 
      })
    );
  };

  // Handle drag selection for new task
  const handleDayMouseDown = (date: Date) => {
    setDragSelection({ start: date, end: date });
  };

  const handleDayMouseEnter = (date: Date) => {
    if (dragSelection.start) {
      setDragSelection(prev => ({ ...prev, end: date }));
    }
  };

  const handleMouseUp = () => {
    if (dragSelection.start && dragSelection.end) {
      const start = dragSelection.start < dragSelection.end ? dragSelection.start : dragSelection.end;
      const end = dragSelection.start < dragSelection.end ? dragSelection.end : dragSelection.start;
      
      setCurrentTask({
        name: '',
        category: 'To Do',
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
        priority: 'medium'
      });
      setModalOpen(true);
    }
    setDragSelection({ start: null, end: null });
  };

  // Group days by week for rendering
  const weeks: Date[][] = [];
  for (let i = 0; i < daysInView.length; i += 7) {
    weeks.push(daysInView.slice(i, i + 7));
  }

  return (
    
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{textAlign:'center'}}>Month View Task Planner</h1>
      {/* Header with month navigation and search */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Today />}
              onClick={goToToday}
              size="small"
            >
              Today
            </Button>
            <IconButton onClick={prevMonth}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              {format(currentMonth, 'MMMM yyyy')}
            </Typography>
            <IconButton onClick={nextMonth}>
              <ChevronRight />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
                sx: { borderRadius: 2 }
              }}
              sx={{ width: 250 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
            >
              Filters
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        {showFilters && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            backgroundColor: 'background.paper', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <FormControl component="fieldset">
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Categories</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.keys(CATEGORY_COLORS).map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      clickable
                      variant={filters.categories.includes(category as Category) ? 'filled' : 'outlined'}
                      onClick={() => {
                        const newCategories = filters.categories.includes(category as Category)
                          ? filters.categories.filter(c => c !== category)
                          : [...filters.categories, category as Category];
                        setFilters({...filters, categories: newCategories});
                      }}
                      size="small"
                      sx={{
                        backgroundColor: filters.categories.includes(category as Category) ? CATEGORY_COLORS[category as Category] : undefined,
                        color: filters.categories.includes(category as Category) ? 'white' : undefined
                      }}
                    />
                  ))}
                </Box>
              </FormControl>
              
              <FormControl component="fieldset">
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Priorities</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.entries(PRIORITY_COLORS).map(([priority, color]) => (
                    <Chip
                      key={priority}
                      label={priority}
                      clickable
                      variant={filters.priorities.includes(priority as 'low' | 'medium' | 'high') ? 'filled' : 'outlined'}
                      onClick={() => {
                        const newPriorities = filters.priorities.includes(priority as 'low' | 'medium' | 'high')
                          ? filters.priorities.filter(p => p !== priority)
                          : [...filters.priorities, priority as 'low' | 'medium' | 'high'];
                        setFilters({...filters, priorities: newPriorities});
                      }}
                      size="small"
                      sx={{
                        backgroundColor: filters.priorities.includes(priority as 'low' | 'medium' | 'high') ? color : undefined,
                        color: filters.priorities.includes(priority as 'low' | 'medium' | 'high') ? 'white' : undefined
                      }}
                    />
                  ))}
                </Box>
              </FormControl>
              
              <FormControl component="fieldset">
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Time Range</Typography>
                <RadioGroup
                  row
                  value={filters.timeRange || ''}
                  onChange={(e) => setFilters({...filters, timeRange: e.target.value || null})}
                >
                  <FormControlLabel value="1 week" control={<Radio size="small" />} label="1 week" />
                  <FormControlLabel value="2 weeks" control={<Radio size="small" />} label="2 weeks" />
                  <FormControlLabel value="3 weeks" control={<Radio size="small" />} label="3 weeks" />
                  <FormControlLabel value="" control={<Radio size="small" />} label="All" />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Weekday headers */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        fontWeight: 'bold',
        mb: 1,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        p: 1
      }}>
        {DAYS_OF_WEEK.map(day => (
          <Typography key={day} variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar grid */}
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
        onMouseUp={handleMouseUp}
      >
        {daysInView.map((date, i) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isToday = isSameDay(date, new Date());
          const dayOfMonth = format(date, 'd');
          const isFirstOfMonth = dayOfMonth === '1';
          const monthName = format(date, 'MMM');
          const tasksForDay = getTasksForDate(date);
          
          return (
            <Box
              key={i}
              sx={{
                minHeight: '120px',
                backgroundColor: isCurrentMonth ? 'background.paper' : 'action.hover',
                position: 'relative',
                padding: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: isCurrentMonth ? 'action.hover' : 'action.selected'
                }
              }}
              onMouseDown={() => handleDayMouseDown(date)}
              onMouseEnter={() => handleDayMouseEnter(date)}
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
                  backgroundColor: isToday ? 'primary.main' : 'transparent',
                  color: isToday ? 'primary.contrastText' : isCurrentMonth ? 'text.primary' : 'text.disabled'
                }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday ? 'bold' : 'normal',
                    }}
                  >
                    {dayOfMonth}
                  </Typography>
                </Box>
                {isCurrentMonth && (
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
                        setCurrentTask({
                          name: '',
                          category: 'To Do',
                          startDate: format(date, 'yyyy-MM-dd'),
                          endDate: format(date, 'yyyy-MM-dd'),
                          priority: 'medium'
                        });
                        setModalOpen(true);
                      }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              {isFirstOfMonth && !isCurrentMonth && (
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
                {tasksForDay.map((task) => (
                  <Paper
                    key={task.id}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTask(task);
                      setModalOpen(true);
                    }}
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
                        deleteTask(task.id);
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            </Box>
          );
        })}
      </Paper>

      {/* Task Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
              {currentTask?.id ? 'Edit Task' : 'New Task'}
            </Typography>
            <IconButton onClick={() => setModalOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <TextField
            fullWidth
            label="Task Name"
            value={currentTask?.name || ''}
            onChange={(e) => setCurrentTask({
              ...currentTask!,
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
                value={currentTask?.category || 'To Do'}
                label="Category"
                onChange={(e) => setCurrentTask({
                  ...currentTask!,
                  category: e.target.value as Category
                })}
              >
                {Object.keys(CATEGORY_COLORS).map(category => (
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
                        backgroundColor: CATEGORY_COLORS[category as Category]
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
                value={currentTask?.priority || 'medium'}
                label="Priority"
                onChange={(e) => setCurrentTask({
                  ...currentTask!,
                  priority: e.target.value as 'low' | 'medium' | 'high'
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
            value={currentTask?.description || ''}
            onChange={(e) => setCurrentTask({
              ...currentTask!,
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
              {currentTask?.startDate} to {currentTask?.endDate}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {currentTask?.id && (
              <Button 
                color="error" 
                variant="outlined"
                onClick={() => {
                  deleteTask(currentTask.id!);
                  setModalOpen(false);
                }}
                sx={{ mr: 'auto' }}
              >
                Delete
              </Button>
            )}
            
            <Button 
              variant="outlined"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            
            <Button 
              variant="contained" 
              onClick={() => {
                if (!currentTask?.name) return;
                
                const taskData = {
                  ...currentTask,
                  name: currentTask.name,
                  category: currentTask.category || 'To Do',
                  startDate: currentTask.startDate || format(new Date(), 'yyyy-MM-dd'),
                  endDate: currentTask.endDate || format(new Date(), 'yyyy-MM-dd'),
                  priority: currentTask.priority || 'medium',
                  description: currentTask.description || ''
                };
                
                if (currentTask?.id) {
                  updateTask(taskData as Task);
                } else {
                  addTask({
                    ...taskData,
                    id: Date.now().toString()
                  } as Task);
                }
                setModalOpen(false);
              }}
            >
              {currentTask?.id ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}