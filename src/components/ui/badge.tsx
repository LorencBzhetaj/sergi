import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-black text-white",
        secondary: "border-transparent bg-neutral-100 text-black",
        destructive: "border-transparent bg-red-600 text-white",
        outline: "border-black text-black",
        gold: "border-transparent bg-[#C9A84C] text-white",
        sale: "border-transparent bg-red-600 text-white",
        new: "border-transparent bg-black text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
