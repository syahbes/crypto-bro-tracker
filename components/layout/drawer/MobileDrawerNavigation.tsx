// components/layout/drawer/MobileDrawerNavigation.tsx
'use client';

import React from 'react';
import { List, ListItem, ListItemText, useTheme } from '@mui/material';

interface NavigationItem {
  text: string;
  href: string;
}

interface MobileDrawerNavigationProps {
  onNavigate: (href: string) => void;
}

export default function MobileDrawerNavigation({ onNavigate }: MobileDrawerNavigationProps) {
  const theme = useTheme();

  const menuItems: NavigationItem[] = [
    { text: 'Home', href: '/' },
    { text: 'Portfolio', href: '/portfolio' },
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem 
          key={item.text} 
          onClick={() => onNavigate(item.href)}
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          }}
        >
          <ListItemText 
            primary={item.text} 
            sx={{ 
              '& .MuiListItemText-primary': {
                fontWeight: 500,
                color: theme.palette.text.primary,
              }
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}