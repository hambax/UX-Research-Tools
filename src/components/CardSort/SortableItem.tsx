import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography } from '@mui/material';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  isDragging?: boolean;
}

export const SortableItem: React.FC<SortableItemProps> = ({ 
  id, 
  children,
  isDragging = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition: dragTransition,
  } = useSortable({ id });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: '16px',
        cursor: 'grab',
        backgroundColor: isDragging ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(8px)',
        borderRadius: 1.5,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isDragging 
          ? '0 8px 16px rgba(0, 0, 0, 0.1)' 
          : '0 2px 4px rgba(0, 0, 0, 0.03)',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.06)',
          transform: 'translateY(-1px)',
        },
      }}
      {...attributes}
      {...listeners}
    >
      <Typography sx={{ fontSize: 16, lineHeight: 1.3 }}>
        {children}
      </Typography>
    </Paper>
  );
};
