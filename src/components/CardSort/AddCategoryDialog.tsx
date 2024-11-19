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

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');

  const handleAdd = useCallback(() => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
      onClose();
    }
  }, [name, onAdd, onClose]);

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
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a name for the new category..."
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
          disabled={!name.trim()}
        >
          Add Category
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
