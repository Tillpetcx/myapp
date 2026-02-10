"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">欢迎来到张舟辰的网站</h1>

        {status === "loading" ? (
          <div className="text-center py-10">
            <div className="text-lg">加载中...</div>
          </div>
        ) : session ? (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              欢迎回来，{session.user.firstName}！
            </h2>
            <p className="mb-4">您已成功登录。您可以使用以下功能：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/users"
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">用户管理</h3>
                <p className="text-sm text-gray-600">查看和管理用户列表</p>
              </Link>
              <Link
                href="/test"
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">测试页面</h3>
                <p className="text-sm text-gray-600">查看会话状态和测试功能</p>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">欢迎使用我们的网站</h2>
            <p className="mb-4">请登录或注册以使用全部功能。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold mb-2">已有账户？</h3>
                <p className="text-sm text-gray-600 mb-4">
                  登录以访问您的个人账户
                </p>
                <p className="text-sm text-blue-600">
                  点击右上角的登录按钮开始
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold mb-2">新用户？</h3>
                <p className="text-sm text-gray-600 mb-4">
                  注册一个新账户以开始使用
                </p>
                <p className="text-sm text-blue-600">
                  点击右上角的注册按钮开始
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
