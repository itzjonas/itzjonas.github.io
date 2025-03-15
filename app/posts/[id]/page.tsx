import { getAllPostIds, getPostData } from '@/lib/posts';
import { serialize } from 'next-mdx-remote/serialize';
import MDXContent from './MDXContent';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({ params: path.params }));
}

export async function generateMetadata({ params }) {
  const postData = await getPostData(params.id);

  return {
    title: postData.title,
    description: postData.title,
  };
}

export default async function Page({ params }) {
  const postData = await getPostData(params.id);
  const mdxSource = await serialize(postData.content);

  return (
    <div>
      <h1>{postData.title}</h1>
      <p>{postData.date}</p>
      <MDXContent source={mdxSource} />
    </div>
  );
}
