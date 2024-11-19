import React from 'react';
import { Paper, Typography, Stack, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { CategoryType, CardItem } from '../../types';

interface CategoryProps {
  category: CategoryType;
  activeId?: string | null;
  onDelete: (categoryId: string) => void;
}

export const Category: React.FC<CategoryProps> = ({
  category,
  activeId,
  onDelete,
}) => {
  const { setNodeRef } = useDroppable({
    id: category.id,
  });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2.5,
        width: '100%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          boxShadow: '0 6px 8px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2.5}
      >
        <Typography variant="h6">
          {category.name}
        </Typography>
        <IconButton
          onClick={() => onDelete(category.id)}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'error.main',
              backgroundColor: 'error.light',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      <SortableContext
        items={category.items.map((item: CardItem) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing={1} sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
          {category.items.map((item: CardItem) => (
            <SortableItem
              key={item.id}
              id={item.id}
              isDragging={activeId === item.id}
            >
              {item.content}
            </SortableItem>
          ))}
        </Stack>
      </SortableContext>
    </Paper>
  );
};
