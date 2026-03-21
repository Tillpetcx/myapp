"use client";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTabs } from "./tabs-context";
import UserList from "./user-list";
import PostList from "./post-list";
import { User, Post } from "../types";

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

export default function TabsArea({
  usersPromise,
  postsPromise,
}: {
  usersPromise: Promise<User[]>;
  postsPromise: Promise<Post[]>;
}) {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <Tabs
      defaultValue="users"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex flex-col h-full"
    >
      <TabsList className="flex flex-none">
        <TabsTrigger value="users" className="flex-1">
          用户列表
        </TabsTrigger>
        <TabsTrigger value="posts" className="flex-1">
          文章列表
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-y-auto w-full">
        <TabsContent value="users">
          <Suspense fallback={<UserListSkeleton />}>
            <UserList dataPromise={usersPromise} />
          </Suspense>
        </TabsContent>
        <TabsContent value="posts">
          <Suspense fallback={<PostListSkeleton />}>
            <PostList dataPromise={postsPromise} />
          </Suspense>
        </TabsContent>
      </div>
    </Tabs>
  );
}
