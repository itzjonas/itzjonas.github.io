import { getPostData, getAllPostIds } from '@/lib/posts';
import { serialize } from 'next-mdx-remote/serialize';
import MDXContent from './MDXContent';

// TYPES
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { Metadata } from 'next';
import type { PostData } from '@/types/post';

interface Params {
  id: string;
}

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => path.params);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const postData: PostData = await getPostData(params.id);

  return {
    description: postData.description,
    title: postData.title,
  };
}

export default async function Page({ params }: { params: Params }) {
  const postData: PostData = await getPostData(params.id);
  const mdxSource: MDXRemoteSerializeResult = await serialize(postData.content);

  return (
    <div>
      <h1>{postData.title}</h1>
      <p>{postData.date}</p>
      <MDXContent source={mdxSource} />
    </div>
  );
}
