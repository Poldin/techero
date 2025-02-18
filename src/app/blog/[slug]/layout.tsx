import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/mdx';
import BlogHeader from '../blogHeader';

//type SearchParams = { [key: string]: string | string[] | undefined }
type Params=Promise<{slug:string}>

export async function generateMetadata({
  params,
}: {
  params: Params;
  //searchParams: SearchParams;
}): Promise<Metadata> {
  const {slug} = await params
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
  };
}

export default async function PostPage({
  
  children,
}: Readonly<{
  
  children:React.ReactNode;
  //searchParams: SearchParams;
}>) {
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <BlogHeader />
      {children}
      {/* <article className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article> */}
    </div>
  );
}