import { Link, useRouterState } from "@tanstack/react-router";
import { ProcionLogo } from "./ProcionLogo";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  GitBranch,
  KanbanSquare,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Users,
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
  soft?: boolean;
};

const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/base-de-conhecimento", label: "Base", icon: BookOpen, badge: "135" },
  { to: "/atualizacoes", label: "Atualizações", icon: Sparkles, badge: "3" },
  { to: "/versoes", label: "Versões", icon: GitBranch },
  { to: "/kanban", label: "Kanban", icon: KanbanSquare, badge: "12" },
  { to: "/kanban-dashboard", label: "Analytics", icon: BarChart3, badge: "6" },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/minha-conta", label: "Minha Conta", icon: CircleUser, soft: true },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const collapsed = useSidebarCollapsed();

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-[width] duration-300 ease-out",
        collapsed ? "w-[86px]" : "w-[286px]",
      )}
    >
      <div className={cn("flex items-center h-[88px] px-5", collapsed && "justify-center px-3")}>
        {collapsed ? (
          <ProcionLogo variant="mark" className="h-9 w-9" />
        ) : (
          <div className="flex items-center gap-3 min-w-0 animate-fade-in">
            <ProcionLogo variant="full" className="h-10 w-auto max-w-[190px]" />
          </div>
        )}
      </div>

      <button
        onClick={sidebarStore.toggle}
        className="absolute top-20 -right-3 z-40 grid h-7 w-7 place-items-center rounded-full border border-sidebar-border bg-card text-muted-foreground shadow-md hover:text-primary hover:border-primary/40 transition"
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <nav className="app-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-4 py-2">
        {!collapsed && (
          <p className="mb-4 px-5 text-sm font-semibold text-sidebar-foreground/25">
            Main Menu
          </p>
        )}
        <ul className="space-y-2">
          {nav.map((item) => {
            const active =
              item.to === "/kanban"
                ? pathname === "/kanban"
                : item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex h-12 items-center gap-4 rounded-r-[26px] rounded-l-lg px-4 text-[15px] font-semibold transition-all",
                    collapsed && "mx-auto w-12 justify-center rounded-2xl px-0",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_14px_30px_rgba(11,151,196,0.12)]"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/45 hover:text-sidebar-accent-foreground",
                  )}
                >
                  {active && !collapsed && (
                    <span className="absolute -left-4 top-1/2 h-9 w-1.5 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "text-sidebar-foreground")} />
                  {!collapsed && (
                    <>
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "grid min-w-7 place-items-center rounded-full px-2 py-1 text-[11px] font-bold",
                            active
                              ? "bg-primary text-primary-foreground"
                              : item.soft
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "bg-success text-success-foreground",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {(item.to === "/atualizacoes" || item.to === "/versoes") && (
                        <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground/30" />
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-sidebar" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="px-6 pb-5 animate-fade-in">
          <div className="mb-5 flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary/12 text-primary text-sm font-bold">
                AR
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-sidebar-accent-foreground">Ana Ribeiro</p>
              <p className="truncate text-xs text-sidebar-foreground/65">
                suporte@procion.com.br
              </p>
            </div>
            <ChevronRight className="h-4 w-4 rotate-90 text-sidebar-foreground/35" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-sidebar-accent-foreground">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                Task Progress
              </span>
              <span className="font-medium text-sidebar-foreground">20/45</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[44%] rounded-full bg-gradient-to-r from-primary to-[#0490d1]" />
            </div>
          </div>
        </div>
      )}

      {!collapsed && (
        <div className="px-6 pb-6 text-xs text-sidebar-foreground/55">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" />
            Portal Prócion 2026
          </div>
        </div>
      )}
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
