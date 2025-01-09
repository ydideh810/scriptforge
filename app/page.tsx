import { Terminal } from '@/components/terminal/terminal';
import { PromptMenu } from '@/components/terminal/prompt-menu';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen cyber-bg retro-scanlines">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://payhip.com/nidamos"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "fixed bottom-4 left-4 z-50",
                "w-12 h-12 rounded-full",
                "terminal-bg flex items-center justify-center",
                "hover:shadow-[0_0_15px_rgba(255,6,10,0.3)]",
                "transition-all duration-200"
              )}
            >
              <Plus size={24} className="text-[#FF060A]" />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>More Prompts</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="font-orbitron text-4xl md:text-6xl mb-8 text-center retro-glow">
          LABOR_TRON
        </h1>
        <Terminal />
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-center z-50">
        <p className="font-orbitron text-sm text-red-500">© N.I.D.A.M All rights reserved (2025)</p>
      </div>
      <PromptMenu />
    </div>
  );
}
