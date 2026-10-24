"use client";
import { useState } from "react";

import { label } from "@/components/portal/Investments";

import type { ActionProps } from "./types";

export default function Content({
  data,
  busy,
  act,
}: { data: any } & ActionProps) {
  const blank = {
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    status: "DRAFT",
  };
  const [article, setArticle] = useState(blank);
  return (
    <div className="grid xl:grid-cols-[1fr_2fr] gap-5">
      <div className="panel space-y-3">
        <button className="action w-full" onClick={() => setArticle(blank)}>
          New article
        </button>
        {data.articles.map((a: any) => (
          <button
            className="block w-full text-left border-b py-4"
            key={a.id}
            onClick={() => setArticle(a)}
          >
            <p className="font-semibold">{a.title}</p>
            <p className="text-xs text-neutral-500 mt-1">{label(a.status)}</p>
          </button>
        ))}
      </div>
      <form
        className="panel space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          act({ action: "ARTICLE", article });
        }}
      >
        <h2 className="font-semibold">
          {article.id ? "Edit article" : "New article"}
        </h2>
        {["title", "slug", "excerpt"].map((k) => (
          <label key={k} className="field capitalize">
            {k}
            <input
              required={k !== "excerpt"}
              value={(article as any)[k]}
              onChange={(e) => setArticle({ ...article, [k]: e.target.value })}
            />
          </label>
        ))}
        <label className="field">
          Article text
          <textarea
            required
            rows={12}
            value={article.body}
            onChange={(e) => setArticle({ ...article, body: e.target.value })}
          />
        </label>
        <label className="field">
          Status
          <select
            value={article.status}
            onChange={(e) => setArticle({ ...article, status: e.target.value })}
          >
            {["DRAFT", "PUBLISHED", "ARCHIVED"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button disabled={busy} className="action">
          Save article
        </button>
      </form>
    </div>
  );
}
