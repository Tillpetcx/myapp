"use client";

import { useTabs } from "./tabs-context";
import { Button } from "@/components/ui/button";

export default function TabActionButtons() {
  const { activeTab } = useTabs();

  if (activeTab === "users") {
    return (
      <div className="mt-6 flex justify-center">
        <Button>添加用户</Button>
      </div>
    );
  }

  if (activeTab === "posts") {
    return (
      <div className="mt-6 flex justify-center">
        <Button>添加文章</Button>
      </div>
    );
  }

  return null;
}
