import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { CardItem, CategoryType } from '../../types';
import { PrimaryButton, TextButton } from '../common/Button';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  items: CardItem[];
  categories: CategoryType[];
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  items,
  categories,
}) => {
  const [fileType, setFileType] = useState('json');

  const handleFileTypeChange = (event: SelectChangeEvent) => {
    setFileType(event.target.value);
  };

  const exportToJson = () => {
    const data = {
      uncategorizedItems: items,
      categories: categories,
    };
    return JSON.stringify(data, null, 2);
  };

  const exportToCsv = () => {
    const rows = [['Item', 'Category']];
    
    // Add uncategorized items
    items.forEach(item => {
      rows.push([item.content, 'Uncategorized']);
    });

    // Add categorized items
    categories.forEach(category => {
      category.items.forEach(item => {
        rows.push([item.content, category.name]);
      });
    });

    return rows.map(row => row.join(',')).join('\n');
  };

  const exportToText = () => {
    let text = 'Uncategorized Items:\n';
    items.forEach(item => {
      text += `- ${item.content}\n`;
    });

    text += '\nCategories:\n';
    categories.forEach(category => {
      text += `\n${category.name}:\n`;
      category.items.forEach(item => {
        text += `- ${item.content}\n`;
      });
    });

    return text;
  };

  const handleExport = () => {
    let content = '';
    let mimeType = '';
    let fileExtension = '';

    switch (fileType) {
      case 'json':
        content = exportToJson();
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      case 'csv':
        content = exportToCsv();
        mimeType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'text':
        content = exportToText();
        mimeType = 'text/plain';
        fileExtension = 'txt';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `card-sort-results.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

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
      <DialogTitle>Export Results</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="file-type-label">File Type</InputLabel>
            <Select
              labelId="file-type-label"
              value={fileType}
              label="File Type"
              onChange={handleFileTypeChange}
            >
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="text">Text</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <TextButton onClick={onClose}>
          Cancel
        </TextButton>
        <PrimaryButton onClick={handleExport}>
          Export
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
