"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldSet,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "./_fetch/login";

const loginSchema = z.object({
  email: z.string().min(1, "请输入邮箱").email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success("登录成功");
      // router.push(callbackUrl);
      router.refresh();
    } catch (error: unknown) {
      let errorMessage = "登录失败，请检查邮箱和密码";
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes("邮箱")) {
          setError("email", { message: error.message });
          return;
        } else if (error.message.includes("密码")) {
          setError("password", { message: error.message });
          return;
        } else if (
          error.message.includes("禁用") ||
          error.message.includes("封禁")
        ) {
          setError("email", { message: error.message });
          return;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">登录</CardTitle>
          <CardDescription>输入您的邮箱和密码来登录账户</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet className="w-full">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">邮箱</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <FieldDescription className="text-destructive">
                      {errors.email.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">密码</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <FieldDescription className="text-destructive">
                      {errors.password.message}
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "登录中..." : "登录"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              还没有账户?{" "}
              <a href="/register" className="text-primary hover:underline">
                注册
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
