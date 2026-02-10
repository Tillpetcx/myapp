"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { ReactNode } from "react";

// 基础输入字段组件
interface InputFieldProps<TFieldValues extends FieldValues> {
  control: any;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function InputField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  type = "text",
  required,
  disabled,
  className,
}: InputFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      {({ value, onChange, onBlur }) => (
        <Input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={className}
        />
      )}
    </FormField>
  );
}

// 文本区域字段组件
interface TextAreaFieldProps<TFieldValues extends FieldValues> {
  control: any;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function TextAreaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  rows = 3,
  className,
}: TextAreaFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      {({ value, onChange, onBlur }) => (
        <Textarea
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          rows={rows}
          className={className}
        />
      )}
    </FormField>
  );
}

// 复选框字段组件
interface CheckboxFieldProps<TFieldValues extends FieldValues> {
  control: any;
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  className,
}: CheckboxFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
    >
      {({ value, onChange, onBlur }) => (
        <Checkbox
          checked={value || false}
          onCheckedChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={className}
        />
      )}
    </FormField>
  );
}

// 自定义字段组件
interface CustomFieldProps<TFieldValues extends FieldValues> {
  control: any;
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  children: (field: ControllerRenderProps) => ReactNode;
}

export function CustomField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  children,
}: CustomFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      {({ value, onChange, onBlur }) =>
        children({
          value,
          onChange,
          onBlur,
          name,
          ref: { current: null },
        })
      }
    </FormField>
  );
}
