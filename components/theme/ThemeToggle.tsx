"use client"
import React from "react";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm transition-colors bg-card text-foreground border border-border hover:bg-muted"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
};
