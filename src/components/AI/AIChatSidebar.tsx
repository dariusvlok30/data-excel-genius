
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Upload, FileSpreadsheet, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatSidebarProps {
  onFileUpload: (files: FileList) => void;
  onDataOperation: (operation: string) => void;
  spreadsheetData: any[][];
}

export const AIChatSidebar: React.FC<AIChatSidebarProps> = ({
  onFileUpload,
  onDataOperation,
  spreadsheetData,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI spreadsheet assistant. I can help you analyze data, create formulas, join tables, and much more. Upload a file or ask me anything!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call Ollama API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue, spreadsheetData),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (input: string, data: any[][]): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('analyze') || lowercaseInput.includes('summary')) {
      const rowCount = data.length;
      const colCount = data[0]?.length || 0;
      return `I can see you have ${rowCount} rows and ${colCount} columns of data. The dataset appears to contain ${colCount > 0 ? 'structured information' : 'no data yet'}. Would you like me to perform statistical analysis or identify patterns?`;
    }
    
    if (lowercaseInput.includes('formula') || lowercaseInput.includes('calculate')) {
      return `I can help you create formulas! Common ones include:\n• SUM(A1:A10) - Add up values\n• AVERAGE(B1:B10) - Calculate average\n• IF(C1>100,"High","Low") - Conditional logic\n• VLOOKUP(D1,A:B,2,FALSE) - Lookup values\n\nWhat calculation do you need?`;
    }
    
    if (lowercaseInput.includes('join') || lowercaseInput.includes('merge')) {
      return `I can help you join datasets! To merge tables, I'll need:\n• The key columns to match on\n• Which type of join (inner, left, right, full)\n• How to handle conflicts\n\nUpload your files and tell me which columns to match!`;
    }
    
    if (lowercaseInput.includes('chart') || lowercaseInput.includes('graph')) {
      return `Great! I can suggest the best chart type based on your data:\n• Line charts for trends over time\n• Bar charts for comparisons\n• Pie charts for parts of a whole\n• Scatter plots for correlations\n\nWhat aspect of your data would you like to visualize?`;
    }
    
    return `I understand you want help with: "${input}". I can assist with data analysis, formula creation, table joins, visualizations, and much more. Could you provide more details about what you'd like to accomplish?`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFileUpload(files);
      const message: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `Uploaded ${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, message]);
    }
  };

  const quickActions = [
    { label: 'Analyze Data', action: 'analyze this dataset' },
    { label: 'Create Formula', action: 'help me create a formula' },
    { label: 'Join Tables', action: 'help me join two tables' },
    { label: 'Make Chart', action: 'suggest a chart for this data' },
  ];

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => setInputValue(action.action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              
              <div
                className={`max-w-[240px] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <Badge variant="secondary" className="text-xs">
            <FileSpreadsheet className="h-3 w-3 mr-1" />
            Excel, CSV
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your data..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".xlsx,.xls,.csv,.tsv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
