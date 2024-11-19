import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography,
} from '@mui/material';
import { PrimaryButton, TextButton } from '../common/Button';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  configId?: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onClose,
  configId,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = configId
    ? `${window.location.origin}${window.location.pathname}#/card-sort/${configId}`
    : '';

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [shareUrl]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
        },
      }}
    >
      <DialogTitle>Share Card Sort Study</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>
            Share this link with participants to let them access your card sort study:
          </Typography>
          <TextField
            fullWidth
            value={shareUrl}
            InputProps={{
              readOnly: true,
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <TextButton onClick={onClose}>
          Close
        </TextButton>
        <PrimaryButton onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy Link'}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
