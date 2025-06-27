
import React, { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ParsedData {
  sheets: {
    name: string;
    data: (string | number)[][];
  }[];
  filename: string;
}

interface FileUploadProcessorProps {
  onDataParsed: (data: ParsedData[]) => void;
  children?: React.ReactNode;
}

export const FileUploadProcessor: React.FC<FileUploadProcessorProps> = ({
  onDataParsed,
  children,
}) => {
  const processFiles = useCallback(async (files: FileList) => {
    const results: ParsedData[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        if (file.name.endsWith('.csv') || file.name.endsWith('.tsv')) {
          const csvData = await processCSV(file);
          results.push(csvData);
        } else if (file.name.match(/\.(xlsx|xls)$/)) {
          const excelData = await processExcel(file);
          results.push(excelData);
        } else {
          toast({
            title: 'Unsupported file type',
            description: `File ${file.name} is not supported. Please use Excel (.xlsx, .xls) or CSV files.`,
            variant: 'destructive',
          });
          continue;
        }
        
        toast({
          title: 'File processed successfully',
          description: `${file.name} has been loaded.`,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: 'Error processing file',
          description: `Failed to process ${file.name}. Please check the file format.`,
          variant: 'destructive',
        });
      }
    }
    
    if (results.length > 0) {
      onDataParsed(results);
    }
  }, [onDataParsed]);

  const processCSV = (file: File): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const delimiter = file.name.endsWith('.tsv') ? '\t' : ',';
          
          const data = lines.map(line => {
            const values = line.split(delimiter).map(value => {
              const trimmed = value.trim().replace(/^"|"$/g, '');
              const num = parseFloat(trimmed);
              return isNaN(num) ? trimmed : num;
            });
            return values;
          });
          
          resolve({
            sheets: [{
              name: 'Sheet1',
              data: data,
            }],
            filename: file.name,
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const processExcel = (file: File): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // For demo purposes, we'll simulate Excel processing
          // In production, you'd use SheetJS or similar library
          const sampleData = [
            ['Name', 'Age', 'City', 'Salary'],
            ['John Doe', 30, 'New York', 50000],
            ['Jane Smith', 25, 'Los Angeles', 60000],
            ['Bob Johnson', 35, 'Chicago', 55000],
            ['Alice Brown', 28, 'Houston', 52000],
          ];
          
          resolve({
            sheets: [{
              name: 'Sheet1',
              data: sampleData,
            }],
            filename: file.name,
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      {children}
    </div>
  );
};

// Hook for file processing
export const useFileProcessor = () => {
  const processFiles = useCallback(async (files: FileList) => {
    // This would be implemented with the FileUploadProcessor logic
    console.log('Processing files:', files);
  }, []);

  return { processFiles };
};
