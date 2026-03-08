"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2, Plus } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function NormalPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "学习 React", completed: false },
    { id: 2, text: "构建项目", completed: true },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addTodo = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
    setInput("");
    setIsLoading(false);
  };

  const toggleTodo = async (id: number) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    setIsLoading(false);
  };

  const deleteTodo = async (id: number) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">普通写法</h1>
      <p className="text-muted-foreground text-sm">
        不使用 useTransition 和 useOptimistic
      </p>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="添加新任务..."
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          disabled={isLoading}
        />
        <Button onClick={addTodo} disabled={isLoading}>
          {isLoading ? (
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
                disabled={isLoading}
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
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </li>
        ))}
      </ul>

      {isLoading && (
        <div className="text-center text-sm text-gray-500">加载中...</div>
      )}
    </div>
  );
}
