"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  RotateCcw,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

interface UserFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  emailFilter: string;
  setEmailFilter: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  showDeleted: boolean;
  setShowDeleted: (value: boolean) => void;
  onRefresh: () => void;
  table: any; // 添加 table 参数
}

export function UserFilters({
  globalFilter,
  setGlobalFilter,
  emailFilter,
  setEmailFilter,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  showDeleted,
  setShowDeleted,
  onRefresh,
  table, // 添加 table 参数
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="搜索用户..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" size="sm" onClick={onRefresh}>
          刷新
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <FieldGroup orientation="horizontal" responsive>
          <Field>
            <FieldLabel>角色</FieldLabel>
            <FieldContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-40 justify-start">
                    {roleFilter || "全部"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>选择角色</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRoleFilter("")}>
                    全部
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("USER")}>
                    普通用户
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("MODERATOR")}>
                    版主
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("ADMIN")}>
                    管理员
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>状态</FieldLabel>
            <FieldContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-40 justify-start">
                    {statusFilter || "全部"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>选择状态</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("")}>
                    全部
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    活跃
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                    未激活
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("verified")}>
                    已验证
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("unverified")}
                  >
                    未验证
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </FieldContent>
          </Field>
        </FieldGroup>

        <Button
          variant={showDeleted ? "default" : "outline"}
          onClick={() => setShowDeleted(!showDeleted)}
        >
          {showDeleted ? "显示活跃用户" : "显示已删除用户"}
        </Button>
      </div>
    </div>
  );
}
