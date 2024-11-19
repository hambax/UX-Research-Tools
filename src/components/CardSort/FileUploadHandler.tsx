import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { CardItem, CategoryType } from '../../types';
import { SecondaryButton } from '../common/Button';

interface FileUploadHandlerProps {
  onImport: (items: CardItem[]) => void;
}

export const FileUploadHandler: React.FC<FileUploadHandlerProps> = ({
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let items: CardItem[] = [];
        
        if (file.name.endsWith('.csv')) {
          // Handle CSV
          const text = e.target?.result as string;
          const rows = text.split('\n').map(row => row.trim()).filter(Boolean);
          items = rows.map((content, index) => ({
            id: `item-${index + 1}`,
            content: content.replace(/^["']|["']$/g, ''), // Remove quotes if present
          }));
        } else {
          // Handle XLSX
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Try to find the content column
          const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
          const contentColumn = ['content', 'item', 'card'].find(header => {
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
              if (cell?.v?.toString().toLowerCase() === header) return true;
            }
            return false;
          });

          if (contentColumn) {
            // If we found a header, use it
            const rawData = XLSX.utils.sheet_to_json(worksheet) as any[];
            items = rawData.map((row, index) => ({
              id: `item-${index + 1}`,
              content: row[contentColumn]?.toString() || '',
            })).filter(item => item.content);
          } else {
            // If no header found, take the first column
            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
            items = rawData.map((row, index) => ({
              id: `item-${index + 1}`,
              content: row[0]?.toString() || '',
            })).filter(item => item.content);
          }
        }

        if (items.length === 0) {
          throw new Error('No valid items found in file');
        }

        onImport(items);
      } catch (error) {
        console.error('Error importing file:', error);
        alert('Error importing file. Please make sure the file format is correct.');
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xlsx,.csv"
        onChange={handleImport}
      />
      <SecondaryButton onClick={() => fileInputRef.current?.click()}>
        Upload Data
      </SecondaryButton>
    </>
  );
};
