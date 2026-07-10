import { useEffect, useState } from "react";
import { HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "./CommandPalette";
import { NotificationsPopover } from "./NotificationsPopover";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { currentUser } from "@/lib/mock-data";

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function AppHeader() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [greeting, setGreeting] = useState(() => getGreeting(new Date().getHours()));
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting(new Date().getHours())), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="h-full px-4 sm:px-6 lg:px-7 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <p className="truncate text-[15px] font-semibold text-foreground">
            <span className="text-muted-foreground font-normal">{greeting}, </span>
            PRC {currentUser.name}
          </p>
        </div>

        <div className="ml-auto hidden items-center gap-1 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Ajuda"
          >
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
          <ThemeToggle />
          <NotificationsPopover />
          <div className="ml-1">
            <UserMenu />
          </div>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
