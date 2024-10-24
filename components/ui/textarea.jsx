import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-md bg-transparent text-base shadow-sm placeholder:text-neutral-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
