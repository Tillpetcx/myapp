"use client";

import { useCounter } from "./counter-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CounterDisplay() {
  const { state, dispatch } = useCounter();

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>计数器 (CounterDisplay 组件)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-4xl font-bold">{state.count}</div>

        <div className="flex gap-2 justify-center">
          <Button onClick={() => dispatch({ type: "DECREMENT" })}>-</Button>
          <Button onClick={() => dispatch({ type: "INCREMENT" })}>+</Button>
          <Button variant="outline" onClick={() => dispatch({ type: "RESET" })}>
            重置
          </Button>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="text-sm text-muted-foreground">
            用户名: {state.username}
          </div>
          <div className="text-sm text-muted-foreground">
            邮箱: {state.email || "未设置"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
