import { Suspense } from "react";
import Header from "./_components/header";
import UserList from "./_components/user-list";
import PostList from "./_components/post-list";
import { fetchData } from "./fetch";

function UserListSkeleton() {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">用户列表 (骨架屏)</h2>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4">
            <div className="rounded-full bg-slate-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostListSkeleton() {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">文章列表 (旋转加载)</h2>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-slate-500">加载中...</p>
      </div>
    </div>
  );
}

export default async function BPage() {
  const dataPromise = fetchData();
  const usersPromise = dataPromise.then((data) => data.users);
  const postsPromise = dataPromise.then((data) => data.posts);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">数据展示页面</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Suspense fallback={<UserListSkeleton />}>
            <UserList dataPromise={usersPromise} />
          </Suspense>
          <Suspense fallback={<PostListSkeleton />}>
            <PostList dataPromise={postsPromise} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
