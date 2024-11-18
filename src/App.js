import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import CardSort from './components/CardSort/CardSort';
import ParticipantView from './components/CardSort/ParticipantView';
import { useState, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      `,
    },
  },
});

function App() {
  const [mode, setMode] = useState('light');

  const themeMode = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
      }),
    [mode],
  );

  const ThemeToggle = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1100,
      }}
    >
      <IconButton
        onClick={() => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))}
        color="inherit"
        sx={{
          bgcolor: themeMode.palette.background.paper,
          '&:hover': {
            bgcolor: themeMode.palette.action.hover,
          },
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <ThemeToggle />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/card-sort" element={<CardSort />} />
            <Route path="/participant/:configId" element={
              <ParticipantView 
                onSubmit={async (data) => {
                  // TODO: Implement submission to backend
                  console.log('Participant submitted:', data);
                }} 
              />
            } />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
