"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { registerUser } from "./_fetch/register";

const registerSchema = z
  .object({
    email: z.string().min(1, "请输入邮箱").email("请输入有效的邮箱地址"),
    password: z.string().min(8, "密码至少需要8个字符"),
    confirmPassword: z.string().min(1, "请确认密码"),
    username: z
      .string()
      .min(3, "用户名至少需要3个字符")
      .max(50, "用户名最多50个字符")
      .optional()
      .or(z.literal("")),
    displayName: z
      .string()
      .min(1, "请输入显示名称")
      .max(120, "显示名称最多120个字符")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      displayName: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        username: data.username || undefined,
        displayName: data.displayName || undefined,
      });

      toast.success("注册成功，正在跳转...");

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("注册成功，但登录失败，请手动登录");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("邮箱")) {
          setError("email", { message: error.message });
        } else if (error.message.includes("用户名")) {
          setError("username", { message: error.message });
        } else {
          toast.error(error.message || "注册失败，请稍后重试");
        }
      } else {
        toast.error("注册失败，请稍后重试");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">创建账户</CardTitle>
          <CardDescription>输入您的信息来创建一个新账户</CardDescription>
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
                    {...register("email")}
                  />
                  {errors.email && (
                    <FieldDescription className="text-destructive">
                      {errors.email.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="username">用户名</FieldLabel>
                  <Input
                    id="username"
                    placeholder="username"
                    {...register("username")}
                  />
                  {errors.username && (
                    <FieldDescription className="text-destructive">
                      {errors.username.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="displayName">显示名称</FieldLabel>
                  <Input
                    id="displayName"
                    placeholder="显示名称"
                    {...register("displayName")}
                  />
                  {errors.displayName && (
                    <FieldDescription className="text-destructive">
                      {errors.displayName.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">密码</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="至少8个字符"
                    {...register("password")}
                  />
                  {errors.password && (
                    <FieldDescription className="text-destructive">
                      {errors.password.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">确认密码</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="再次输入密码"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <FieldDescription className="text-destructive">
                      {errors.confirmPassword.message}
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "注册中..." : "注册"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              已有账户?{" "}
              <a href="/login" className="text-primary hover:underline">
                登录
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
