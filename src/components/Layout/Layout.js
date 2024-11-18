import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SortIcon from '@mui/icons-material/Sort';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidthOpen = 240;
const drawerWidthClosed = 65;
const transitionDuration = 200;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Card Sort', icon: <SortIcon />, path: '/card-sort' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.default,
      }}
    >
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: `calc(100% - ${drawerWidthClosed}px)`,
          ml: `${drawerWidthClosed}px`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: transitionDuration,
          }),
          ...(isDrawerOpen && {
            width: `calc(100% - ${drawerWidthOpen}px)`,
            ml: `${drawerWidthOpen}px`,
          }),
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            UX Research Tools
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        onMouseEnter={() => setIsDrawerOpen(true)}
        onMouseLeave={() => setIsDrawerOpen(false)}
        sx={{
          width: isDrawerOpen ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: isDrawerOpen ? drawerWidthOpen : drawerWidthClosed,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: transitionDuration,
            }),
            overflowX: 'hidden',
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'hidden' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 255, 0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isDrawerOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: theme.palette.mode === 'light' ? 'inherit' : 'white',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: isDrawerOpen ? 1 : 0,
                    transition: theme.transitions.create('opacity', {
                      duration: transitionDuration,
                    }),
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Container 
        maxWidth="xl" 
        sx={{ 
          flexGrow: 1,
          py: 4,
          pl: `${drawerWidthClosed + 24}px`,
          transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.sharp,
            duration: transitionDuration,
          }),
          ...(isDrawerOpen && {
            pl: `${drawerWidthOpen + 24}px`,
          }),
          '& *': {
            fontFamily: 'Inter, sans-serif',
          }
        }}
      >
        <Toolbar />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 3,
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;
