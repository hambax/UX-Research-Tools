import React, { useState } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CardSort from './CardSort';
import SendIcon from '@mui/icons-material/Send';

const ParticipantView = ({ configId, onSubmit }) => {
  const [isComplete, setIsComplete] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleComplete = () => {
    setOpenDialog(true);
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    onSubmit({ email, name });
    setOpenDialog(false);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Thank you for participating!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your card sort results have been submitted successfully.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleComplete}
          startIcon={<SendIcon />}
          sx={{
            backgroundColor: '#0000FF',
            '&:hover': {
              backgroundColor: '#0000CC',
            },
          }}
        >
          I'm Done
        </Button>
      </Box>

      <CardSort readOnly configId={configId} />

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Your Results</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              error={!!emailError}
              helperText={emailError}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#0000FF',
              '&:hover': {
                backgroundColor: '#0000CC',
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ParticipantView;
