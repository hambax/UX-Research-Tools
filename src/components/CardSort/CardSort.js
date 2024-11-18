import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Alert,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import * as XLSX from 'xlsx';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Droppable } from './Droppable';
import ShareDialog from './ShareDialog';

const CardSort = ({ readOnly, configId }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [importError, setImportError] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [results, setResults] = useState({});
  const [exportFormat, setExportFormat] = useState('json');
  const [shareableLink, setShareableLink] = useState('');

  useEffect(() => {
    if (configId) {
      // TODO: Fetch configuration from backend
      // For now, we'll use mock data
      const mockConfig = {
        items: [
          { id: '1', content: 'Example Item 1' },
          { id: '2', content: 'Example Item 2' },
        ],
        categories: [
          { 
            id: '1', 
            name: 'Example Category',
            items: []
          }
        ]
      };
      setItems(mockConfig.items);
      setCategories(mockConfig.categories);
    }
  }, [configId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || !active) return;

    const activeContainer = active.data?.current?.sortable?.containerId || 'uncategorized';
    const overContainer = over.data?.current?.sortable?.containerId || over.id;

    if (activeContainer !== overContainer) {
      const activeItem = items.find(item => item.id === active.id) || 
        categories.flatMap(cat => cat.items).find(item => item.id === active.id);
      
      if (!activeItem) return;

      if (activeContainer === 'uncategorized') {
        setItems(items => items.filter(i => i.id !== active.id));
        if (overContainer !== 'uncategorized') {
          setCategories(categories => categories.map(cat =>
            cat.id === overContainer
              ? { ...cat, items: [...cat.items, activeItem] }
              : cat
          ));
        }
      } else {
        setCategories(categories => categories.map(cat =>
          cat.id === activeContainer
            ? { ...cat, items: cat.items.filter(i => i.id !== active.id) }
            : cat
        ));
        if (overContainer === 'uncategorized') {
          setItems(items => [...items, activeItem]);
        } else {
          setCategories(categories => categories.map(cat =>
            cat.id === overContainer
              ? { ...cat, items: [...cat.items, activeItem] }
              : cat
          ));
        }
      }
    }
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || !active) return;

    const activeContainer = active.data?.current?.sortable?.containerId || 'uncategorized';
    const overContainer = over.data?.current?.sortable?.containerId || over.id;

    if (activeContainer === overContainer) {
      if (activeContainer === 'uncategorized') {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          setItems(items => arrayMove(items, oldIndex, newIndex));
        }
      } else {
        const category = categories.find(cat => cat.id === activeContainer);
        if (category) {
          const oldIndex = category.items.findIndex(item => item.id === active.id);
          const newIndex = category.items.findIndex(item => item.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            setCategories(categories => categories.map(cat =>
              cat.id === activeContainer
                ? { ...cat, items: arrayMove(cat.items, oldIndex, newIndex) }
                : cat
            ));
          }
        }
      }
    }
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      setItems(items => [...items, { id: Date.now().toString(), content: newItemText.trim() }]);
      setNewItemText('');
      setOpenItemDialog(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        items: []
      };
      setCategories(categories => [...categories, newCategory]);
      setNewCategoryName('');
      setOpenCategoryDialog(false);
    }
  };

  const handleRemoveItem = (id) => {
    setItems(items => items.filter(item => item.id !== id));
  };

  const handleRemoveCategory = (id) => {
    // Move items back to uncategorized before removing category
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setItems(items => [...items, ...category.items]);
    }
    setCategories(categories => categories.filter(cat => cat.id !== id));
  };

  const handleExportResults = () => {
    const results = {
      uncategorized: items.map(item => ({ id: item.id, content: item.content })),
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        items: category.items.map(item => ({ id: item.id, content: item.content }))
      }))
    };
    setResults(results);
    setOpenResultsDialog(true);
  };

  const handleDownload = () => {
    let content = '';
    let filename = `card-sort-results-${new Date().toISOString().split('T')[0]}`;
    let mimeType = '';

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(results, null, 2);
        filename += '.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        // Convert to CSV format
        const csvRows = [];
        // Add header
        csvRows.push(['Category', 'Item']);
        // Add uncategorized items
        results.uncategorized.forEach(item => {
          csvRows.push(['Uncategorized', item.content]);
        });
        // Add categorized items
        results.categories.forEach(category => {
          category.items.forEach(item => {
            csvRows.push([category.name, item.content]);
          });
        });
        content = csvRows.map(row => row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(',')).join('\\n');
        filename += '.csv';
        mimeType = 'text/csv';
        break;
      case 'txt':
        // Convert to plain text format
        const txtContent = [];
        txtContent.push('Card Sort Results\\n');
        txtContent.push('\\nUncategorized Items:');
        results.uncategorized.forEach(item => {
          txtContent.push(`- ${item.content}`);
        });
        results.categories.forEach(category => {
          txtContent.push(`\\n${category.name}:`);
          category.items.forEach(item => {
            txtContent.push(`- ${item.content}`);
          });
        });
        content = txtContent.join('\\n');
        filename += '.txt';
        mimeType = 'text/plain';
        break;
      case 'html':
        // Convert to HTML format
        const htmlContent = [];
        htmlContent.push('<html><head><title>Card Sort Results</title></head><body>');
        htmlContent.push('<h1>Card Sort Results</h1>');
        htmlContent.push('<h2>Uncategorized Items</h2><ul>');
        results.uncategorized.forEach(item => {
          htmlContent.push(`<li>${item.content}</li>`);
        });
        htmlContent.push('</ul>');
        results.categories.forEach(category => {
          htmlContent.push(`<h2>${category.name}</h2><ul>`);
          category.items.forEach(item => {
            htmlContent.push(`<li>${item.content}</li>`);
          });
          htmlContent.push('</ul>');
        });
        htmlContent.push('</body></html>');
        content = htmlContent.join('\\n');
        filename += '.html';
        mimeType = 'text/html';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const processCSV = (text) => {
    // Split by newline and handle both \n and \r\n
    const rows = text.split(/\\r?\\n/);
    
    // Process each row and split by comma, handling quoted values
    const processedRows = rows.flatMap(row => {
      // Skip empty rows
      if (!row.trim()) return [];
      
      // Handle quoted values containing commas
      const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [row];
      return matches.map(cell => {
        // Remove quotes and trim
        const cleaned = cell.replace(/^"(.*)"$/, '$1').trim();
        return cleaned;
      });
    });

    return processedRows.filter(cell => cell); // Remove empty cells
  };

  const processXLSX = (data) => {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Convert sheet to array of arrays and flatten
    const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    return rows.flat().filter(cell => cell && String(cell).trim());
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileType)) {
      setImportError('Please upload a CSV or Excel file (xlsx/xls)');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let processedData = [];

        if (fileType === 'csv') {
          processedData = processCSV(e.target.result);
        } else {
          processedData = processXLSX(new Uint8Array(e.target.result));
        }

        // Create cards from processed data
        const newItems = processedData.map(content => ({
          id: Date.now().toString() + Math.random(),
          content: String(content).trim()
        }));

        setItems(prevItems => [...prevItems, ...newItems]);
        setOpenImportDialog(false);
        setImportError('');
      } catch (error) {
        console.error('Import error:', error);
        setImportError('Error processing file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      setImportError('Error reading the file. Please try again.');
    };

    if (fileType === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleShare = () => {
    const config = {
      items,
      categories
    };
    
    // TODO: Save configuration to backend and get a real ID
    const mockConfigId = 'abc123';
    const shareableUrl = `${window.location.origin}/participant/${mockConfigId}`;
    setShareableLink(shareableUrl);
    setOpenShareDialog(true);
  };

  const handleSendEmail = (email) => {
    // TODO: Implement email sending functionality
    console.log('Sending email to:', email);
    // For now, we'll just close the dialog
    setOpenShareDialog(false);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ 
        maxWidth: '100%',
      }}>
        <Box sx={{ mb: '20px' }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2rem' }, 
              fontFamily: 'Inter',
              mb: '20px'
            }}
          >
            Card Sort Exercise
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              '& > button': { 
                flex: { xs: '1 1 100%', sm: '0 1 auto' },
                minWidth: { sm: '150px' },
                fontSize: '0.9rem',
                fontFamily: 'Inter',
                whiteSpace: 'nowrap',
              }
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenItemDialog(true)}
            >
              Add New Card
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCategoryDialog(true)}
            >
              Add New Category
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setOpenImportDialog(true)}
            >
              Import Data
            </Button>
            <Button
              variant="outlined"
              onClick={handleExportResults}
            >
              Export Results
            </Button>
            {!readOnly && (
              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Share
              </Button>
            )}
          </Stack>
        </Box>

        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fit, minmax(280px, 1fr))',
              md: 'repeat(auto-fit, minmax(300px, 1fr))',
              lg: 'repeat(auto-fit, minmax(320px, 1fr))',
            },
            gap: '20px',
            pb: '20px',
            mr: '20px',
            '& > *': {
              minWidth: 'unset !important',
              width: '100%',
            }
          }}
        >
          {/* Uncategorized Items Column */}
          <Paper 
            elevation={2}
            sx={{ 
              p: '20px',
              height: {
                xs: 'calc(100vh - 250px)',
                sm: 'calc(100vh - 200px)'
              },
              display: 'flex',
              flexDirection: 'column',
              '& *': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontFamily: 'Inter',
              }
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: '20px', fontSize: '1.25rem' }}>
              Uncategorized Items
            </Typography>

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Droppable id="uncategorized" items={items}>
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    onRemove={() => handleRemoveItem(item.id)}
                  >
                    {item.content}
                  </SortableItem>
                ))}
              </Droppable>
            </Box>
          </Paper>

          {/* Categories */}
          {categories.map((category) => (
            <Paper
              key={category.id}
              sx={{
                p: '20px',
                height: {
                  xs: 'calc(100vh - 250px)',
                  sm: 'calc(100vh - 200px)'
                },
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '& *': {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontFamily: 'Inter',
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: '20px' 
              }}>
                <Typography variant="h6" sx={{ fontSize: '1.25rem' }}>
                  {category.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveCategory(category.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Droppable id={category.id} items={category.items}>
                  {category.items.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      onRemove={() => {
                        setItems(items => [...items, item]);
                        setCategories(categories => categories.map(cat =>
                          cat.id === category.id
                            ? { ...cat, items: cat.items.filter(i => i.id !== item.id) }
                            : cat
                        ));
                      }}
                    >
                      {item.content}
                    </SortableItem>
                  ))}
                </Droppable>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Add Item Dialog */}
        <Dialog 
          open={openItemDialog} 
          onClose={() => setOpenItemDialog(false)}
          PaperProps={{
            sx: {
              '& *': {
                fontSize: '16px',
                fontFamily: 'Inter',
              }
            }
          }}
        >
          <DialogTitle>Add New Card</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Card Text"
              fullWidth
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenItemDialog(false)}>Cancel</Button>
            <Button onClick={handleAddItem} variant="contained" disabled={!newItemText.trim()}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog 
          open={openCategoryDialog} 
          onClose={() => setOpenCategoryDialog(false)}
          PaperProps={{
            sx: {
              '& *': {
                fontSize: '16px',
                fontFamily: 'Inter',
              }
            }
          }}
        >
          <DialogTitle>Add New Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCategory} variant="contained" disabled={!newCategoryName.trim()}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Results Dialog */}
        <Dialog 
          open={openResultsDialog} 
          onClose={() => setOpenResultsDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              '& *': {
                fontSize: '16px',
                fontFamily: 'Inter',
              }
            }
          }}
        >
          <DialogTitle>Card Sort Results</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: '20px' }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="export-format-label">Format</InputLabel>
                  <Select
                    labelId="export-format-label"
                    value={exportFormat}
                    label="Format"
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <MenuItem value="json">JSON</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="txt">Text</MenuItem>
                    <MenuItem value="html">HTML</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </Stack>
            </Box>
            <Box 
              sx={{ 
                backgroundColor: (theme) => theme.palette.grey[100],
                p: '20px',
                borderRadius: 1,
                maxHeight: '400px',
                overflow: 'auto'
              }}
            >
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                {JSON.stringify(results, null, 2)}
              </pre>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenResultsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Import Dialog */}
        <Dialog 
          open={openImportDialog} 
          onClose={() => {
            setOpenImportDialog(false);
            setImportError('');
          }}
          PaperProps={{
            sx: {
              '& *': {
                fontSize: '16px',
                fontFamily: 'Inter',
              }
            }
          }}
        >
          <DialogTitle>Import Data</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: '20px' }}>
              <Typography variant="body1" gutterBottom>
                Please select a file to import. Each cell in your file will be converted into a separate card.
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Supported formats: .csv, .xlsx, .xls
              </Typography>
              {importError && (
                <Alert severity="error" sx={{ mt: '20px' }}>
                  {importError}
                </Alert>
              )}
            </Box>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileImport}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadIcon />}
              >
                Browse Files
              </Button>
            </label>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenImportDialog(false);
                setImportError('');
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Share Dialog */}
        <ShareDialog
          open={openShareDialog}
          onClose={() => setOpenShareDialog(false)}
          shareableLink={shareableLink}
          onSendEmail={handleSendEmail}
        />

        <DragOverlay>
          {activeId ? (
            <SortableItem id={activeId}>
              {items.find(item => item.id === activeId)?.content ||
                categories.flatMap(cat => cat.items).find(item => item.id === activeId)?.content ||
                ''}
            </SortableItem>
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default CardSort;
