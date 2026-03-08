"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Plus } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TransitionPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "学习 React", completed: false },
    { id: 2, text: "构建项目", completed: true },
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const addTodo = () => {
    if (!input.trim()) return;

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTodo: Todo = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
      };
      setTodos((prev) => [...prev, newTodo]);
      setInput("");
    });
  };

  const toggleTodo = (id: number) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    });
  };

  const deleteTodo = (id: number) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">useTransition 写法</h1>
      <p className="text-muted-foreground text-sm">
        使用 useTransition，不使用 useOptimistic
      </p>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="添加新任务..."
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <Button onClick={addTodo} disabled={isPending}>
          {isPending ? (
            <span className="animate-spin">...</span>
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center ${
                  todo.completed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                }`}
                disabled={isPending}
              >
                {todo.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <span
                className={todo.completed ? "line-through text-gray-400" : ""}
              >
                {todo.text}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </li>
        ))}
      </ul>

      {isPending && (
        <div className="text-center text-sm text-gray-500">处理中...</div>
      )}
    </div>
  );
}
