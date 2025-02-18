import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Post {
  title: string;
  excerpt: string;
  slug: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="border border-white/[.1] p-6 hover:border-white/20 transition-colors rounded">
      <h2 className="text-xl font-medium mb-3">{post.title}</h2>
      <p className="text-white/60 mb-4">{post.excerpt}</p>
      <Link 
        href={`/blog/${post.slug}`}
        className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
      >
        inizia <ArrowRight size={18} />
      </Link>
    </div>
  );
}