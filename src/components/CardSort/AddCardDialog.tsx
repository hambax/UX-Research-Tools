import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import { PrimaryButton, TextButton } from '../common/Button';

interface AddCardDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (content: string) => void;
}

export const AddCardDialog: React.FC<AddCardDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [content, setContent] = useState('');

  const handleAdd = useCallback(() => {
    if (content.trim()) {
      onAdd(content.trim());
      setContent('');
      onClose();
    }
  }, [content, onAdd, onClose]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAdd();
    }
  }, [handleAdd]);

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
      <DialogTitle>Add New Card</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Card Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter the content for your new card..."
            autoFocus
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <TextButton onClick={onClose}>
          Cancel
        </TextButton>
        <PrimaryButton 
          onClick={handleAdd}
          disabled={!content.trim()}
        >
          Add Card
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
