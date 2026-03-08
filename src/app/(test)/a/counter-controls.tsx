"use client";

import React, { useState } from "react";

import { useCounter } from "./counter-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CounterControls() {
  const { state, dispatch } = useCounter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  function handleSetUser() {
    if (username.trim()) {
      dispatch({
        type: "SET_USER",
        payload: { username: username.trim(), email: email.trim() },
      });
      setUsername("");
      setEmail("");
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>控制面板 (CounterControls 组件)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => dispatch({ type: "INCREMENT" })}
          >
            +1
          </Button>
          <Button
            className="flex-1"
            variant="destructive"
            onClick={() => dispatch({ type: "DECREMENT" })}
          >
            -1
          </Button>
        </div>

        <Button
          className="w-full"
          variant="secondary"
          onClick={() => dispatch({ type: "RESET" })}
        >
          重置为 0
        </Button>

        <div className="pt-4 border-t space-y-3">
          <div>
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入用户名"
            />
          </div>
          <div>
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入邮箱"
            />
          </div>
          <Button className="w-full" onClick={handleSetUser}>
            保存用户信息
          </Button>
        </div>

        <div className="pt-4 border-t text-sm text-muted-foreground">
          <p>当前用户: {state.username}</p>
          <p>当前邮箱: {state.email || "未设置"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
