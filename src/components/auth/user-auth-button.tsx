"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { User, LogOut, UserPlus, Settings } from "lucide-react";

export function UserAuthButton() {
  const { data: session, status } = useSession();
  const [currentDialog, setCurrentDialog] = useState<
    "login" | "register" | null
  >(null);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.reload();
  };

  const openLoginDialog = () => {
    setCurrentDialog("login");
  };

  const openRegisterDialog = () => {
    setCurrentDialog("register");
  };

  const closeDialog = () => {
    setCurrentDialog(null);
  };

  const switchToRegister = () => {
    setCurrentDialog("register");
  };

  const switchToLogin = () => {
    setCurrentDialog("login");
  };

  if (status === "loading") {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (session) {
    // 已登录状态
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session.user.avatar || ""}
                alt={session.user.firstName || "用户"}
              />
              <AvatarFallback>
                {session.user.firstName?.charAt(0) ||
                  session.user.email?.charAt(0) ||
                  "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="center" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">
                {session.user.firstName} {session.user.lastName}
              </p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>个人资料</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>设置</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 未登录状态
  return (
    <div className="flex items-center space-x-2">
      <Dialog
        open={currentDialog !== null}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative">
              <User className="mr-2 h-4 w-4" />
              <span>登录</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem onClick={openLoginDialog}>
              <User className="mr-2 h-4 w-4" />
              <span>登录</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openRegisterDialog}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>注册</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-[425px]">
          {currentDialog === "login" && (
            <>
              <DialogHeader>
                <DialogTitle>用户登录</DialogTitle>
                <DialogDescription>
                  输入您的邮箱和密码以登录账户
                </DialogDescription>
              </DialogHeader>
              <LoginForm
                onSuccess={closeDialog}
                onSwitchToRegister={switchToRegister}
              />
            </>
          )}

          {currentDialog === "register" && (
            <>
              <DialogHeader>
                <DialogTitle>用户注册</DialogTitle>
                <DialogDescription>创建一个新账户以开始使用</DialogDescription>
              </DialogHeader>
              <RegisterForm
                onSuccess={closeDialog}
                onSwitchToLogin={switchToLogin}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
