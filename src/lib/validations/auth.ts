import { z } from "zod"

export const registerFormSchema = z.object({
  email: z.string().email({
    message: "请输入有效的邮箱地址",
  }),
  username: z.string().min(3, {
    message: "用户名至少需要3个字符",
  }).max(20, {
    message: "用户名不能超过20个字符",
  }).regex(/^[a-zA-Z0-9_]+$/, {
    message: "用户名只能包含字母、数字和下划线",
  }),
  password: z.string().min(6, {
    message: "密码至少需要6个字符",
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "密码必须包含至少一个大写字母、一个小写字母和一个数字",
  }),
  confirmPassword: z.string(),
  firstName: z.string().min(1, {
    message: "请输入名字",
  }),
  lastName: z.string().min(1, {
    message: "请输入姓氏",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
})

export type RegisterFormValues = z.infer<typeof registerFormSchema>