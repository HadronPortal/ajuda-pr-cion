import logoAsset from "@/assets/procion-logo.png.asset.json";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "full" | "mark";
  className?: string;
};

/**
 * Prócion brand logo. Source asset is white + cyan (optimized for dark backgrounds).
 * In light mode we invert brightness while preserving hue so the cyan stays cyan
 * and the white becomes near-black.
 */
export function ProcionLogo({ variant = "full", className }: Props) {
  return (
    <img
      src={logoAsset.url}
      alt="Prócion"
      className={cn(
        "object-contain select-none",
        // light: flip luminance, preserve cyan; dark: leave as-is (white + cyan)
        "[filter:invert(1)_hue-rotate(180deg)] dark:[filter:none]",
        variant === "mark" ? "h-8 w-8" : "h-9 w-auto",
        className,
      )}
      draggable={false}
    />
  );
}
