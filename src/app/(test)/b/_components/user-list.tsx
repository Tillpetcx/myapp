"use client";
import { use } from "react";
import { User } from "../types";

type UserListProps = {
  dataPromise: Promise<User[]>;
};

export default function UserList({ dataPromise }: UserListProps) {
  const data = use(dataPromise);
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">用户列表</h2>
      <ul className="space-y-3">
        {data.map((user) => (
          <li key={user.id} className="p-3 bg-slate-50 rounded">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-slate-500">{user.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
