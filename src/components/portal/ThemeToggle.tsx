import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { themeStore, useTheme } from "@/lib/theme-store";

export function ThemeToggle() {
  const theme = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={themeStore.toggle}
      className="focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground" />
      )}
    </Button>
  );
}
