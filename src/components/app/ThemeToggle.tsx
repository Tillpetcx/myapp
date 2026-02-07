"use client"; // 必须是 Client Component

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react"; // 或你自己的图标
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  // 应用主题到 html
  const applyTheme = (mode: "light" | "dark") => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  // 初始化：优先 localStorage → 系统偏好
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    console.log("Saved theme:", savedTheme);
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // 默认跟随系统
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme("system");
      applyTheme(initial);
    }
  }, []);

  // 切换逻辑
  const toggleTheme = () => {
    let newTheme: "light" | "dark";
    console.log("Current theme:", theme);
    console.log(
      "当前主题:",
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
    console.log(
      "当前 --primary 值:",
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim(),
    );
    if (theme === "system") {
      // 从 system → 强制相反的当前系统状态
      const isCurrentlyDark =
        document.documentElement.classList.contains("dark");
      newTheme = isCurrentlyDark ? "light" : "dark";
    } else {
      newTheme = theme === "dark" ? "light" : "dark";
    }
    console.log("New theme:", newTheme);
    setTheme(
      newTheme ===
        (document.documentElement.classList.contains("dark") ? "dark" : "light")
        ? "system"
        : newTheme,
    );
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // 监听系统变化（仅当用户选择 "system" 时生效）
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <Button onClick={toggleTheme} aria-label="切换主题">
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </Button>
  );
}
