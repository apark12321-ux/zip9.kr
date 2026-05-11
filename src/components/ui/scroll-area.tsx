import * as React from "react"
import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="scroll-area"
      className={cn("relative overflow-auto", className)}
      {...props}
    >
      <div className="size-full rounded-[inherit] outline-none">
        {children}
      </div>
    </div>
  )
}

function ScrollBar() {
  return null;
}

export { ScrollArea, ScrollBar }
