
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FileDown,
  FileUp,
  Save,
  Undo,
  Redo,
  Plus,
  Settings,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SpreadsheetToolbarProps {
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddSheet: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const SpreadsheetToolbar: React.FC<SpreadsheetToolbarProps> = ({
  onSave,
  onExport,
  onImport,
  onUndo,
  onRedo,
  onAddSheet,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="h-14 border-b border-gray-200 bg-white px-4 flex items-center gap-2">
      {/* File operations */}
      <Button variant="outline" size="sm" onClick={onImport}>
        <FileUp className="h-4 w-4 mr-2" />
        Import
      </Button>
      <Button variant="outline" size="sm" onClick={onSave}>
        <Save className="h-4 w-4 mr-2" />
        Save
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        <FileDown className="h-4 w-4 mr-2" />
        Export
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* History */}
      <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo}>
        <Redo className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Formatting */}
      <Select defaultValue="arial">
        <SelectTrigger className="w-32 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="arial">Arial</SelectItem>
          <SelectItem value="helvetica">Helvetica</SelectItem>
          <SelectItem value="times">Times New Roman</SelectItem>
          <SelectItem value="courier">Courier New</SelectItem>
        </SelectContent>
      </Select>
      
      <Select defaultValue="12">
        <SelectTrigger className="w-16 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="14">14</SelectItem>
          <SelectItem value="16">16</SelectItem>
          <SelectItem value="18">18</SelectItem>
        </SelectContent>
      </Select>
      
      <Button variant="outline" size="sm">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <Underline className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Alignment */}
      <Button variant="outline" size="sm">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Sheet operations */}
      <Button variant="outline" size="sm" onClick={onAddSheet}>
        <Plus className="h-4 w-4 mr-2" />
        Add Sheet
      </Button>
      
      <div className="ml-auto">
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
