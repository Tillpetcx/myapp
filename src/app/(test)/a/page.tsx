"use client";

import { CounterProvider } from "./counter-context";
import CounterDisplay from "./counter-display";
import CounterControls from "./counter-controls";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function APage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>useContext + useReducer 典型示例</CardTitle>
          <CardDescription>
            这个示例展示了 React 中状态管理的两种 Hook 的组合用法
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">概念说明：</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>useContext</strong> -
                用于在组件树中共享数据，避免层层传递 props
              </li>
              <li>
                <strong>useReducer</strong> - 用于管理复杂的状态逻辑，类似于
                Redux 的模式
              </li>
              <li>
                <strong>组合使用</strong> - 用 useReducer 管理状态，用
                useContext 分发状态
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <CounterProvider>
        <div className="grid md:grid-cols-2 gap-6">
          <CounterDisplay />
          <CounterControls />
        </div>
      </CounterProvider>

      <Card>
        <CardHeader>
          <CardTitle>工作原理图解</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-2 text-sm">
            <div className="border p-3 rounded bg-primary text-primary-foreground">
              CounterProvider (useReducer)
            </div>
            <div className="text-lg">↓ 共享 state 和 dispatch</div>
            <div className="flex gap-4">
              <div className="border p-3 rounded">
                CounterDisplay
                <br />
                <span className="text-xs text-muted-foreground">
                  (读取状态)
                </span>
              </div>
              <div className="border p-3 rounded">
                CounterControls
                <br />
                <span className="text-xs text-muted-foreground">
                  (修改状态)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
