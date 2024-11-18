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
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(20px)',
          borderRadius: 2,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          '& *': {
            fontFamily: 'Inter, sans-serif',
          }
        }
      }}
    >
      <DialogTitle>Share Card Sort</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: '20px' }}>
          <Typography variant="body1" gutterBottom>
            Share this link with participants to collect their card sorting results.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '20px',
            mt: '20px' 
          }}>
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
            <Button
              variant="contained"
              onClick={handleCopyLink}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Copy Link
            </Button>
          </Box>
          {copied && (
            <Alert severity="success" sx={{ mt: '20px' }}>
              Link copied to clipboard!
            </Alert>
          )}
        </Box>
        
        <Box sx={{ mb: '20px' }}>
          <Typography variant="body1" gutterBottom>
            Or send via email:
          </Typography>
          <Box sx={{ display: 'flex', gap: '20px', mt: '20px' }}>
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
