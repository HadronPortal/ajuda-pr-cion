import { Link, useRouterState } from "@tanstack/react-router";
import { ProcionLogo } from "./ProcionLogo";
import { CalendarDays, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import type { ComponentType } from "react";
import dashboardIconUrl from "@/assets/menu-dashboard-solid.png";
import ticketsIconUrl from "@/assets/menu-tickets-solid.png";
import baseIconUrl from "@/assets/menu-base-solid.png";
import updatesIconUrl from "@/assets/menu-updates-solid.png";

import kanbanIconUrl from "@/assets/menu-kanban-solid.png";
import analyticsIconUrl from "@/assets/menu-analytics-solid.png";
import customersIconUrl from "@/assets/menu-customers-solid.png";
import calendarIconUrl from "@/assets/ticket-schedule-solid.png";
import fleetIconUrl from "@/assets/menu-fleet-solid.png";
import hadronIconUrl from "@/assets/menu-hadron-solid.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { sidebarStore, useSidebarCollapsed } from "@/lib/sidebar-store";

type NavIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

type NavItem = {
  to: string;
  label: string;
  icon: NavIcon;
  exact?: boolean;
};

function createMaskedMenuIcon(maskUrl: string): NavIcon {
  return function MaskedMenuIcon({ className }) {
    return (
      <span
        aria-hidden="true"
        className={cn("block bg-current", className)}
        style={{
          WebkitMask: `url(${maskUrl}) center / contain no-repeat`,
          mask: `url(${maskUrl}) center / contain no-repeat`,
        }}
      />
    );
  };
}

const DashboardIcon = createMaskedMenuIcon(dashboardIconUrl);
const TicketsIcon = createMaskedMenuIcon(ticketsIconUrl);
const BaseIcon = createMaskedMenuIcon(baseIconUrl);
const UpdatesIcon = createMaskedMenuIcon(updatesIconUrl);

const KanbanIcon = createMaskedMenuIcon(kanbanIconUrl);
const AnalyticsIcon = createMaskedMenuIcon(analyticsIconUrl);
const CustomersIcon = createMaskedMenuIcon(customersIconUrl);
const CalendarIcon = createMaskedMenuIcon(calendarIconUrl);
const FleetIcon = createMaskedMenuIcon(fleetIconUrl);
const HadronIcon = createMaskedMenuIcon(hadronIconUrl);

const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: DashboardIcon, exact: true },
  { to: "/chamados", label: "Chamados", icon: TicketsIcon },
  { to: "/calendario", label: "Calendário", icon: CalendarIcon },
  { to: "/frota", label: "Frota", icon: FleetIcon },
  { to: "/iniciar-hadron", label: "Hadron", icon: HadronIcon },
  { to: "/base-de-conhecimento", label: "Base", icon: BaseIcon },
  { to: "/atualizacoes", label: "Atualizações", icon: UpdatesIcon },
  { to: "/analytics", label: "Analytics", icon: AnalyticsIcon },
  { to: "/kanban", label: "Kanban", icon: KanbanIcon },
  { to: "/clientes", label: "Clientes", icon: CustomersIcon },
];

function isActivePath(pathname: string, item: NavItem) {
  if (item.to === "/kanban") return pathname === "/kanban";
  return item.exact ? pathname === item.to : pathname.startsWith(item.to);
}

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
      <button
        type="button"
        onClick={sidebarStore.toggle}
        className="absolute -right-4 top-10 z-40 grid h-8 w-8 place-items-center rounded-full border border-sidebar-border bg-card text-muted-foreground shadow-[0_8px_22px_rgba(15,23,42,0.16)] transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-sidebar dark:text-sidebar-foreground/75"
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className={cn("flex h-[88px] items-center px-5", collapsed && "justify-center px-3")}>
        {collapsed ? (
          <ProcionLogo
            variant="mark"
            className="text-sidebar-accent-foreground dark:text-sidebar-foreground"
          />
        ) : (
          <div className="flex min-w-0 animate-fade-in items-center gap-3 text-sidebar-accent-foreground dark:text-sidebar-foreground">
            <ProcionLogo variant="full" />
          </div>
        )}
      </div>

      <nav className="app-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-4 py-2">
        {!collapsed && (
          <p className="mb-4 px-5 text-sm font-semibold text-sidebar-foreground/25">Main Menu</p>
        )}
        <ul className="space-y-2">
          {nav.map((item) => {
            const active = isActivePath(pathname, item);
            const Icon = item.icon;

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex h-12 items-center gap-4 rounded-l-lg rounded-r-[26px] px-4 text-[15px] font-semibold transition-all",
                    collapsed && "mx-auto w-12 justify-center rounded-2xl px-0",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_14px_30px_rgba(11,151,196,0.12)]"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/45 hover:text-sidebar-accent-foreground",
                  )}
                >
                  {active && !collapsed && (
                    <span className="absolute -left-4 top-1/2 h-9 w-1.5 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon
                    className={cn(
                      "h-[22px] w-[22px] shrink-0 transition-colors",
                      active
                        ? "text-primary"
                        : "text-sidebar-foreground/70 group-hover:text-primary dark:text-sidebar-foreground/85",
                    )}
                  />
                  {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="animate-fade-in px-6 pb-5">
          <div className="mb-5 flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary/12 text-sm font-bold text-primary">
                AR
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-sidebar-accent-foreground">
                Ana Ribeiro
              </p>
              <p className="truncate text-xs text-sidebar-foreground/65">suporte@procion.com.br</p>
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
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = isActivePath(pathname, item);
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
                <Icon className="h-[22px] w-[22px]" />
                <span className="max-w-[64px] truncate">{item.label.split(" ")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
