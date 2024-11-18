import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';

const ShareDialog = ({ open, onClose, shareableLink, onSendEmail }) => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSendEmail = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    onSendEmail(email);
    setEmail('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          '& *': {
            fontFamily: 'Inter, sans-serif',
          }
        }
      }}
    >
      <DialogTitle>Share Card Sort</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Share this link with participants:
          </Typography>
          <TextField
            fullWidth
            value={shareableLink}
            variant="outlined"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopyLink} edge="end">
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {copied && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Link copied to clipboard!
            </Alert>
          )}
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Or send via email:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              error={!!emailError}
              helperText={emailError}
            />
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={handleSendEmail}
              sx={{ minWidth: '120px' }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
