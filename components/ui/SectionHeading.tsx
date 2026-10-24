import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
}

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  theme = "light",
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "max-w-3xl",
        isCenter && "mx-auto text-center",
        className
      )}
    >
      {kicker && (
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-6 h-px bg-[#BE933C]" />
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-[0.2em]",
              isDark ? "text-[#BE933C]" : "text-[#8C6B1B]"
            )}
          >
            {kicker}
          </span>
          {isCenter && <span className="w-6 h-px bg-[#BE933C]" />}
        </div>
      )}

      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-[1.12]",
          isDark ? "text-white" : "text-[#252A2D]"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg leading-relaxed font-normal",
            isDark ? "text-neutral-300" : "text-[#52525B]"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
