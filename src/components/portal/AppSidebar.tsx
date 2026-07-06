import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  GitBranch,
  KanbanSquare,
  Users,
  UserCircle,
  Sparkle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const nav: NavItem[] = [
  { to: "/", label: "Início", icon: LayoutDashboard, exact: true },
  { to: "/base-de-conhecimento", label: "Base de Conhecimento", icon: BookOpen },
  { to: "/atualizacoes", label: "Atualizações", icon: Sparkles },
  { to: "/versoes", label: "Versões", icon: GitBranch },
  { to: "/kanban", label: "Kanban Prócion", icon: KanbanSquare },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/minha-conta", label: "Minha Conta", icon: UserCircle },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-sidebar-border">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkle className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none">Portal Prócion</p>
          <p className="text-[11px] text-sidebar-foreground/60 mt-1">Sistemas</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-2">
          Navegação
        </p>
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs font-medium text-sidebar-accent-foreground">Precisa de ajuda?</p>
          <p className="text-[11px] text-sidebar-foreground/60 mt-0.5">
            Fale com o time de suporte Prócion.
          </p>
          <button className="mt-2 w-full rounded-md bg-sidebar-primary px-2 py-1.5 text-[11px] font-medium text-sidebar-primary-foreground hover:opacity-90 transition">
            Abrir chamado
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = nav.slice(0, 5);
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-card/95 backdrop-blur">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate max-w-[64px]">{item.label.split(" ")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
