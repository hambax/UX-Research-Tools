import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box } from '@mui/material';

export function Droppable({ id, items, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Box 
      ref={setNodeRef} 
      sx={{ 
        minHeight: 50,
        transition: 'background-color 0.2s',
        '&:empty': {
          backgroundColor: (theme) => theme.palette.action.hover,
          borderRadius: 1
        },
        '& *': {
          fontSize: '16px',
          fontFamily: 'Inter',
        }
      }}
    >
      <SortableContext 
        id={id} 
        items={items || []} 
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </Box>
  );
}
