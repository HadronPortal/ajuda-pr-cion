import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  GitBranch,
  KanbanSquare,
  Users,
  UserCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { sidebarStore, useSidebarCollapsed } from "@/lib/sidebar-store";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: string;
};

const nav: NavItem[] = [
  { to: "/", label: "Início", icon: LayoutDashboard, exact: true },
  { to: "/base-de-conhecimento", label: "Base de Conhecimento", icon: BookOpen, badge: "128" },
  { to: "/atualizacoes", label: "Atualizações", icon: Sparkles, badge: "3" },
  { to: "/versoes", label: "Versões", icon: GitBranch },
  { to: "/kanban", label: "Kanban Prócion", icon: KanbanSquare, badge: "12" },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/minha-conta", label: "Minha Conta", icon: UserCircle },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const collapsed = useSidebarCollapsed();

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-[width] duration-300 ease-out",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-sidebar-border/70">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm shadow-sm">
          P
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fade-in">
            <p className="text-sm font-semibold leading-none tracking-tight">Portal Prócion</p>
            <p className="text-[11px] text-sidebar-foreground/60 mt-1">Sistemas ERP</p>
          </div>
        )}
        <button
          onClick={sidebarStore.toggle}
          className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/40 mb-2">
            Navegação
          </p>
        )}
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm shadow-sidebar-primary/25"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-sidebar-primary-foreground")} />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-md min-w-[22px] text-center",
                            active
                              ? "bg-white/20 text-sidebar-primary-foreground"
                              : "bg-sidebar-accent text-sidebar-foreground/80",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Progress block */}
      {!collapsed && (
        <div className="px-3 pb-3 animate-fade-in">
          <div className="rounded-xl bg-gradient-to-br from-sidebar-accent to-sidebar-accent/40 border border-sidebar-border/60 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-sidebar-accent-foreground">Suas tarefas hoje</p>
              <span className="text-[10px] font-medium text-sidebar-foreground/60">7 / 12</span>
            </div>
            <div className="h-1.5 rounded-full bg-sidebar/60 overflow-hidden">
              <div className="h-full rounded-full bg-sidebar-primary" style={{ width: "58%" }} />
            </div>
            <p className="text-[10px] text-sidebar-foreground/55 mt-2 leading-relaxed">
              5 demandas em andamento no Kanban Prócion.
            </p>
          </div>
        </div>
      )}

      {/* User block */}
      <div
        className={cn(
          "border-t border-sidebar-border/70 p-3 flex items-center gap-3",
          collapsed && "justify-center",
        )}
      >
        <Avatar className="h-9 w-9 ring-2 ring-sidebar-primary/40 shrink-0">
          <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary-foreground text-xs font-semibold">
            AR
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="min-w-0 flex-1 animate-fade-in">
            <p className="text-sm font-medium truncate">Ana Ribeiro</p>
            <p className="text-[11px] text-sidebar-foreground/55 truncate">Suporte · Prócion</p>
          </div>
        )}
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
