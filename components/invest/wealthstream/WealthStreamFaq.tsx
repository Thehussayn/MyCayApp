"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { WEALTHSTREAM_PAGE_DATA } from "@/lib/copy-data";

export default function WealthStreamFaq() {
  const { faqs } = WEALTHSTREAM_PAGE_DATA;
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="bg-[#F8F8F6] text-[#252A2D] py-28 sm:py-36 lg:py-44 border-b border-[#E7E7E2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 sm:mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
            Investor Clarifications
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            Direct operational and financial clarity regarding WealthStream distributions and capital custody.
          </p>
        </div>

        {/* Accessible Accordion Stack */}
        <div className="divide-y divide-[#E7E7E2] border-y border-[#E7E7E2]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className="py-6 sm:py-8">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-6 text-left group focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-ws-${idx}`}
                  id={`faq-question-ws-${idx}`}
                >
                  <span className="text-lg sm:text-xl font-heading font-bold text-[#252A2D] group-hover:text-[#BE933C] transition-colors leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#252A2D] text-white border-[#252A2D]" : "text-neutral-500 group-hover:border-neutral-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <div
                  id={`faq-answer-ws-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-ws-${idx}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal pr-6 sm:pr-12">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
