import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "dark" | "neutral" | "outline";
  className?: string;
  icon?: React.ReactNode;
}

export default function Badge({
  children,
  variant = "gold",
  className,
  icon,
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold tracking-wider uppercase rounded-sm";

  const variantStyles = {
    gold: "bg-[#FBF7EE] text-[#8C6B1B] border border-[#BE933C]/25",
    dark: "bg-[#181B20] text-[#E5E7EB] border border-[#2E2E2E]",
    neutral: "bg-neutral-100 text-neutral-800 border border-neutral-200",
    outline: "bg-transparent text-[#BE933C] border border-[#BE933C]/40",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
