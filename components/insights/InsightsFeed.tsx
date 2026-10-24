"use client";

import React, { useState } from "react";
import InsightsCategoryFilter from "./InsightsCategoryFilter";
import ArticleGrid from "./ArticleGrid";
import { INSIGHTS_PAGE_DATA } from "@/lib/copy-data";

export default function InsightsFeed() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Filter articles based on active category
  // When 'All', show the non-featured pillar articles so the featured one above isn't duplicated
  const filteredArticles = INSIGHTS_PAGE_DATA.pillarArticles.filter((article) => {
    if (activeCategory === "All") {
      return !article.isFeatured;
    }
    return article.category === activeCategory;
  });

  return (
    <>
      <InsightsCategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <ArticleGrid articles={filteredArticles} />
    </>
  );
}
