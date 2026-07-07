import logoUrl from "@/assets/procion-menu-logo.png?url";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "full" | "mark";
  className?: string;
};

export function ProcionLogo({ variant = "full", className }: Props) {
  return (
    <span
      role="img"
      aria-label="Prócion"
      className={cn(
        "block shrink-0 bg-current select-none",
        variant === "mark" ? "h-8 w-12" : "h-10 w-[154px]",
        className,
      )}
      style={{
        WebkitMask: `url(${logoUrl}) center / contain no-repeat`,
        mask: `url(${logoUrl}) center / contain no-repeat`,
      }}
    />
  );
}
