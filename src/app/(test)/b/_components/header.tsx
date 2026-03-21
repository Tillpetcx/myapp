"use client";

export default function Header() {
  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="text-xl font-bold">测试页面</div>
          <ul className="flex space-x-6">
            <li>
              <a
                href="/test"
                className="hover:text-slate-300 transition-colors"
              >
                测试首页
              </a>
            </li>
            <li>
              <a href="/a" className="hover:text-slate-300 transition-colors">
                计数器
              </a>
            </li>
            <li>
              <a href="/b" className="hover:text-slate-300 transition-colors">
                数据展示
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
