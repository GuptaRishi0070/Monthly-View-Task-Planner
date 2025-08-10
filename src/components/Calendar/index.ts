import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CalendarHeader } from './CalendarHeader';
import { WeekdayHeader } from './WeekdayHeader';
import { CalendarGrid } from './CalendarGrid';
import { Filters } from './Filters';
import { TaskModal } from './TaskModal';
import { getNextMonth, getPrevMonth, parseISO, addDays } from '../../utils/dateUtils';
import type { Task, Filters as FiltersType } from '../../types/calendar';
import { Paper, Box } from '@mui/material';

export const MonthViewTaskPlanner = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [dragSelection, setDragSelection] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [filters, setFilters] = useState<FiltersType>({
    categories: ['To Do', 'In Progress', 'Review', 'Completed'],
    timeRange: null,
    searchQuery: '',
    priorities: ['low', 'medium', 'high']
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      const taskStart = parseISO(task.startDate);
      const taskEnd = parseISO(task.endDate);

      if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
        return false;
      }

      if (task.priority && filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }

      if (filters.searchQuery && !task.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

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

  // Navigation
  const prevMonth = () => setCurrentMonth(getPrevMonth(currentMonth));
  const nextMonth = () => setCurrentMonth(getNextMonth(currentMonth));
  const goToToday = () => setCurrentMonth(new Date());

  // Task operations
  const addTask = (task: Task) => setTasks([...tasks, task]);
  const updateTask = (task: Task) => setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  const deleteTask = (id: string) => setTasks(tasks.filter((task) => task.id !== id));

  // Drag selection
  const handleDayMouseDown = (date: Date) => setDragSelection({ start: date, end: date });
  const handleDayMouseEnter = (date: Date) => {
    if (dragSelection.start) setDragSelection((prev) => ({ ...prev, end: date }));
  };
  const handleMouseUp = () => {
    if (dragSelection.start && dragSelection.end) {
      const start = dragSelection.start < dragSelection.end ? dragSelection.start : dragSelection.end;
      const end = dragSelection.start < dragSelection.end ? dragSelection.end : dragSelection.start;

      setCurrentTask({
        name: '',
        category: 'To Do',
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        priority: 'medium'
      });
      setModalOpen(true);
    }
    setDragSelection({ start: null, end: null });
  };

  // Save task
  const handleSaveTask = () => {
    if (!currentTask?.name) return;

    if (currentTask.id) {
      updateTask({
        id: currentTask.id,
        name: currentTask.name,
        category: currentTask.category ?? 'To Do',
        startDate: currentTask.startDate ?? new Date().toISOString().split('T')[0],
        endDate: currentTask.endDate ?? new Date().toISOString().split('T')[0],
        priority: currentTask.priority ?? 'medium',
        description: currentTask.description ?? ''
      });
    } else {
      addTask({
        id: Date.now().toString(),
        name: currentTask.name,
        category: currentTask.category ?? 'To Do',
        startDate: currentTask.startDate ?? new Date().toISOString().split('T')[0],
        endDate: currentTask.endDate ?? new Date().toISOString().split('T')[0],
        priority: currentTask.priority ?? 'medium',
        description: currentTask.description ?? ''
      });
    }
    setModalOpen(false);
    setCurrentTask(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Month View Task Planner</h1>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CalendarHeader
          currentMonth={currentMonth}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onToday={goToToday}
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => setFilters({ ...filters, searchQuery: query })}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
        {showFilters && <Filters filters={filters} onFiltersChange={setFilters} />}
      </Paper>

      <WeekdayHeader />

      <CalendarGrid
        currentMonth={currentMonth}
        tasks={filteredTasks}
        onTaskClick={(task) => {
          setCurrentTask(task);
          setModalOpen(true);
        }}
        onTaskDelete={deleteTask}
        onAddTask={(date) => {
          setCurrentTask({
            name: '',
            category: 'To Do',
            startDate: date.toISOString().split('T')[0],
            endDate: date.toISOString().split('T')[0],
            priority: 'medium'
          });
          setModalOpen(true);
        }}
        onMouseDown={handleDayMouseDown}
        onMouseEnter={handleDayMouseEnter}
        onMouseUp={handleMouseUp}
      />

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={currentTask}
        onTaskChange={(task) => setCurrentTask(task)}
        onSave={handleSaveTask}
        onDelete={deleteTask}
      />
    </Box>
  );
};
