"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = TooltipPrimitive.Root;

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md " +
      "animate-in fade-in-0 zoom-in-95 " +
      (className ?? "")
    }
    {...props}
  />
));
TooltipContent.displayName = "TooltipContent";
