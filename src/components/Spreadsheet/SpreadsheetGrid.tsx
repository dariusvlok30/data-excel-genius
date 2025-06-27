
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CellData {
  value: string | number;
  formula?: string;
  style?: Record<string, any>;
}

interface SpreadsheetGridProps {
  data: CellData[][];
  onCellChange: (row: number, col: number, value: string) => void;
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  data,
  onCellChange,
  selectedCell,
  onCellSelect,
}) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const handleCellDoubleClick = (row: number, col: number) => {
    const cell = data[row]?.[col];
    setEditingCell({ row, col });
    setEditValue(cell?.formula || String(cell?.value || ''));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (editingCell) {
        onCellChange(editingCell.row, editingCell.col, editValue);
        setEditingCell(null);
        setEditValue('');
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleInputBlur = () => {
    if (editingCell) {
      onCellChange(editingCell.row, editingCell.col, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const getColumnLabel = (index: number) => {
    let label = '';
    let temp = index;
    while (temp >= 0) {
      label = String.fromCharCode(65 + (temp % 26)) + label;
      temp = Math.floor(temp / 26) - 1;
    }
    return label;
  };

  const rows = Math.max(data.length, 50);
  const cols = Math.max(data[0]?.length || 0, 26);

  return (
    <div className="overflow-auto h-full border border-gray-200 rounded-lg bg-white">
      <div className="inline-block min-w-full">
        {/* Header row */}
        <div className="flex sticky top-0 z-10">
          <div className="w-12 h-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-xs font-medium">
            #
          </div>
          {Array.from({ length: cols }, (_, colIndex) => (
            <div
              key={colIndex}
              className="w-24 h-8 bg-gray-100 border-r border-gray-300 flex items-center justify-center text-xs font-medium"
            >
              {getColumnLabel(colIndex)}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex">
            <div className="w-12 h-8 bg-gray-50 border-r border-b border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
              {rowIndex + 1}
            </div>
            {Array.from({ length: cols }, (_, colIndex) => {
              const cell = data[rowIndex]?.[colIndex];
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;

              return (
                <div
                  key={colIndex}
                  className={cn(
                    "w-24 h-8 border-r border-b border-gray-300 relative cursor-cell hover:bg-blue-50 transition-colors",
                    isSelected && "ring-2 ring-blue-500 bg-blue-50",
                    cell?.style?.backgroundColor && `bg-${cell.style.backgroundColor}`
                  )}
                  onClick={() => onCellSelect(rowIndex, colIndex)}
                  onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                >
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      onBlur={handleInputBlur}
                      className="w-full h-full px-1 text-xs border-none outline-none bg-white"
                    />
                  ) : (
                    <div className="w-full h-full px-1 flex items-center text-xs truncate">
                      {String(cell?.value || '')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
