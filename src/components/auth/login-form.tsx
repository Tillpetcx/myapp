"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/form-fields";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Loader2 } from "lucide-react";

// 登录表单验证模式
const loginFormSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要6个字符"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("邮箱或密码错误");
      } else {
        // 登录成功
        if (onSuccess) onSuccess();
        // 刷新页面以更新 session
        window.location.reload();
      }
    } catch (error) {
      setError("登录过程中发生错误");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 rounded bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <FieldSet>
        <FieldGroup>
          <InputField
            control={form.control}
            name="email"
            label="邮箱"
            type="email"
            placeholder="请输入邮箱"
            required
          />

          <InputField
            control={form.control}
            name="password"
            label="密码"
            type="password"
            placeholder="请输入密码"
            required
          />
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-between">
        {onSwitchToRegister && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            还没有账户？注册
          </Button>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "登录中..." : "登录"}
        </Button>
      </div>
    </form>
  );
}
