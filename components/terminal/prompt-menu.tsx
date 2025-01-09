'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PromptCategory {
  title: string;
  prompts: string[];
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    title: "Administrative Tasks",
    prompts: [
      "Generate a Python script using Google Calendar API to schedule meetings based on participant availability.",
      "Create a script in Node.js to automatically filter, label, and archive emails in Gmail based on keywords in the subject or body.",
      "Write a Python script to compare flight prices from multiple travel websites and book the cheapest option.",
      "Provide a script that organizes files in a directory by type and date, moving them into corresponding subfolders."
    ]
  },
  {
    title: "Data Entry and Management",
    prompts: [
      "Create a VBA macro for Excel that imports data from a CSV file, validates it, and formats it into a report-ready format.",
      "Generate a Python script to check for duplicate or incomplete entries in a database and flag them for review.",
      "Write a script in Python to generate weekly sales reports from a MySQL database and email them as PDFs."
    ]
  },
  {
    title: "Finance and Accounting",
    prompts: [
      "Provide a Python script that extracts invoice data from PDFs using PyPDF2 and stores it in an Excel sheet.",
      "Generate a script to monitor company credit card transactions from bank statements and categorize them into expense types.",
      "Create a script to calculate employee salaries, deductions, and taxes, and generate individual payslips."
    ]
  },
  {
    title: "Human Resources",
    prompts: [
      "Write a Python script to parse resumes from a folder and filter candidates based on specific keywords and skills.",
      "Generate a Node.js script to send onboarding emails with attached forms and automatically update a Google Sheet with responses.",
      "Provide a script that integrates with Slack to allow employees to request leave and updates an Airtable with their leave status."
    ]
  },
  // Add more categories as needed
];

export function PromptMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelectPrompt = (prompt: string) => {
    const event = new CustomEvent('selectPrompt', { detail: prompt });
    window.dispatchEvent(event);
    setIsOpen(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "fixed bottom-4 right-4 z-50",
                "w-12 h-12 rounded-full",
                "terminal-bg flex items-center justify-center",
                "hover:shadow-[0_0_15px_rgba(255,6,10,0.3)]",
                "transition-all duration-200"
              )}
            >
              {isOpen ? (
                <X size={24} className="text-[#FF060A]" />
              ) : (
                <Menu size={24} className="text-[#FF060A]" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Examples</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <div className={cn(
          "fixed bottom-20 right-4 z-50",
          "w-96 max-h-[80vh] overflow-y-auto",
          "terminal-bg rounded-lg p-4",
          "animate-in slide-in-from-bottom-5"
        )}>
          {PROMPT_CATEGORIES.map((category, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h3 className="text-[#FF060A] font-bold mb-2">{category.title}</h3>
              <div className="space-y-2">
                {category.prompts.map((prompt, promptIndex) => (
                  <button
                    key={promptIndex}
                    onClick={() => {
                      handleSelectPrompt(prompt);
                    }}
                    className={cn(
                      "w-full text-left p-2 rounded",
                      "text-sm text-gray-300",
                      "hover:bg-[#FF060A]/10",
                      "transition-colors duration-200"
                    )}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}