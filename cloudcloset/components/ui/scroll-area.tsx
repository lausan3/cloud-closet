"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

// Main ScrollArea wrapper
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {/* Custom ScrollBar component */}
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

// Custom ScrollBar
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      // forceMount = true → keeps scrollbar always visible
      forceMount
      className={cn(
        // Added bg-[#212121] → dark background track
        // Added mr-[1vw] → margin on the right
        "flex touch-none p-px transition-colors select-none bg-[#212121] mr-[1vw]",
        orientation === "vertical" &&
          // Made width thicker (w-3.5 instead of w-2.5)
          "h-full w-3.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          // Made height thicker (h-3.5 instead of h-2.5)
          "h-3.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        //  Thumb color set to #A9A9A9
        className="relative flex-1 rounded-full bg-[#A9A9A9]"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
