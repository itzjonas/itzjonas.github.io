import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// TYPES
import { PostData } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'posts');

// Get all post data (sorted by date)
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const postData: PostData = {
      content: matterResult.content,
      date: matterResult.data.date as string,
      description: matterResult.data.description as string,
      id,
      title: matterResult.data.title as string,
    };

    return postData;
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Get all post ids for dynamic routes
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.mdx$/, ''),
      },
    };
  });
}

// Get data for a specific post by ID
export async function getPostData(id: string): Promise<PostData> {
  const filePath = path.join(postsDirectory, `${id}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const { data, content } = matter(fileContent);

  const postData: PostData = {
    content,
    date: data.date as string,
    description: data.description as string,
    id,
    title: data.title as string,
  };

  return postData;
}
