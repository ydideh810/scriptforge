'use client';

import React, { useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { Terminal as TerminalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateResponse } from '@/lib/api';
import { ResponseDisplay } from './response-display';
import { ConversationStarters } from './conversation-starters';

export function Terminal() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = React.useState('');
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const { toast } = useToast();
  const { addMessage, setIsGenerating, setError, currentConversation } = useStore();

  const handlePromptSelect = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    setInput(customEvent.detail);
  }, []);

  useEffect(() => {
    window.addEventListener('selectPrompt', handlePromptSelect);
    return () => window.removeEventListener('selectPrompt', handlePromptSelect);
  }, [handlePromptSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      setIsGenerating(true);
      addMessage({ role: 'user', content: input });
      setHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      setInput('');

      const response = await generateResponse(input);
      addMessage({ role: 'assistant', content: response });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp' && !input) {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown' && historyIndex >= 0) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="terminal-bg rounded-lg p-4 relative">
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <TerminalIcon size={16} />
          <span className="text-sm">Script_Forge Terminal</span>
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ paddingRight: '5.5rem' }}
            className={cn(
              "w-full bg-transparent text-gray-100 resize-none",
              "focus:outline-none focus:ring-1 focus:ring-gray-500",
              "placeholder:text-red-300/50",
              "scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent",
              !input && "blinking-cursor"
            )}
            placeholder="Enter your prompt..."
          />
          <Button
            onClick={handleSubmit}
            style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
            className={cn(
              "bg-black hover:bg-black/80",
              "text-white retro-glow",
              "transition-all duration-200"
            )}
            size="sm"
          >
            Generate
          </Button>
        </div>
      </div>
      {!currentConversation?.messages.length && (
        <ConversationStarters onSelect={(prompt) => {
          setInput(prompt);
          handleSubmit();
        }} />
      )}
      {currentConversation?.messages.map((message) => (
        <ResponseDisplay
          key={message.id}
          content={message.content}
          role={message.role}
          messageId={message.id}
        />
      ))}
    </div>
  );
}