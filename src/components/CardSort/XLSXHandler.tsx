import React, { useRef } from 'react';
import { Button, Stack } from '@mui/material';
import * as XLSX from 'xlsx';
import { CardItem, CategoryType } from '../../types';
import { SecondaryButton } from '../common/Button';

interface XLSXHandlerProps {
  items: CardItem[];
  categories: CategoryType[];
  onImport: (data: { items: CardItem[]; categories: CategoryType[] }) => void;
}

export const XLSXHandler: React.FC<XLSXHandlerProps> = ({
  items,
  categories,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    // Create worksheets for items and categories
    const itemsWS = XLSX.utils.json_to_sheet(items);
    const categoriesData = categories.map(category => ({
      id: category.id,
      name: category.name,
      items: JSON.stringify(category.items),
    }));
    const categoriesWS = XLSX.utils.json_to_sheet(categoriesData);

    // Create workbook and add worksheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, itemsWS, 'Items');
    XLSX.utils.book_append_sheet(wb, categoriesWS, 'Categories');

    // Save file
    XLSX.writeFile(wb, 'card-sort-data.xlsx');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Read items
        const itemsSheet = workbook.Sheets['Items'];
        const importedItems = XLSX.utils.sheet_to_json(itemsSheet) as CardItem[];

        // Read categories
        const categoriesSheet = workbook.Sheets['Categories'];
        const rawCategories = XLSX.utils.sheet_to_json(categoriesSheet) as any[];
        const importedCategories = rawCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          items: JSON.parse(cat.items),
        }));

        onImport({
          items: importedItems,
          categories: importedCategories,
        });
      } catch (error) {
        console.error('Error importing file:', error);
        alert('Error importing file. Please make sure the file format is correct.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Stack direction="row" spacing={2}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xlsx"
        onChange={handleImport}
      />
      <SecondaryButton onClick={() => fileInputRef.current?.click()}>
        Import XLSX
      </SecondaryButton>
      <SecondaryButton onClick={handleExport}>
        Export XLSX
      </SecondaryButton>
    </Stack>
  );
};
