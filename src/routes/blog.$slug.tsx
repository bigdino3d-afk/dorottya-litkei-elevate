import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  body: string;
  published_at: string | null;
};

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Journal` },
      { property: "og:url", content: `/blog/${params.slug}` },
    ],
  }),
  component: PostPage,
  errorComponent: PostError,
  notFoundComponent: PostMissing,
});

function PostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, slug, title, excerpt, cover_image_url, category, body, published_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setPost((data as Post | null) ?? null);
    })();
  }, [slug]);

  if (post === undefined) {
    return <div className="pt-40 pb-24 container-luxe text-center text-muted-foreground">Loading…</div>;
  }
  if (post === null) return <PostMissing />;

  return (
    <article className="pt-32 md:pt-40 pb-24">
      <div className="container-luxe max-w-3xl">
        <Reveal>
          <Link to="/blog" className="inline-flex items-center gap-2 eyebrow text-muted-foreground hover:text-gold transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Journal
          </Link>
          <div className="mt-8 flex items-center gap-4 eyebrow text-muted-foreground">
            {post.category && <span className="text-gold">{post.category}</span>}
            {post.category && post.published_at && <span className="h-1 w-1 rounded-full bg-border" />}
            {post.published_at && (
              <time>{new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
            )}
          </div>
          <h1 className="mt-6 font-serif text-4xl md:text-6xl leading-[1.05]">{post.title}</h1>
          {post.excerpt && <p className="mt-8 text-xl text-muted-foreground leading-relaxed font-serif italic">{post.excerpt}</p>}
        </Reveal>

        {post.cover_image_url && (
          <Reveal delay={80}>
            <div className="mt-12 aspect-[16/10] overflow-hidden bg-cream">
              <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </Reveal>
        )}

        <Reveal delay={120}>
          <div className="mt-12 font-serif text-lg leading-[1.85] text-charcoal whitespace-pre-wrap">
            {post.body}
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function PostMissing() {
  return (
    <div className="pt-40 pb-24 container-luxe text-center">
      <p className="eyebrow text-muted-foreground">404</p>
      <h1 className="mt-4 font-serif text-4xl">Article not found</h1>
      <Link to="/blog" className="mt-8 inline-block eyebrow text-gold hover:underline">← Back to Journal</Link>
    </div>
  );
}

function PostError({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <div className="pt-40 pb-24 container-luxe text-center">
      <h1 className="font-serif text-3xl">Something went wrong</h1>
      <button
        onClick={() => { router.invalidate(); reset(); }}
        className="mt-6 eyebrow text-gold hover:underline"
      >
        Try again
      </button>
    </div>
  );
}
