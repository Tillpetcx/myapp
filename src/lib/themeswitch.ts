function switchTheme(theme: "blue" | "green" | "purple", mode: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  
  // 可选：保存到 localStorage
  localStorage.setItem("preferred-theme", theme);
  localStorage.setItem("preferred-mode", mode);
}