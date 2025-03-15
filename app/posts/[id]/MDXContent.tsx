'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

// TYPES
interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

const MDXContent: React.FC<MDXContentProps> = ({ source }) => {
  return <MDXRemote {...source} />;
};

export default MDXContent;
