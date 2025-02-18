import { getAllPosts } from '@/lib/mdx';
import PostCard from '@/components/blog/PostCard';
import BlogHeader from './blogHeader';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
}

export default async function BlogPage() {
  const posts: Post[] = await getAllPosts();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <BlogHeader />
      
      {/* Aggiunto pt-24 per compensare l'header fixed */}
      <div className="max-w-screen-xl mx-auto px-6 py-20 pt-24">
        <h1 className="text-4xl font-medium">Racconto, ricerca, repeat.</h1>
        <p className="text-base font-medium mb-12 text-gray-400">
          il nostro blog per condividere chi siamo e dove vogliamo arrivare
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}