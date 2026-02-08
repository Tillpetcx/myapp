"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { userService } from "@/app/services/frontend/userService";
import { ApiError } from "@/lib/fetchwrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Controller,
  Control,
  ControllerFieldState,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

// 自定义字段组件，结合 react-hook-form 和 shadcn/ui 的 Field
interface FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  children: (field: {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    fieldState: ControllerFieldState;
  }) => React.ReactNode;
}

function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder,
  type = "text",
  required,
  children,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            {label}
            {required && " *"}
          </FieldLabel>
          <FieldContent>
            {children({
              value: field.value,
              onChange: field.onChange,
              onBlur: field.onBlur,
              fieldState,
            })}
          </FieldContent>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError
            errors={
              fieldState.error
                ? [{ message: fieldState.error?.message }]
                : undefined
            }
          />
        </Field>
      )}
    />
  );
}

export default function RegisterPage() {
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
      } else {
        setMessage(response.error || "注册失败");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        // 处理API错误
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">用户注册</h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldSet>
          <FieldGroup>
            <FormField
              control={form.control}
              name="email"
              label="邮箱"
              required
            >
              {({ value, onChange, onBlur }) => (
                <Input
                  type="email"
                  placeholder="请输入邮箱"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="username"
              label="用户名"
              description="用户名将作为您的唯一标识，只能包含字母、数字和下划线"
            >
              {({ value, onChange, onBlur }) => (
                <Input
                  placeholder="请输入用户名"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="password"
              label="密码"
              required
              description="密码必须包含至少一个大写字母、一个小写字母和一个数字"
            >
              {({ value, onChange, onBlur }) => (
                <Input
                  type="password"
                  placeholder="请输入密码"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="confirmPassword"
              label="确认密码"
              required
            >
              {({ value, onChange, onBlur }) => (
                <Input
                  type="password"
                  placeholder="请再次输入密码"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            </FormField>
          </FieldGroup>

          <FieldGroup orientation="horizontal" responsive>
            <FormField
              control={form.control}
              name="firstName"
              label="名字"
              required
            >
              {({ value, onChange, onBlur }) => (
                <Input
                  placeholder="请输入名字"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            </FormField>

            <FormField
              control={form.control}
              name="lastName"
              label="姓氏"
              required
            >
              {({ value, onChange, onBlur }) => (
                <Input
                  placeholder="请输入姓氏"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            </FormField>
          </FieldGroup>
        </FieldSet>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "注册中..." : "注册"}
        </Button>
      </form>
    </div>
  );
}
