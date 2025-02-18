import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug } from '@/lib/mdx';



type Post = {
  params: Promise <
  {slug: string;
  title: string;
  excerpt: string;}>
}

export default async function BlogPage({params}:Post) {
    const {slug} = await params
  const post = await getPostBySlug(slug);
  
  return (
    <article className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>
  );
}