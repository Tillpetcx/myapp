"use client";

import { UserList } from "./_components/user-list";
import { UserForm } from "./_components/user-form";

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        TanStack Query + React Hook Form 示例
      </h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          用户列表 (TanStack Query)
        </h2>
        <UserList />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          添加用户 (React Hook Form + Zod)
        </h2>
        <UserForm />
      </section>
    </div>
  );
}
