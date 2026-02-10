"use client";

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
  FieldLabel,
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

export function FormField<
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
