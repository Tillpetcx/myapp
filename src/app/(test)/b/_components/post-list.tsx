"use client";
import { use } from "react";
import { Post } from "../types";

interface PostListProps {
  dataPromise: Promise<Post[]>;
}

export default function PostList({ dataPromise }: PostListProps) {
  const data = use(dataPromise);
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">文章列表</h2>
      <ul className="space-y-3">
        {data.map((post) => (
          <li key={post.id} className="p-3 bg-blue-50 rounded">
            <div className="font-medium">{post.title}</div>
            <div className="text-sm text-slate-500 mt-1">{post.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
