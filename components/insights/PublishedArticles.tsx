import Link from "next/link";
import { publishedArticles } from "@/lib/platform/content";
export default function PublishedArticles() {
  const articles = publishedArticles();
  if (!articles.length) return null;
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-7">Latest updates</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/insights/${a.slug}`}
            className="p-6 border rounded-xl hover:border-brand-gold"
          >
            <p className="text-xs text-neutral-500 mb-4">
              {a.updatedAt.slice(0, 10)}
            </p>
            <h3 className="font-semibold text-xl">{a.title}</h3>
            <p className="text-sm text-neutral-500 mt-3">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
