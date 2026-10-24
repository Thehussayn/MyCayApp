import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "outline-gold"
    | "ghost"
    | "gold-ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  target,
  icon,
  iconPosition = "right",
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 tracking-wide rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE933C]/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#BE933C] text-[#252A2D] font-semibold hover:bg-[#A9822D] shadow-gold-subtle border border-[#BE933C]",
    secondary:
      "bg-[#252A2D] text-white hover:bg-[#1A1D20] border border-[#2E2E2E]",
    outline:
      "bg-transparent text-[#252A2D] border border-neutral-300 hover:border-[#252A2D] hover:bg-neutral-50",
    "outline-gold":
      "bg-transparent text-[#BE933C] border border-[#BE933C]/40 hover:border-[#BE933C] hover:bg-[#BE933C]/5",
    ghost: "bg-transparent text-[#252A2D] hover:bg-neutral-100/60",
    "gold-ghost": "bg-transparent text-[#BE933C] hover:bg-[#BE933C]/10",
  };

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        onClick={
          props.onClick as
            React.MouseEventHandler<HTMLAnchorElement> | undefined
        }
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          "group",
          className,
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        "group",
        className,
      )}
      {...props}
    >
      {content}
    </button>
  );
}
