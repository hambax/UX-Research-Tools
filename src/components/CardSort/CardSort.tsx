import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Container,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Category } from './Category';
import { AddCardDialog } from './AddCardDialog';
import { AddCategoryDialog } from './AddCategoryDialog';
import { FileUploadHandler } from './FileUploadHandler';
import ExportDialog from './ExportDialog';
import { PrimaryButton, SecondaryButton } from '../common/Button';
import { CardItem, CategoryType } from '../../types';

const CardSort: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<CardItem[]>([
    { id: 'item-1', content: 'Home' },
    { id: 'item-2', content: 'Products' },
    { id: 'item-3', content: 'About Us' },
    { id: 'item-4', content: 'Contact' },
  ]);

  const [categories, setCategories] = useState<CategoryType[]>([
    { id: 'category-1', name: 'Navigation', items: [] },
    { id: 'category-2', name: 'Content', items: [] },
    { id: 'category-3', name: 'Footer', items: [] },
  ]);

  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the category being dragged over
    const overCategory = categories.find(category => 
      category.id === overId || category.items.some(item => item.id === overId)
    );
    if (!overCategory) return;

    setCategories(prevCategories => {
      // Remove item from its current location (either items list or another category)
      const activeItem = items.find(item => item.id === activeId) || 
        prevCategories.flatMap(cat => cat.items).find(item => item.id === activeId);
      
      if (!activeItem) return prevCategories;

      // Remove from items list if it's there
      setItems(prevItems => prevItems.filter(item => item.id !== activeId));

      // Remove from any category it might be in
      const updatedCategories = prevCategories.map(category => ({
        ...category,
        items: category.items.filter(item => item.id !== activeId)
      }));

      // Add to the target category
      return updatedCategories.map(category => {
        if (category.id === overCategory.id) {
          return {
            ...category,
            items: [...category.items, activeItem]
          };
        }
        return category;
      });
    });
  }, [categories, items]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Handle reordering within the items list
    if (!categories.some(cat => cat.items.some(item => item.id === overId))) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === activeId);
        const newIndex = items.findIndex(item => item.id === overId);
        
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, [categories]);

  const handleAddCard = useCallback((content: string) => {
    const newItem: CardItem = {
      id: `item-${Date.now()}`,
      content,
    };
    setItems((prevItems) => [...prevItems, newItem]);
  }, []);

  const handleAddCategory = useCallback((name: string) => {
    const newCategory: CategoryType = {
      id: `category-${Date.now()}`,
      name,
      items: [],
    };
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  }, []);

  const handleDeleteCategory = useCallback((categoryId: string) => {
    setCategories(prevCategories => {
      const categoryToDelete = prevCategories.find(cat => cat.id === categoryId);
      if (!categoryToDelete) return prevCategories;

      // Move all items from the deleted category back to the items list
      setItems(prevItems => [...prevItems, ...categoryToDelete.items]);

      // Remove the category
      return prevCategories.filter(cat => cat.id !== categoryId);
    });
  }, []);

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ py: 2.5 }}>
        <Stack direction="column" spacing={2.5} mb={2.5} alignItems="flex-start">
          <Typography variant="h4" component="h1">
            Card Sort Study
          </Typography>
          <Stack direction="row" spacing={2.5} sx={{ flexWrap: 'wrap' }}>
            <SecondaryButton onClick={() => setAddCardDialogOpen(true)}>
              Add Card
            </SecondaryButton>
            <SecondaryButton onClick={() => setAddCategoryDialogOpen(true)}>
              Add Category
            </SecondaryButton>
            <FileUploadHandler
              onImport={(newItems) => {
                setItems(newItems);
              }}
            />
            <SecondaryButton onClick={() => setExportDialogOpen(true)}>
              Export Results
            </SecondaryButton>
          </Stack>
        </Stack>

        <Box sx={{ 
          display: 'flex', 
          gap: '20px',
          flexDirection: 'row',
          alignItems: 'flex-start',
          minWidth: 0, // Allow container to shrink
        }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Paper sx={{ 
              p: 2.5, 
              width: '240px',
              flex: '0 0 240px',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              height: 'fit-content',
            }}>
              <Typography variant="h6" mb={2.5}>
                Items
              </Typography>
              <SortableContext
                items={items?.map(item => item?.id).filter(Boolean) || []}
                strategy={verticalListSortingStrategy}
              >
                <Stack spacing={1}>
                  {items?.map(item => item && (
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

            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                flex: 1,
                minWidth: 0, // Allow container to shrink
              }}
            >
              {categories?.map(category => category && (
                <Category
                  key={category.id}
                  category={category}
                  activeId={activeId}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </Box>
          </DndContext>
        </Box>
      </Box>

      <AddCardDialog
        open={addCardDialogOpen}
        onClose={() => setAddCardDialogOpen(false)}
        onAdd={handleAddCard}
      />
      <AddCategoryDialog
        open={addCategoryDialogOpen}
        onClose={() => setAddCategoryDialogOpen(false)}
        onAdd={handleAddCategory}
      />
      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        items={items}
        categories={categories}
      />
    </Container>
  );
};

export default CardSort;
