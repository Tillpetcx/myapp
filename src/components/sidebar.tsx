"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Home, Users, MessageSquare, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isOpen = true, onClose, ...props }, ref) => {
    const pathname = usePathname();

    const navItems = [
      {
        title: "首页",
        href: "/",
        icon: Home,
      },
      {
        title: "用户管理",
        href: "/users",
        icon: Users,
      },
      {
        title: "AI聊天",
        href: "/aichat",
        icon: MessageSquare,
      },
    ];

    return (
      <>
        {/* Mobile backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/80 md:hidden"
            onClick={onClose}
          />
        )}

        {/* Sidebar */}
        <div
          ref={ref}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-200 ease-in-out md:static md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className,
          )}
          {...props}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <h2 className="text-lg font-semibold">应用导航</h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">关闭侧边栏</span>
            </Button>
          </div>
          <Separator />
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                    )}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </div>
      </>
    );
  },
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
