"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useLayoutEffect } from "react";
import ThemeToggle from "@/components/app/ThemeToggle"; // 或你自己的图标
export default function Home() {
  return (
    <>
      <ThemeToggle />
    </>
  );
}
