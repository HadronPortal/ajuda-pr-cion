import logoUrl from "@/assets/procion-menu-logo.png?url";
import starUrl from "@/assets/procion-star.png?url";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "full" | "mark";
  className?: string;
};

export function ProcionLogo({ variant = "full", className }: Props) {
  const isMark = variant === "mark";
  const src = isMark ? starUrl : logoUrl;
  return (
    <span
      role="img"
      aria-label="Prócion"
      className={cn(
        "block shrink-0 bg-current select-none",
        isMark ? "h-9 w-9" : "h-12 w-[190px]",
        className,
      )}
      style={{
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}
