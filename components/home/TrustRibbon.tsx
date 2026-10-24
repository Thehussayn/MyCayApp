import React from "react";
import { Award, FileCheck2, TrendingUp, Percent, ShieldCheck } from "lucide-react";

const STRIP_STATS = [
  {
    value: "18+",
    label: "Years of Trusted Experience",
    icon: <Award className="w-4 h-4 text-[#BE933C]" />,
  },
  {
    value: "900+",
    label: "Properties Delivered",
    icon: <FileCheck2 className="w-4 h-4 text-[#BE933C]" />,
  },
  {
    value: "70/30",
    label: "Profit-Share Model",
    icon: <TrendingUp className="w-4 h-4 text-[#BE933C]" />,
  },
  {
    value: "20–24%",
    label: "Fixed Annual ROI",
    icon: <Percent className="w-4 h-4 text-[#BE933C]" />,
  },
  {
    value: "RC.1317171",
    label: "Registered & Compliant",
    icon: <ShieldCheck className="w-4 h-4 text-[#BE933C]" />,
  },
];

export default function TrustRibbon() {
  return (
    <section className="bg-[#111317] text-white border-y border-white/10 py-5 sm:py-6 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal scroll container on mobile, flex/grid on desktop with NO dividers */}
        <div className="flex items-center gap-8 sm:gap-10 lg:gap-12 overflow-x-auto no-scrollbar py-1 scroll-smooth md:justify-between">
          {STRIP_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 shrink-0 py-1"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {stat.icon}
              </div>

              <div>
                <div className="text-lg sm:text-xl lg:text-2xl font-heading font-black text-white tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-xs text-neutral-300 font-medium whitespace-nowrap mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
