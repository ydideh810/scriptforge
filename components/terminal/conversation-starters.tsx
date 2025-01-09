'use client';

import React from 'react';
import { Terminal, FileCode, Shield, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarterProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const Starter = ({ icon, title, onClick }: StarterProps) => (
  <button
    onClick={onClick}
    className={cn(
      "terminal-bg w-full p-4 rounded-lg",
      "border border-gray-800 hover:border-[#FF060A]/50",
      "transition-all duration-200",
      "flex items-center gap-3",
      "group relative overflow-hidden",
      "hover:shadow-[0_0_15px_rgba(255,6,10,0.3)]"
    )}
  >
    <div className="text-[#FF060A]">{icon}</div>
    <span className="text-sm text-gray-300 text-left">{title}</span>
  </button>
);

interface ConversationStartersProps {
  onSelect: (prompt: string) => void;
}

export function ConversationStarters({ onSelect }: ConversationStartersProps) {
  const starters = [
    {
      icon: <FileCode size={20} />,
      title: "Generate a Python automation script for file organization",
      prompt: "Generate a Python automation script for file organization"
    },
    {
      icon: <Terminal size={20} />,
      title: "Create a bash script for system maintenance",
      prompt: "Create a bash script for system maintenance"
    },
    {
      icon: <Shield size={20} />,
      title: "Build a PowerShell script for backup automation",
      prompt: "Build a PowerShell script for backup automation"
    },
    {
      icon: <Workflow size={20} />,
      title: "Design a JavaScript task automation workflow",
      prompt: "Design a JavaScript task automation workflow"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {starters.map((starter, index) => (
        <Starter
          key={index}
          icon={starter.icon}
          title={starter.title}
          onClick={() => onSelect(starter.prompt)}
        />
      ))}
    </div>
  );
}