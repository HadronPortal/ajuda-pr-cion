import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  to?: string;
};

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-4 flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <Link
        to="/"
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Início</span>
      </Link>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={`${item.label}-${i}`}>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            {item.to && !last ? (
              <Link
                to={item.to as string}
                className="hover:text-foreground transition-colors truncate max-w-[220px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "truncate max-w-[280px]",
                  last && "text-foreground font-medium",
                )}
                aria-current={last ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
