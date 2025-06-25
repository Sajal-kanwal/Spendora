"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
                    className,
                    value,
                    indicatorClassName, // ✅ Rename it to match how you're using it
                    ...props
                  }: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string;
}) {
  return (
      <ProgressPrimitive.Root
          data-slot="progress"
          className={cn(
              "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
              className
          )}
          {...props}
      >
        <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
            className={cn(
                "bg-primary h-full w-full flex-1 transition-all",
                indicatorClassName // ✅ Use the right prop name
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
  )
}

export { Progress }
