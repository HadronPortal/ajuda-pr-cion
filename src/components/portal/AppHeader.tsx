import { useState } from "react";
import { HelpCircle, Menu, Search, Command as CommandIcon, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "./CommandPalette";
import { NotificationsPopover } from "./NotificationsPopover";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { sidebarStore } from "@/lib/sidebar-store";

export function AppHeader() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-[#edf0f6] bg-background/85 backdrop-blur-xl">
      <div className="h-full px-4 sm:px-6 lg:px-7 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={sidebarStore.toggle}
          className="hidden lg:inline-flex rounded-xl border border-[#edf0f6] bg-white text-[#8b91ad] shadow-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Recolher menu lateral"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>


        <div className="flex-1 max-w-xl">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="group w-full h-10 flex items-center gap-2 pl-3 pr-2 rounded-xl border border-[#edf0f6] bg-white text-sm text-muted-foreground shadow-sm hover:border-primary/40 hover:bg-card transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left truncate">
              Buscar em manuais, artigos, versões...
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono text-muted-foreground group-hover:border-primary/30 transition">
              <CommandIcon className="h-3 w-3" />K
            </kbd>
          </button>
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
