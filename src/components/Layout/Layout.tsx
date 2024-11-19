import React from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(160deg, #e6f3ff 0%, #f0f7ff 100%)' }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 500 }}
          >
            Card Sort Exercise
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 7, sm: 8 }, // Adjusted padding for AppBar height
          px: 2.5, // 20px horizontal padding
          minWidth: 0, // Allow container to shrink
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
