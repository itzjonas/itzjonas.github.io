import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

export function getAllPostIds(): Array<{ params: { id: string } }> {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.mdx$/, ''),
      },
    };
  });
}

export async function getPostData(id: string): Promise<{
  content: string;
  date: string;
  description: string;
  id: string;
  title: string;
}> {
  const fullPath = path.join(postsDirectory, `${id}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  return {
    content: matterResult.content,
    date: matterResult.data.date,
    description: matterResult.data.description || 'No description provided.',
    id,
    title: matterResult.data.title,
  };
}
