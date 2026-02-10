"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userService } from "@/app/services/frontend/userService";
import { ApiError } from "@/lib/fetchwrapper";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/form-fields";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Loader2 } from "lucide-react";

// 注册表单验证模式
const registerFormSchema = z
  .object({
    email: z.string().email("请输入有效的邮箱地址"),
    username: z
      .string()
      .min(3, "用户名至少需要3个字符")
      .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
    password: z
      .string()
      .min(6, "密码至少需要6个字符")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "密码必须包含至少一个大写字母、一个小写字母和一个数字",
      ),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "请输入名字"),
    lastName: z.string().min(1, "请输入姓氏"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const { confirmPassword, ...userData } = data;

      const response = await userService.createUser(userData);

      if (response.success) {
        setIsSuccess(true);
        setMessage("用户注册成功！");
        form.reset();
        // 注册成功后，可以选择自动登录或提示用户登录
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setMessage(response.error || "注册失败");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setMessage("该邮箱或用户名已被使用");
        } else {
          setMessage(error.message || "注册失败");
        }
      } else {
        setMessage("注册过程中发生未知错误");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded text-sm ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message}
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
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            description="用户名将作为您的唯一标识，只能包含字母、数字和下划线"
          />

          <InputField
            control={form.control}
            name="password"
            label="密码"
            type="password"
            placeholder="请输入密码"
            required
            description="密码必须包含至少一个大写字母、一个小写字母和一个数字"
          />

          <InputField
            control={form.control}
            name="confirmPassword"
            label="确认密码"
            type="password"
            placeholder="请再次输入密码"
            required
          />
        </FieldGroup>

        <FieldGroup orientation="horizontal" responsive>
          <InputField
            control={form.control}
            name="firstName"
            label="名字"
            placeholder="请输入名字"
            required
          />

          <InputField
            control={form.control}
            name="lastName"
            label="姓氏"
            placeholder="请输入姓氏"
            required
          />
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-between">
        {onSwitchToLogin && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            已有账户？登录
          </Button>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "注册中..." : "注册"}
        </Button>
      </div>
    </form>
  );
}
