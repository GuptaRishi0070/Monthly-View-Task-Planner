import React from 'react';
import { Box, Typography, Button, IconButton, TextField } from '@mui/material';
import { Today, ChevronLeft, ChevronRight, Search, FilterList } from '@mui/icons-material';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleFilters: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  searchQuery,
  onSearchChange,
  onToggleFilters
}) => {
  return (
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
          onClick={onToday}
          size="small"
        >
          Today
        </Button>
        <IconButton onClick={onPrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton onClick={onNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
            sx: { borderRadius: 2 }
          }}
          sx={{ width: 250 }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={onToggleFilters}
          size="small"
        >
          Filters
        </Button>
      </Box>
    </Box>
  );
};