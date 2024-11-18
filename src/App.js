import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import CardSort from './components/CardSort/CardSort';
import ParticipantView from './components/CardSort/ParticipantView';
import { useState, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#0000FF',
            light: '#3333FF',
            dark: '#0000CC',
            contrastText: '#FFFFFF',
          },
          background: {
            default: mode === 'light' ? '#FFFFFF' : '#121212',
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
          },
          text: {
            primary: mode === 'light' ? '#000000' : '#FFFFFF',
          },
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 16,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
              contained: {
                backgroundColor: '#0000FF',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#0000CC',
                },
              },
              outlined: {
                borderColor: '#0000FF',
                color: '#0000FF',
                '&:hover': {
                  borderColor: '#0000FF',
                  backgroundColor: 'rgba(0, 0, 255, 0.04)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                '&:hover': {
                  color: '#0000FF',
                },
              },
            },
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
          bgcolor: theme.palette.background.paper,
          '&:hover': {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
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
