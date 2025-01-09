'use client';

import React from 'react';
import { Copy, ChevronDown, ChevronUp, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

interface ResponseDisplayProps {
  content: string;
  role: 'user' | 'assistant';
  messageId: string;
}

export function ResponseDisplay({ content, role, messageId }: ResponseDisplayProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { toast } = useToast();
  const { deleteMessage } = useStore();
  
  React.useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied to clipboard',
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to copy',
        description: 'Please try again',
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-forge-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn(
      "terminal-bg rounded-lg p-4 my-4",
      "border border-gray-800",
      role === 'assistant' && "bg-opacity-50"
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {role === 'assistant' ? 'Assistant' : 'User'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteMessage(messageId)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-400 hover:text-white"
          >
            <Copy size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-gray-400 hover:text-white"
          >
            <Download size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
        </div>
      </div>
      <div className={cn(
        "transition-all duration-200",
        isCollapsed ? "max-h-0 overflow-hidden" : "max-h-[1000px]"
      )}>
        {role === 'assistant' ? (
          <pre className="overflow-x-auto">
            <code className="language-typescript block max-w-full whitespace-pre-wrap break-words">{content}</code>
          </pre>
        ) : (
          <div className="text-gray-300 whitespace-pre-wrap">{content}</div>
        )}
      </div>
    </div>
  );
}