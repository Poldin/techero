import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

type PostFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
}

export async function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const data = matterResult.data as PostFrontmatter;
    
    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
    };
  });
  
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const data = matterResult.data as PostFrontmatter;
  
  return {
    content: matterResult.content,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
  };
}