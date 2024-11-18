import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export function SortableItem({ id, children, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    position: 'relative',
    marginBottom: '8px',
    fontSize: '16px',
    fontFamily: 'Inter',
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      elevation={isDragging ? 4 : 1}
      sx={{
        p: 2,
        '&:hover': {
          '& .delete-button': {
            opacity: 1,
          },
        },
        '& *': {
          fontSize: '16px',
          fontFamily: 'Inter',
        }
      }}
    >
      <Box sx={{ pr: 4 }}>
        {children}
        <IconButton
          className="delete-button"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            opacity: 0,
            transition: 'opacity 0.2s',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}
