import React from "react";
import Image from "next/image";
import { Camera, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetPlaceholderProps {
  assetId: string;
  requirement: string;
  specs: string;
  fallbackImage?: string;
  altText: string;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide";
  priority?: boolean;
}

export default function AssetPlaceholder({
  assetId,
  requirement,
  specs,
  fallbackImage,
  altText,
  className,
  aspectRatio = "wide",
  priority = false,
}: AssetPlaceholderProps) {
  const aspectStyles = {
    video: "aspect-[16/9]",
    wide: "aspect-[16/10]",
    square: "aspect-square",
    portrait: "aspect-[4/5]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#121417] border border-[#2E2E2E] group rounded-md",
        aspectStyles[aspectRatio],
        className
      )}
    >
      {fallbackImage ? (
        <>
          <Image
            src={fallbackImage}
            alt={altText}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {/* Subtle architectural gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#252A2D]/90 via-[#252A2D]/20 to-transparent" />
        </>
      ) : (
        /* Architectural technical grid placeholder when no photo provided */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#15181D]">
          <div className="w-12 h-12 rounded-full bg-[#BE933C]/10 border border-[#BE933C]/30 flex items-center justify-center text-[#BE933C] mb-3">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#BE933C]">
            {assetId}
          </span>
          <p className="text-sm font-medium text-white max-w-sm mt-1 mb-2">
            {requirement}
          </p>
          <span className="text-[11px] font-mono text-neutral-400 bg-black/40 px-2.5 py-1 rounded border border-white/10">
            {specs}
          </span>
        </div>
      )}

      {/* Asset Notice Label in corner (Clean, architectural badge) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-neutral-300 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded border border-white/10 opacity-90 transition-opacity group-hover:opacity-100">
        <span className="flex items-center gap-1.5 truncate">
          <FileText className="w-3 h-3 text-[#BE933C] shrink-0" />
          <span className="truncate">{requirement}</span>
        </span>
        <span className="text-[#BE933C] shrink-0 ml-2 font-semibold">[{assetId}]</span>
      </div>
    </div>
  );
}
