"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table";
import { userService, type User } from "@/app/services/frontend/userService";
import { ApiError } from "@/lib/fetchwrapper";
import { UserFilters } from "@/components/user-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  UserCheck,
  UserX,
  ShieldCheck,
  Shield,
  User as UserIcon,
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 获取用户列表的函数
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = showDeleted
        ? await userService.getDeletedUsers()
        : await userService.getUsers();

      if (response.success && response.data) {
        // 如果是分页响应，提取用户数据
        if ("data" in response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError("获取的用户数据格式不正确");
        }
      } else {
        setError(response.error || "获取用户列表失败");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("获取用户列表时发生错误");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [showDeleted]);

  const handleRestoreUser = async (id: string) => {
    try {
      const response = await userService.restoreUser(id);
      if (response.success) {
        // 从列表中移除已恢复的用户
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setError(response.error || "恢复用户失败");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("恢复用户时发生错误");
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("确定要永久删除此用户吗？此操作不可撤销！")) {
      return;
    }

    try {
      const response = await userService.permanentlyDeleteUser(id);
      if (response.success) {
        // 从列表中移除已删除的用户
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setError(response.error || "永久删除用户失败");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("永久删除用户时发生错误");
      }
    }
  };

  const handleToggleUserStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await userService.updateUserStatus(id, !isActive);
      if (response.success && response.data) {
        // 更新本地状态
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, isActive: !isActive } : user,
          ),
        );
      } else {
        setError(response.error || "更新用户状态失败");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("更新用户状态时发生错误");
      }
    }
  };

  const handleChangeUserRole = async (
    id: string,
    role: "USER" | "ADMIN" | "MODERATOR",
  ) => {
    try {
      const response = await userService.changeUserRole(id, role);
      if (response.success && response.data) {
        // 更新本地状态
        setUsers(
          users.map((user) => (user.id === id ? { ...user, role } : user)),
        );
      } else {
        setError(response.error || "更改用户角色失败");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("更改用户角色时发生错误");
      }
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          邮箱
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "username",
      header: "用户名",
      cell: ({ row }) => <div>{row.getValue("username") || "-"}</div>,
    },
    {
      accessorKey: "name",
      header: "姓名",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div>
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName || user.lastName || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "角色",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <div className="flex items-center">
            {role === "ADMIN" && (
              <ShieldCheck className="h-4 w-4 mr-2 text-red-500" />
            )}
            {role === "MODERATOR" && (
              <Shield className="h-4 w-4 mr-2 text-yellow-500" />
            )}
            {role === "USER" && (
              <UserIcon className="h-4 w-4 mr-2 text-green-500" />
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                role === "ADMIN"
                  ? "bg-red-100 text-red-800"
                  : role === "MODERATOR"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {role === "ADMIN"
                ? "管理员"
                : role === "MODERATOR"
                  ? "版主"
                  : "普通用户"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {user.isActive ? "活跃" : "未激活"}
            </span>
            {user.isVerified && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                已验证
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          注册时间
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          {new Date(row.getValue("createdAt")).toLocaleDateString("zh-CN")}
        </div>
      ),
    },
    ...(showDeleted
      ? [
          {
            accessorKey: "deletedAt",
            header: "删除时间",
            cell: ({ row }) => {
              const deletedAt = row.original.deletedAt;
              return deletedAt ? (
                <div>{new Date(deletedAt).toLocaleDateString("zh-CN")}</div>
              ) : (
                <div>-</div>
              );
            },
          } as ColumnDef<User>,
        ]
      : []),
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">打开菜单</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {!showDeleted && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      handleToggleUserStatus(user.id, user.isActive)
                    }
                  >
                    {user.isActive ? (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        禁用账户
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        启用账户
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleChangeUserRole(
                        user.id,
                        user.role === "USER"
                          ? "MODERATOR"
                          : user.role === "MODERATOR"
                            ? "ADMIN"
                            : "USER",
                      )
                    }
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    更改角色
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </>
              )}

              {showDeleted && (
                <>
                  <DropdownMenuItem onClick={() => handleRestoreUser(user.id)}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    恢复用户
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem
                onClick={() =>
                  showDeleted
                    ? handleDeleteUser(user.id)
                    : (async () => {
                        try {
                          const response = await userService.deleteUser(
                            user.id,
                          );
                          if (response.success) {
                            setUsers(users.filter((u) => u.id !== user.id));
                          } else {
                            setError(response.error || "删除用户失败");
                          }
                        } catch (err) {
                          if (err instanceof ApiError) {
                            setError(err.message);
                          } else {
                            setError("删除用户时发生错误");
                          }
                        }
                      })()
                }
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {showDeleted ? "永久删除" : "删除用户"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-50 rounded-lg">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {showDeleted ? "已删除用户" : "用户列表"}
        </h1>
        <div className="flex space-x-2">
          <Input
            placeholder="搜索用户..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            onClick={() => setShowDeleted(!showDeleted)}
          >
            {showDeleted ? "显示活跃用户" : "显示已删除用户"}
          </Button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {showDeleted ? "暂无已删除的用户" : "暂无用户数据"}
        </div>
      ) : (
        <>
          <div className="w-full">
            <UserFilters
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              emailFilter={emailFilter}
              setEmailFilter={setEmailFilter}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              showDeleted={showDeleted}
              setShowDeleted={setShowDeleted}
              onRefresh={fetchUsers}
              table={table}
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="按邮箱筛选..."
                  value={
                    (table.getColumn("email")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("email")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
              </div>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      没有结果
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              已选择 {table.getFilteredSelectedRowModel().rows.length} 条，共{" "}
              {table.getFilteredRowModel().rows.length} 条记录
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                下一页
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
