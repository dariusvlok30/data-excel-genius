
import React, { useState, useCallback } from 'react';
import { SpreadsheetGrid } from '@/components/Spreadsheet/SpreadsheetGrid';
import { AIChatSidebar } from '@/components/AI/AIChatSidebar';
import { SpreadsheetToolbar } from '@/components/Toolbar/SpreadsheetToolbar';
import { FileUploadProcessor } from '@/components/FileProcessor/FileUploadProcessor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface Sheet {
  id: string;
  name: string;
  data: any[][];
}

interface CellData {
  value: string | number;
  formula?: string;
  style?: Record<string, any>;
}

const SpreadsheetApp: React.FC = () => {
  const [sheets, setSheets] = useState<Sheet[]>([
    {
      id: '1',
      name: 'Sheet1',
      data: Array(50).fill(null).map(() => Array(26).fill({ value: '' })),
    },
  ]);
  const [activeSheetId, setActiveSheetId] = useState('1');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);

  const handleCellChange = useCallback((row: number, col: number, value: string) => {
    setSheets(prevSheets => {
      return prevSheets.map(sheet => {
        if (sheet.id === activeSheetId) {
          const newData = [...sheet.data];
          if (!newData[row]) {
            newData[row] = Array(26).fill({ value: '' });
          }
          newData[row] = [...newData[row]];
          newData[row][col] = { value };
          return { ...sheet, data: newData };
        }
        return sheet;
      });
    });
    
    toast({
      title: 'Cell updated',
      description: `Cell ${String.fromCharCode(65 + col)}${row + 1} updated.`,
    });
  }, [activeSheetId]);

  const handleCellSelect = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, []);

  const handleFileUpload = useCallback((files: FileList) => {
    console.log('Files uploaded:', files);
    toast({
      title: 'Files uploaded',
      description: `Processing ${files.length} file(s)...`,
    });
  }, []);

  const handleDataParsed = useCallback((parsedData: any[]) => {
    const newSheets = parsedData.flatMap(fileData => 
      fileData.sheets.map((sheet: any, index: number) => ({
        id: `imported-${Date.now()}-${index}`,
        name: `${fileData.filename}-${sheet.name}`,
        data: sheet.data.map((row: any[]) => 
          row.map((cell: any) => ({ value: cell }))
        ),
      }))
    );
    
    setSheets(prevSheets => [...prevSheets, ...newSheets]);
    
    toast({
      title: 'Data imported successfully',
      description: `Added ${newSheets.length} new sheet(s).`,
    });
  }, []);

  const handleDataOperation = useCallback((operation: string) => {
    console.log('Data operation:', operation);
    toast({
      title: 'AI Operation',
      description: `Executing: ${operation}`,
    });
  }, []);

  const handleSave = () => {
    toast({
      title: 'Spreadsheet saved',
      description: 'Your work has been saved successfully.',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export started',
      description: 'Your spreadsheet is being exported...',
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.xlsx,.xls,.csv,.tsv';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) handleFileUpload(files);
    };
    input.click();
  };

  const handleAddSheet = () => {
    const newSheet: Sheet = {
      id: Date.now().toString(),
      name: `Sheet${sheets.length + 1}`,
      data: Array(50).fill(null).map(() => Array(26).fill({ value: '' })),
    };
    setSheets(prev => [...prev, newSheet]);
    setActiveSheetId(newSheet.id);
    
    toast({
      title: 'New sheet added',
      description: `Created ${newSheet.name}`,
    });
  };

  return (
    <FileUploadProcessor onDataParsed={handleDataParsed}>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <h1 className="text-xl font-semibold text-gray-900">
            AI-Powered Spreadsheet Editor
          </h1>
        </div>

        {/* Toolbar */}
        <SpreadsheetToolbar
          onSave={handleSave}
          onExport={handleExport}
          onImport={handleImport}
          onUndo={() => console.log('Undo')}
          onRedo={() => console.log('Redo')}
          onAddSheet={handleAddSheet}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* AI Sidebar */}
          <AIChatSidebar
            onFileUpload={handleFileUpload}
            onDataOperation={handleDataOperation}
            spreadsheetData={activeSheet?.data || []}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Sheet tabs */}
            <Tabs value={activeSheetId} onValueChange={setActiveSheetId} className="flex-1 flex flex-col">
              <div className="bg-white border-b border-gray-200 px-4">
                <TabsList className="h-10">
                  {sheets.map(sheet => (
                    <TabsTrigger key={sheet.id} value={sheet.id} className="px-4">
                      {sheet.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {sheets.map(sheet => (
                <TabsContent key={sheet.id} value={sheet.id} className="flex-1 m-0 p-4">
                  <SpreadsheetGrid
                    data={sheet.data}
                    onCellChange={handleCellChange}
                    selectedCell={selectedCell}
                    onCellSelect={handleCellSelect}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </FileUploadProcessor>
  );
};

export default SpreadsheetApp;
