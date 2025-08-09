// components/coins/SearchBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Paper,
  Box,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search coins...",
  debounceMs = 500,
  value: controlledValue,
  onChange,
}: SearchBarProps) {
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  
  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = controlledValue !== undefined ? (onChange || (() => {})) : setInternalValue;

  // Debounce the search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <Paper 
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        backgroundColor: theme.palette.background.default,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s ease-in-out',
        '&:focus-within': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  size="small"
                  edge="end"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                      backgroundColor: alpha(theme.palette.text.primary, 0.08),
                    },
                  }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiInputBase-input': {
                fontSize: '1rem',
                py: 1.5,
                '&::placeholder': {
                  color: 'text.secondary',
                  opacity: 0.7,
                },
              },
            },
          }
        }}
      />
    </Paper>
  );
}