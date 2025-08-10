import React from 'react';
import type { Filters as FiltersType } from '../../types/calendar';
import { CATEGORY_COLORS, PRIORITY_COLORS } from '../../types/calendar';
import { Box, Typography, Chip, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface FiltersProps {
  filters: FiltersType;
  onFiltersChange: (newFilters: FiltersType) => void;
}

export const Filters: React.FC<FiltersProps> = ({ filters, onFiltersChange }) => {
  const handleCategoryToggle = (category: string) => {
    const typedCategory = category as keyof typeof CATEGORY_COLORS;
    const newCategories = filters.categories.includes(typedCategory)
      ? filters.categories.filter(c => c !== typedCategory)
      : [...filters.categories, typedCategory];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriorityToggle = (priority: string) => {
    const typedPriority = priority as keyof typeof PRIORITY_COLORS;
    const newPriorities = filters.priorities.includes(typedPriority)
      ? filters.priorities.filter(p => p !== typedPriority)
      : [...filters.priorities, typedPriority];
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const handleTimeRangeChange = (timeRange: string | null) => {
    onFiltersChange({ ...filters, timeRange });
  };

  return (
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
            {Object.keys(CATEGORY_COLORS).map((category) => {
              const typedCategory = category as keyof typeof CATEGORY_COLORS;
              return (
                <Chip
                  key={category}
                  label={category}
                  clickable
                  variant={filters.categories.includes(typedCategory) ? 'filled' : 'outlined'}
                  onClick={() => handleCategoryToggle(category)}
                  size="small"
                  sx={{
                    backgroundColor: filters.categories.includes(typedCategory) 
                      ? CATEGORY_COLORS[typedCategory] 
                      : undefined,
                    color: filters.categories.includes(typedCategory) ? 'white' : undefined
                  }}
                />
              );
            })}
          </Box>
        </FormControl>
        
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Priorities</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(PRIORITY_COLORS).map(([priority, color]) => {
              const typedPriority = priority as keyof typeof PRIORITY_COLORS;
              return (
                <Chip
                  key={priority}
                  label={priority}
                  clickable
                  variant={filters.priorities.includes(typedPriority) ? 'filled' : 'outlined'}
                  onClick={() => handlePriorityToggle(priority)}
                  size="small"
                  sx={{
                    backgroundColor: filters.priorities.includes(typedPriority) 
                      ? color 
                      : undefined,
                    color: filters.priorities.includes(typedPriority) ? 'white' : undefined
                  }}
                />
              );
            })}
          </Box>
        </FormControl>
        
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Time Range</Typography>
          <RadioGroup
            row
            value={filters.timeRange || ''}
            onChange={(e) => handleTimeRangeChange(e.target.value || null)}
          >
            <FormControlLabel value="1 week" control={<Radio size="small" />} label="1 week" />
            <FormControlLabel value="2 weeks" control={<Radio size="small" />} label="2 weeks" />
            <FormControlLabel value="3 weeks" control={<Radio size="small" />} label="3 weeks" />
            <FormControlLabel value="" control={<Radio size="small" />} label="All" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};