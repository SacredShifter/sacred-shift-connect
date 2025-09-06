import React, { ReactNode, forwardRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  children: ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  disabled?: boolean;
}

export const TooltipWrapper = forwardRef<HTMLDivElement, TooltipWrapperProps>(({ 
  children, 
  content, 
  side = "top", 
  delayDuration = 300,
  disabled = false 
}, ref) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={ref}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

TooltipWrapper.displayName = "TooltipWrapper";