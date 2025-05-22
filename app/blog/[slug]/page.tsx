import { format } from 'date-fns';
import { getAllPostSlugs, getPostData } from '@/lib/posts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => ({
    slug: path.slug,
  }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  try {
    const postData = await getPostData(params.slug);
    return {
      title: postData.title,
      description: postData.excerpt || '',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post Not Found',
    };
  }
}

export default async function BlogPost({ params }) {
  try {
    const postData = await getPostData(params.slug);
    
    return (
      <article className="max-w-3xl mx-auto py-12 px-4 bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-2 text-heading drop-shadow-[0_0_8px_hsl(var(--80s-cyan))]">{postData.title}</h1>
        <time className="text-80s-yellow">
          {format(new Date(postData.date), 'MMMM d, yyyy')}
        </time>
        
        <div 
          className="prose prose-synthwave prose-lg mt-8"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
        />
      </article>
    );
  } catch (error) {
    console.error('Error loading post:', error);
    return notFound();
  }
}
